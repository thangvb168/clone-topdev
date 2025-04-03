import { MOCKAPI_ENDPOINT_PREFIX } from '../config/env.js';

const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE'];

function BaseAPI({
    baseURL = MOCKAPI_ENDPOINT_PREFIX,
    headers = {},
    isUseFilter = false,
}) {
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    headers = {
        ...defaultHeaders,
        ...headers,
    };

    this.getBaseURL = function () {
        return baseURL;
    };

    this.getHeaders = function () {
        return headers;
    };

    this.getIsUseFilter = function () {
        return isUseFilter;
    };
}

BaseAPI.prototype.request = async function ({
    url = '',
    method = 'GET',
    baseURL,
    headers = {},
    body = null,
}) {
    try {
        // Check URL
        let fullURL = '';
        if (baseURL) {
            fullURL = baseURL + url;
        } else {
            fullURL = this.getBaseURL() + url;
        }

        // Validate method
        method = method.trim().toUpperCase();
        if (!ALLOWED_METHODS.includes(method)) {
            throw new Error(`Invalid HTTP method: ${method}`);
        }

        if (method == 'POST' || method == 'PUT') {
            if (!body) {
                throw new Error(`Body is required for ${method} requests`);
            }
            if (typeof body !== 'object') {
                throw new Error(
                    `Body must be an object for ${method} requests`
                );
            }
        }

        // Call API
        let response = await fetch(fullURL, {
            method,
            headers: {
                ...this.getHeaders(),
                ...headers,
            },
            body: body ? JSON.stringify(body) : null,
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        return json;
    } catch (error) {
        console.error('API request failed:', error);
        return { status: 'error', message: error.message };
    }
};

BaseAPI.prototype.get = async function ({ url = '', baseURL, headers = {} }) {
    if (this.getIsUseFilter()) {
        const data = await this.request({
            url,
            method: 'GET',
            baseURL,
            headers,
        });
        return filterByQuery({ data, url });
    }

    return this.request({
        url,
        method: 'GET',
        baseURL,
        headers,
    });
};

BaseAPI.prototype.post = async function ({
    url = '',
    body = null,
    baseURL,
    headers = {},
}) {
    return this.request({
        url,
        method: 'POST',
        baseURL,
        body,
        headers,
    });
};

BaseAPI.prototype.put = async function ({
    url = '',
    body = null,
    baseURL,
    headers = {},
}) {
    return this.request({
        url,
        method: 'PUT',
        baseURL,
        body,
        headers,
    });
};

BaseAPI.prototype.delete = async function ({
    url = '',
    baseURL,
    headers = {},
}) {
    return this.request({
        url,
        method: 'DELETE',
        baseURL,
        headers,
    });
};

function filterByQuery({ data = [], url = '' }) {
    if (url.length === 0) return data;
    if (data.length === 0) return [];

    let [rawURL, ...queries] = url.split('?');
    if (queries.length === 0) return data;

    if (rawURL.length === 0) return data;

    let queryArr = queries[0].split('&');

    for (let query of queryArr) {
        const [key, value] = query.split('=')?.map((element) => {
            return element.trim();
        });

        if (Object.keys(data[0]).includes(key)) {
            data = data.filter(function (item) {
                return item[key] == value;
            });
        }
    }
}

export default BaseAPI;
