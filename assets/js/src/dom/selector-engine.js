// SelectorEngine module để tìm kiếm các phần tử trong DOM
// Ví dụ:
// const element = SelectorEngine.find('#my-element');
// const elements = SelectorEngine.find('.my-elements');

import { parseSelector } from '../util/index.js';

const PREFIX = 'td';
const ATTRIBUTE_TARGET = `data-${PREFIX}-target`;

// Lấy selector từ bs-td-target hoặc href
const getSelector = (element) => {
    let selector = element.getAttribute(ATTRIBUTE_TARGET);
    if (!selector || selector === '#') {
        let hrefAttribute = element.getAttribute('href');

        if (
            !hrefAttribute ||
            (!hrefAttribute.includes('#') && !hrefAttribute.startsWith('.'))
        ) {
            return null;
        }

        if (hrefAttribute.includes('#') && !hrefAttribute.startsWith('#')) {
            hrefAttribute = hrefAttribute.split('#')[1];
        }

        selector =
            hrefAttribute && hrefAttribute !== '#'
                ? hrefAttribute.trim()
                : null;
    }

    return selector
        ? selector
              .split(',')
              .map((sel) => parseSelector(sel))
              .join(',')
        : null;
};

const SelectorEngine = {
    find(selector, element = document.documentElement) {
        return [...element.querySelectorAll(selector)];
    },

    findOne(selector, element = document.documentElement) {
        return element.querySelector(selector);
    },

    children(element, selector) {
        return [...element.children].filter((child) => child.matches(selector));
    },

    parents(element, selector) {
        const parents = [];
        let parent = element.parentNode;

        while (parent && parent !== document.documentElement) {
            if (parent.matches(selector)) {
                parents.push(parent);
            }
            parent = parent.parentNode;
        }

        return parents;
    },

    prev(element, selector) {
        let prev = element.previousElementSibling;

        while (prev) {
            if (prev.matches(selector)) {
                return [prev];
            }
            prev = prev.previousElementSibling;
        }

        return [];
    },

    next(element, selector) {
        let next = element.nextElementSibling;

        while (next) {
            if (next.matches(selector)) {
                return [next];
            }
            next = next.nextElementSibling;
        }

        return [];
    },

    focusableChildren(element) {
        const focusableSelectors = [
            'a[href]',
            'area[href]',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            'button:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
            '[contenteditable]',
        ];

        return this.find(focusableSelectors.join(','), element);
    },

    getSelectorFromElement(element) {
        const selector = getSelector(element);

        if (selector) {
            return SelectorEngine.findOne(selector) ? selector : null;
        }

        return null;
    },

    getElementFromSelector(element) {
        const selector = getSelector(element);

        return selector ? SelectorEngine.findOne(selector) : null;
    },

    getMultipleSelectorFromElement(element) {
        const selector = getSelector(element);

        return selector ? SelectorEngine.find(selector) : [];
    },
};

export default SelectorEngine;
