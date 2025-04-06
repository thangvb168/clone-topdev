// Chuẩn hóa selector
const parseSelector = (selector) => {
    if (selector && window.CSS && window.CSS.escape) {
        selector = selector.replace(
            /#([^\s"#']+)/g,
            (match, id) => `#${CSS.escape(id)}`
        );
    }

    return selector;
};

const isElement = (object) => {
    if (!object || typeof object !== 'object') {
        return false;
    }

    if (typeof object.jquery !== 'undefined') {
        object = object[0];
    }

    return typeof object.nodeType !== 'undefined';
};

const toType = (object) => {
    if (object === null || object === undefined) {
        return `${object}`;
    }

    return Object.prototype.toString
        .call(object)
        .match(/\s([a-z]+)/i)[1]
        .toLowerCase();
};

const getElement = (object) => {
    if (isElement(object)) {
        return object.jquery ? object[0] : object;
    }

    if (typeof object === 'string' && object.length > 0) {
        return document.querySelector(parseSelector(object));
    }

    return null;
};

const isDisabled = (element) => {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
        return true;
    }

    if (element.classList.contains('disabled')) {
        return true;
    }

    if (typeof element.disabled !== 'undefined') {
        return element.disabled;
    }

    return (
        element.hasAttribute('disabled') &&
        element.getAttribute('disabled') !== 'false'
    );
};

export { parseSelector, isElement, toType, getElement, isDisabled };
