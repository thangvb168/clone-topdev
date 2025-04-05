import { createCardElem, createSkeletonCard } from '../../createElem.js';
import Dropdown from '../components/dropdown.js';

import BaseAPI from '../api/index.js';
import { MOCKAPI_ENDPOINT_PREFIX } from '../config/env.js';

const instance = new BaseAPI({
    baseURL: MOCKAPI_ENDPOINT_PREFIX,
    isUseFilter: true,
});

function loadSkeletonJobs(elem, count, className) {
    elem.innerHTML = '';
    for (let i = 0; i < count; i++) {
        let skeletonCard = createSkeletonCard();
        skeletonCard.classList.add(className);
        elem.appendChild(skeletonCard);
    }
}

function loadJobs(elem, jobList, className) {
    elem.innerHTML = '';
    for (let i = 0; i < jobList.length; i++) {
        let cardJob = createCardElem(jobList[i]);
        cardJob.classList.add(className);
        elem.appendChild(cardJob);
    }
}

function debounce(fn, delay) {
    let timeoutId;
    return function (...args) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

const resultListElem = document.querySelector('#js-job-result-list');
const selectLocationElem = document.querySelector('#js-select-location');
const searchInput = document.querySelector('#js-search-input');
const searchBtn = document.querySelector('#js-btn-search');
console.log(searchBtn);
const loading = searchBtn.querySelector('#loading');
async function handleSearch() {
    const keyword = searchInput.value.trim();
    const selectedLocation = selectLocationElem.value;

    let url = 'jobs';

    if (!keyword) return;
    url = `jobs?search=${keyword}`;

    if (selectedLocation !== 'all') {
        url += `&location.slug=${selectedLocation}`;
    }

    loadSkeletonJobs(resultListElem, 8, 'col');
    searchBtn.disabled = true;
    loading.classList.remove('d-none');

    const response = await instance.get({ url });
    if (!response) {
        console.error('Failed to load jobs');
        return;
    }
    if (response.length === 0) {
        resultListElem.innerHTML =
            '<p class="text-start">Không tìm thấy kết quả phù hợp</p>';
    } else loadJobs(resultListElem, response, 'col');

    searchBtn.disabled = false;
    loading.classList.add('d-none');
    return;
}

searchInput.addEventListener('keyup', debounce(handleSearch, 500));
selectLocationElem.addEventListener('change', debounce(handleSearch, 500));

// Is Login
const profileElem = document.querySelector('.js-profile');
const profileNameElem = profileElem.querySelector('.js-profile-name');
const profileAvatarElem = profileElem.querySelector('.js-profile-avatar');
const btnLogin = document.querySelector('.js-login-btn');

window.handleLogin = function () {
    window.location.href = '/pages/auth/login.html';
};

document.querySelector('.js-btn-logout').addEventListener('click', function () {
    console.log('Logout');
    localStorage.removeItem('user');
    window.location.reload();
});

function isLogin() {
    const userData = localStorage.getItem('user');

    let user = null;
    try {
        if (userData && userData !== 'undefined') {
            user = JSON.parse(userData);
        }
    } catch (error) {
        console.error('JSON parse error:', error);
        localStorage.removeItem('user');
    }

    if (!user) {
        btnLogin.classList.remove('d-none');
        profileElem.classList.add('d-none');
    } else {
        profileNameElem.innerText = user.name;
        profileAvatarElem.src = user.avatar;
        btnLogin.classList.add('d-none');
        profileElem.classList.remove('d-none');

        Dropdown({
            dropdownClass: 'js-dropdown-profile',
        }).init();
    }
}

isLogin();

$('.js-owl-carousel-hero-features').owlCarousel({
    margin: 12,
    autoWidth: true,
    nav: false,
    dots: false,
    responsive: {
        0: {
            items: 2,
            loop: true,
        },
        992: {
            loop: false,
        },
    },
});

document.addEventListener('DOMContentLoaded', () => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);

    const keyword = params.get('search') || '';
    const location = params.get('location') || '';

    document.querySelector('#js-search-input').value = keyword;
    document.querySelector('#js-select-location').value = location;

    handleSearch();
});
