// Event Hanler module để xử lý các sự kiện trên DOM

// Lấy namespace từ tên sự kiện: click.bs.modal -> bs.modal
const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
// Lấy tên sự kiện từ tên sự kiện: click.bs.modal -> click
const stripNameRegex = /\..*/;
// Lấy uid từ tên sự kiện: click.bs.modal::123 -> 123
const stripUidRegex = /::\d+$/;
const eventRegistry = {}; // Lưu trữ tất cả các sự kiện đã đăng ký
let uidEvent = 1;
// Chuyển đổi sự kiến vì chúng hoạt động giống nhau
const customEvents = {
    mouseenter: 'mouseover',
    mouseleave: 'mouseout',
};

const nativeEvents = new Set([
    'click',
    'dblclick',
    'mouseup',
    'mousedown',
    'contextmenu',
    'mousewheel',
    'DOMMouseScroll',
    'mouseover',
    'mouseout',
    'mousemove',
    'selectstart',
    'selectend',
    'keydown',
    'keypress',
    'keyup',
    'orientationchange',
    'touchstart',
    'touchmove',
    'touchend',
    'touchcancel',
    'pointerdown',
    'pointermove',
    'pointerup',
    'pointerleave',
    'pointercancel',
    'gesturestart',
    'gesturechange',
    'gestureend',
    'focus',
    'blur',
    'change',
    'reset',
    'select',
    'submit',
    'focusin',
    'focusout',
    'load',
    'unload',
    'beforeunload',
    'resize',
    'move',
    'DOMContentLoaded',
    'readystatechange',
    'error',
    'abort',
    'scroll',
]);

const makeEventUid = (element, uid) => {
    return (uid && `${uid}::${uidEvent++}`) || element.uidEvent || uidEvent++;
};

// Lấy danh sách các sự kiện đã đăng ký cho một phần tử
const getElementEvents = (element) => {
    const uid = makeEventUid(element);
    element.uidEvent = uid;
    eventRegistry[uid] = eventRegistry[uid] || {};

    return eventRegistry[uid];
};

// 'click.bs.button' --> 'click'
const getTypeEvent = (event) => {
    event = event.replace(stripNameRegex, '');
    return customEvents[event] || event;
};

// Tìm kiếm một sự kiện trong danh sách các sự kiện đã đăng ký
// callable: hàm xử lý sự kiện
// delegationSelector: selector để delegate sự kiện
const findHandler = (events, callable, delegationSelector = null) => {
    return Object.values(events).find(
        (event) =>
            event.callable === callable &&
            event.delegationSelector === delegationSelector
    );
};

// Chuẩn hóa các tham số của sự kiện
function normalizeParameters(originalTypeEvent, handler, delegationFn) {
    const isDelegated = typeof handler === 'string';

    // Nếu là một chuỗi thì nó là một selector
    // Nếu không phải là một chuỗi thì nó là một hàm
    const callable = isDelegated ? delegationFn : handler || delegationFn;
    let typeEvent = getTypeEvent(originalTypeEvent);

    if (!nativeEvents.has(typeEvent)) {
        typeEvent = originalTypeEvent;
    }

    return [isDelegated, callable, typeEvent];
}

// Hydrate object: thêm các thuộc tính vào một đối tượng
// Nếu không thể thêm thuộc tính thì sử dụng Object.defineProperty để thêm thuộc tính
const hydrateObj = (obj, meta = {}) => {
    for (const [key, value] of Object.entries(meta)) {
        try {
            obj[key] = value;
        } catch {
            Object.defineProperty(obj, key, {
                configurable: true,
                get() {
                    return value;
                },
            });
        }
    }

    return obj;
};

const nbsHandler = (element, fn) => {
    return function handler(event) {
        hydrateObj(event, { delegateTarget: element });

        if (handler.oneOff) {
            EventHandler.off(element, event.type, fn);
        }

        return fn.apply(element, [event]);
    };
};

const nbsDelegationHandler = (element, selector, fn) => {
    return function handler(event) {
        const domElements = element.querySelectorAll(selector);

        for (
            let { target } = event;
            target && target !== this;
            target = target.parentNode
        ) {
            for (const domElement of domElements) {
                if (domElement !== target) {
                    continue;
                }

                hydrateObj(event, { delegateTarget: target });

                if (handler.oneOff) {
                    EventHandler.off(element, event.type, selector, fn);
                }

                return fn.apply(target, [event]);
            }
        }
    };
};

