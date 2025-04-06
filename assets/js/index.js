import Dropdown from './src/components/dropdown.js';

import {
    createCardElem,
    createSkeletonCard,
    createBlogElem,
    createSkeletonBlogElem,
} from './createElem.js';

// Call API
import BaseAPI from './src/api/index.js';
import { MOCKAPI_ENDPOINT_PREFIX } from './src/config/env.js';

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

function loadBlogs(elem, blogList) {
    elem.innerHTML = '';
    for (let i = 0; i < blogList.length; i++) {
        let blogElem = createBlogElem(blogList[i]);
        elem.appendChild(blogElem);
    }
}

function loadSkeletonBlogs(elem, count) {
    elem.innerHTML = '';
    for (let i = 0; i < count; i++) {
        let skeletonBlog = createSkeletonBlogElem();
        elem.appendChild(skeletonBlog);
    }
}

window.getJobs = async function (location, btnElem) {
    if (!location) location = 'all';

    const featuredJobList = document.querySelector('#featured-job-list');
    loadSkeletonJobs(featuredJobList, 8, 'col');

    let url = 'jobs';
    if (location !== 'all') {
        url += `?location.slug=${location}`;
    }
    const response = await instance.get({ url });
    if (!response) {
        console.error('Failed to load jobs');
        return;
    }
    let data = response;

    const buttonNavs = document.querySelector('#featured-job-list-navs');
    const activeButton = buttonNavs.querySelector('button.active');
    if (activeButton) {
        activeButton.classList.remove('active');
    }

    if (!btnElem) {
        btnElem = buttonNavs.querySelectorAll('button')[0];
    }

    btnElem.classList.add('active');

    loadJobs(featuredJobList, data, 'col');
};

async function getHotJobs() {
    const owlCarouselHotJob = document.querySelector(
        '.js-owl-carousel-hot-job'
    );

    loadSkeletonJobs(owlCarouselHotJob, 4);
    $('.js-owl-carousel-hot-job').owlCarousel({
        loop: true,
        margin: 32,
        autoWidth: true,
        center: true,
        items: 1,
        dots: false,
        nav: true,
    });

    const response = await instance.get({ url: '/jobs' });
    $('.js-owl-carousel-hot-job').owlCarousel('destroy');
    loadJobs(owlCarouselHotJob, response);
    $('.js-owl-carousel-hot-job').owlCarousel({
        loop: true,
        margin: 32,
        autoWidth: true,
        center: true,
        items: 1,
        dots: false,
        nav: true,
    });
}

async function getBlogs() {
    const owlCarouselBlog = document.querySelector('.js-owl-carousel-blog');

    loadSkeletonBlogs(owlCarouselBlog, 4);
    $('.js-owl-carousel-blog').owlCarousel('destroy');
    $('.js-owl-carousel-blog').owlCarousel({
        margin: 16,
        nav: true,
        dots: true,

        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 2,
            },
            1000: {
                items: 3,
            },
        },
    });

    const response = await instance.get({ url: '/blogs' });
    loadBlogs(owlCarouselBlog, response);
    $('.js-owl-carousel-blog').owlCarousel('destroy');

    $('.js-owl-carousel-blog').owlCarousel({
        margin: 16,
        nav: true,
        dots: true,

        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 2,
            },
            1000: {
                items: 3,
            },
        },
    });
}

getHotJobs();
window.getJobs('all');
getBlogs();

const location = [
    {
        title: 'Hà Nội',
        value: 'Hà Nội',
    },
    {
        title: 'Hồ Chí Minh',
        value: 'Hồ Chí Minh',
    },
    {
        title: 'Đà Nẵng',
        value: 'Đà Nẵng',
    },
];

$('.js-owl-carousel-hero').owlCarousel({
    margin: 10,
    items: 2,
    nav: false,
    dots: false,
});

$('.js-owl-carousel-brand').owlCarousel({
    loop: true,
    margin: 32,
    autoWidth: true,
    nav: false,
    dots: false,
});

$('.js-owl-carousel-card-job-dots').owlCarousel({
    loop: true,
    margin: 32,
    autoWidth: true,
    center: true,
    items: 1,
    dots: true,
});

$('.js-owl-carousel-featured-companies').owlCarousel({
    loop: true,
    margin: 32,
    autoWidth: true,
    nav: false,
    dots: false,
});

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

$('.js-owl-carousel-tabs').owlCarousel({
    margin: 8,
    autoWidth: true,
    nav: false,
    dots: false,
});

// Bottom Menu
const bottomMenu = document.querySelector('.js-bottom-menu');
const menuItems = bottomMenu.querySelectorAll('.js-menu-item');
menuItems.forEach((item) => {
    item.addEventListener('click', function (event) {
        event.preventDefault();

        menuItems.forEach((i) => i.classList.remove('active'));

        this.classList.add('active');
    });
});

const changePositionOwlCarouselNavDots = function () {
    const owlCarouselWithDotsNav = document.querySelectorAll(
        '.js-owl-carousel-with-dots-nav'
    );
    owlCarouselWithDotsNav.forEach((owlCarousel) => {
        let widthNavButton = 32;
        let padding = 4;
        let owlDots = owlCarousel.querySelector('.owl-dots');
        let owlNav = owlCarousel.querySelector('.owl-nav');
        let owlDotsLength = owlDots.getBoundingClientRect().width;
        owlNav.style.width =
            owlDotsLength + widthNavButton * 2 + padding * 2 + 'px';
        owlDots.style.marginLeft = widthNavButton + padding + 'px';
    });
};

const observer = new MutationObserver(changePositionOwlCarouselNavDots);
observer.observe(document.body, { childList: true, subtree: true });

// Check login
window.handleLogin = function () {
    window.location.href = '/pages/auth/login.html';
};

document.querySelector('.js-btn-logout').addEventListener('click', function () {
    console.log('Logout');
    localStorage.removeItem('user');
    window.location.reload();
});

const profileElem = document.querySelector('.js-profile');
const profileNameElem = profileElem.querySelector('.js-profile-name');
const profileAvatarElem = profileElem.querySelector('.js-profile-avatar');
const btnLogin = document.querySelector('.js-login-btn');

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

window.handleClickSearchBtn = function () {
    const searchInput = document.querySelector('#js-search-input');
    const searchValue = searchInput?.value?.trim();

    const selectLocation = document.querySelector('#js-select-location');
    const selectLocationValue = selectLocation?.value?.trim();

    if (!searchValue && !selectLocationValue) {
        alert('Please enter a keyword or select a location to search!');
        return;
    }

    let url = '/pages/search-result.html?';
    if (searchValue) {
        url += `search=${searchValue}`;
    }
    if (selectLocationValue && selectLocationValue !== 'all') {
        url += `&location=${selectLocationValue}`;
    }

    window.location.href = url;
};

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
const searchResultElem = document.querySelector('#js-search-result');
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

    if (!keyword) {
        searchResultElem.classList.add('d-none');
        return;
    }
    searchResultElem.classList.remove('d-none');
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
