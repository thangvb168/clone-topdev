import BaseComponent from './base-component.js';
import EventHandler from './dom/event-handler.js';
import Manipulator from './dom/manipulator.js';
import SelectorEngine from './dom/selector-engine.js';
import { enableDismissTrigger } from './util/component-function.js';

const PREFIX = 'td';

const NAME = 'modal';
const DATA_KEY = `${PREFIX}.${NAME}`;
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = '.data-api';
const ESCAPE_KEY = 'Escape';

const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const EVENT_RESIZE = `resize${EVENT_KEY}`;
const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY}`;
const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY}`;
const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;

const CLASS_NAME_OPEN = 'modal-open';
const CLASS_NAME_FADE = 'fade';
const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_STATIC = 'modal-static';

const OPEN_SELECTOR = '.modal.show';
const SELECTOR_DIALOG = '.modal-dialog';
const SELECTOR_MODAL_TITLE = '.modal-title';
const SELECTOR_MODAL_BODY = '.modal-body';
const SELECTOR_DATA_TOGGLE = '[data-td-toggle="modal"]';

const Default = {
    backdrop: true,
    focus: true,
    keyboard: true,
};

const DefaultType = {
    backdrop: '(boolean|string)',
    focus: 'boolean',
    keyboard: 'boolean',
};

class Modal extends BaseComponent {
    constructor(element, config) {
        super(element, config);

        this._dialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
        this._isShown = false;
        this._isTransitioning = false;

        this._addEventListeners();
    }

    static get Default() {
        return Default;
    }

    static get DefaultType() {
        return DefaultType;
    }

    static get NAME() {
        return NAME;
    }

    toggle(relatedTarget) {
        return this._isShown ? this.hide() : this.show(relatedTarget);
    }

    show(relatedTarget) {
        if (this._isShown || this._isTransitioning) return;

        const showEvent = EventHandler.trigger(this._element, EVENT_SHOW, {
            relatedTarget,
        });

        if (showEvent.defaultPrevented) return;

        this._isShown = true;
        // this._isTransitioning = true;

        document.body.classList.add(CLASS_NAME_OPEN);

        this._showElement(relatedTarget);
    }

    hide() {
        if (!this._isShown || this._isTransitioning) {
            console.log('_isShown', this._isShown);
            console.log('_isTransitioning', this._isTransitioning);
            return;
        }

        const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);

        if (hideEvent.defaultPrevented) return;

        this._isShown = false;
        this._isTransitioning = true;

        document.body.classList.remove(CLASS_NAME_OPEN);

        this._hideElement();
    }

    _showElement(relatedTarget) {
        if (!document.body.contains(this._element)) {
            document.body.append(this._element);
        }

        this._element.style.display = 'block';
        this._element.scrollTop = 0;

        const modalBody = SelectorEngine.findOne(
            SELECTOR_MODAL_BODY,
            this._dialog
        );

        if (modalBody) {
            modalBody.scrollTop = 0;
        }

        this._element.classList.add(CLASS_NAME_SHOW);
    }

    _hideElement() {
        this._element.style.display = 'none';
        this._element.classList.remove(CLASS_NAME_SHOW);
        this._isTransitioning = false;

        EventHandler.trigger(this._element, EVENT_HIDDEN);
    }

    _getText() {
        const titleText = Manipulator.getDataAttribute(this._element, 'title');
        const bodyText = Manipulator.getDataAttribute(this._element, 'body');

        return { titleText, bodyText };
    }

    _addEventListeners() {
        console.log('Add event listeners');
    }
}

EventHandler.on(
    document,
    EVENT_CLICK_DATA_API,
    SELECTOR_DATA_TOGGLE,
    function (event) {
        const target = SelectorEngine.getElementFromSelector(this);

        if (['A', 'AREA'].includes(this.tagName)) {
            event.preventDefault();
        }

        EventHandler.one(target, EVENT_SHOW, (showEvent) => {
            if (showEvent.defaultPrevented) return;
        });

        const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR);

        if (alreadyOpen) {
            Modal.getInstance(alreadyOpen).hide();
        }

        const data = Modal.getOrCreateInstance(target);

        data.toggle(this);
    }
);

enableDismissTrigger(Modal, 'hide');

export default Modal;
