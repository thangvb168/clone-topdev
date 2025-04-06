import { getElement } from './util/index.js';
import Config from './util/config.js';
import Data from './dom/data.js';
import EventHandler from './dom/event-handler.js';

const VERSION = '0.0.0';
const PREFIX = 'td';

class BaseComponent extends Config {
    constructor(element, config) {
        super();

        element = getElement(element);
        if (!element) return;

        this._element = element;
        this._config = this._getConfig(config);

        Data.set(this._element, this.constructor.DATA_KEY, this);
    }

    /**
     * Phương thức dispose được sử dụng để giải phóng tài nguyên và dọn dẹp các sự kiện
     *
     * - Xóa dữ liệu được lưu trữ trên phần tử DOM được lưu trong Data
     * - Hủy bỏ tất cả các sự kiện được gắn với phần tử DOM thông qua `EventHandler.off`.
     * - Đặt tất cả các thuộc tính của đối tượng hiện tại thành `null` để giải phóng bộ nhớ.
     *
     * @returns {void}
     */
    dispose() {
        Data.remove(this._element, this.constructor.DATA_KEY);
        EventHandler.off(this._element, this.constructor.EVENT_KEY);

        for (const propertyName of Object.getOwnPropertyNames(this)) {
            this[propertyName] = null;
        }
    }

    _getConfig(config) {
        config = this._mergeConfigObj(config, this._element);
        config = this._configAfterMerge(config);
        this._typeCheckConfig(config);
        return config;
    }

    static getInstance(element) {
        return Data.get(getElement(element), this.DATA_KEY);
    }

    static getOrCreateInstance(element, config = {}) {
        return (
            this.getInstance(element) ||
            new this(element, typeof config === 'object' ? config : null)
        );
    }

    static get VERSION() {
        return VERSION;
    }

    static get DATA_KEY() {
        return `${PREFIX}.${this.NAME}`;
    }

    static get EVENT_KEY() {
        return `.${this.DATA_KEY}`;
    }

    static eventName(name) {
        return `${name}${this.EVENT_KEY}`;
    }
}

export default BaseComponent;
