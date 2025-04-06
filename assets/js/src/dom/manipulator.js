// Manipulator module để thao tác với DOM thông qua thuộc tính data-*

const PREFIX = 'td';
const PREFIX_DATA = `data-${PREFIX}-`; // Tiền tố cho thuộc tính data-*

// Chuẩn hóa value
const normalizeData = (value) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === Number(value).toString()) return Number(value);
    if (value === '' || value === 'null') return null;
    if (typeof value !== 'string') return value;

    try {
        return JSON.parse(decodeURIComponent(value));
    } catch (error) {
        return value;
    }
};

// Chuẩn hóa key
const normalizeDataKey = (key) => {
    return key.replace(/[A-Z]/g, (chr) => `-${chr.toLowerCase()}`);
};

const Manipulator = {
    setDataAttribute(element, key, value) {
        element.setAttribute(`${PREFIX_DATA}${key}`, value);
    },

    removeDataAttribute(element, key) {
        element.removeAttribute(`${PREFIX_DATA}${key}`);
    },

    getDataAttributes(element) {
        if (!element) return {};

        const attributes = {};

        const keys = Object.keys(element.dataset).filter((key) =>
            key.startsWith(PREFIX)
        );

        for (const key of keys) {
            let pureKey = key.replace(new RegExp(`^${PREFIX_DATA}`), '');
            pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1);
            attributes[pureKey] = normalizeData(element.dataset[key]);
        }

        return attributes;
    },

    getDataAttribute(element, key) {
        return normalizeData(
            element.getAttribute(`${PREFIX_DATA}${normalizeDataKey(key)}`)
        );
    },
};

export default Manipulator;