// oneOff: chỉ chạy một lần hay không
const addHandler = (element, event, handler, delegationFn, oneOff) => {
    if (typeof event !== 'string' || !element) return;

    let [isDelegated, callable, typeEvent] = normalizeParameters(
        event,
        handler,
        delegationFn
    );

    if (event in customEvents) {
        const wrapFunction = (fn) => {
            return function (event) {
                if (
                    !event.relatedTarget ||
                    (event.relatedTarget !== event.delegateTarget &&
                        !event.delegateTarget.contains(event.relatedTarget))
                ) {
                    return fn.call(this, event);
                }
            };
        };

        callable = wrapFunction(callable);
    }

    const events = getElementEvents(element);
    const handlers = events[typeEvent] || (events[typeEvent] = {});
    const previousFunction = findHandler(
        handlers,
        callable,
        isDelegated ? handler : null
    );

    // Nếu đã tồn tại sự kiện thì không thêm mới
    if (previousFunction) {
        previousFunction.oneOff = previousFunction.oneOff && oneOff;

        return;
    }

    const uid = makeEventUid(callable, event.replace(namespaceRegex, ''));
    const fn = isDelegated
        ? nbsDelegationHandler(element, handler, callable)
        : nbsHandler(element, callable);

    fn.delegationSelector = isDelegated ? handler : null;
    fn.callable = callable;
    fn.oneOff = oneOff;
    fn.uidEvent = uid;
    handlers[uid] = fn;

    element.addEventListener(typeEvent, fn, isDelegated);
};

const removeHandler = (
    element,
    events,
    typeEvent,
    handler,
    delegationSelector
) => {
    const fn = findHandler(events[typeEvent], handler, delegationSelector);

    if (!fn) {
        return;
    }

    element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
    delete events[typeEvent][fn.uidEvent];
};

const removeNamespacedHandlers = (element, events, typeEvent, namespace) => {
    const storeElementEvent = events[typeEvent] || {};

    for (const [handlerKey, event] of Object.entries(storeElementEvent)) {
        if (handlerKey.includes(namespace)) {
            removeHandler(
                element,
                events,
                typeEvent,
                event.callable,
                event.delegationSelector
            );
        }
    }
};

const EventHandler = {
    on(element, event, handler, delegationFn) {
        addHandler(element, event, handler, delegationFn, false);
    },

    one(element, event, handler, delegationFn) {
        addHandler(element, event, handler, delegationFn, true);
    },

    off(element, originalTypeEvent, handler, delegationFn) {
        if (typeof originalTypeEvent !== 'string' || !element) return;

        const [isDelegated, callable, typeEvent] = normalizeParameters(
            originalTypeEvent,
            handler,
            delegationFn
        );
        const inNamespace = typeEvent !== originalTypeEvent;
        const events = getElementEvents(element);
        const storeElementEvent = events[typeEvent] || {};
        const isNamespace = originalTypeEvent.startsWith('.');

        if (typeof callable !== 'undefined') {
            if (!Object.keys(storeElementEvent).length) {
                return;
            }

            removeHandler(
                element,
                events,
                typeEvent,
                callable,
                isDelegated ? handler : null
            );
            return;
        }

        if (isNamespace) {
            for (const elementEvent of Object.keys(events)) {
                removeNamespacedHandlers(
                    element,
                    events,
                    elementEvent,
                    originalTypeEvent.slice(1)
                );
            }
        }

        for (const [keyHandlers, event] of Object.entries(storeElementEvent)) {
            const handlerKey = keyHandlers.replace(stripUidRegex, '');

            if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
                removeHandler(
                    element,
                    events,
                    typeEvent,
                    event.callable,
                    event.delegationSelector
                );
            }
        }
    },

    trigger(element, event, args = {}) {
        if (typeof event !== 'string' || !element) {
            return null;
        }

        // Xác định xem có namespace không (VD: "click.bs.button" → "click")
        const typeEvent = event.split('.')[0];

        // Tạo sự kiện native
        const evt = new Event(typeEvent, { bubbles: true, cancelable: true });

        // Gán thêm các thuộc tính tùy chỉnh từ args vào sự kiện
        Object.assign(evt, args);

        // Nếu sự kiện bị chặn từ args, ngăn chặn mặc định
        if (args.defaultPrevented) {
            evt.preventDefault();
        }

        // Phát sự kiện
        element.dispatchEvent(evt);

        return evt;
    },
};

export default EventHandler;
