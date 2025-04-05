import BaseAPI from '../../api/index.js';
import { MOCKAPI_ENDPOINT_PREFIX } from '../../config/env.js';

const instance = new BaseAPI({
    baseURL: MOCKAPI_ENDPOINT_PREFIX,
    isUseFilter: true,
});

const loginForm = document.querySelector('#login-form');

loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Get data from form
    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());

    // Send data to server
    try {
        const response = await instance.post({
            url: '/users',
            body: data,
        });

        if (!response) throw new Error('Login failed');

        if (response.access_token) {
            localStorage.setItem('user', JSON.stringify(response));
        }

        window.location.href = '/index.html';
    } catch (error) {
        alert('An error occurred while logging in. Please try again later.');
    }
});
