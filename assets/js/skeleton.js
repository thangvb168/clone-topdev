function createCardElem({
    title = 'Card-Title',
    description = 'Card-Description',
    locationType = 'Remote',
    type = 'Full-time',
    salary = 1000,
    thumbnail = '',
}) {
    const cardHTML = `
        <div>
            <div class="card card-job">
                <div class="card-header gap-4">
                    <div class="card-logo">
                        <img src="${thumbnail}" alt="Logo">
                    </div>
                    <div class="card-title">
                        <h2 class="display-2 card-title-content">${title}</h2>
                        <p class="text-primary extra-small">Up to ${Math.round(
                            salary
                        )}$</p>
                    </div>
                    <i class="fa-solid fa-bookmark fs-4"></i>
                </div>
                <div class="line line-dashed-x2 line-neutral-5 my-5"></div>
                <div class="card-body gap-2">
                    <div class="d-flex gap-4 text-neutral-7">
                        <span><i class="fa-solid fa-laptop-file fs-4"></i> ${locationType}</span>
                        <span><i class="fa-regular fa-clock fs-4"></i> ${type}</span>
                    </div>
                    <p class="card-body-description">${description}</p>
                </div>
            </div>
        </div>
    `;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cardHTML.trim();
    return tempDiv.firstChild;
}

function createSkeletonCard() {
    const cardHTML = `
        <div>
            <div class="card card-job">
                <div class="card-header gap-4">
                    <div class="card-logo skeleton"></div>
                    <div class="card-title">
                        <div class="skeleton-line"></div>
                        <div class="skeleton-line"></div>
                    </div>
                </div>
                <div class="line line-dashed-x2 line-neutral-5 my-5"></div>
                <div class="card-body gap-2">
                    <div class="d-flex gap-4">
                        <div class="skeleton-line w-25"></div>
                        <div class="skeleton-line w-25"></div>
                    </div>
                    <div class="skeleton-line-2"></div>
                </div>
            </div>
        </div>
    `;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cardHTML.trim();
    return tempDiv.firstChild;
}

function createBlogElem({
    id,
    title = 'Blog-Title',
    content = 'Blog-Content',
    field = 'Blog-Field',
    imgUrl = '',
    createdAt,
}) {
    const date = new Date(createdAt);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const elemHTML = `
        <div class="card card-blog gap-4 pb-3">
            <div class="card-badge">${field}</div>
            <img
                src="${imgUrl}"
                alt="Blog 1"
                class="card-img-top"
            />
            <div class="card-body px-4 py-1 gap-3">
                <div class="d-flex flex-column gap-3 me-18">
                    <h2 class="display-2">
                        ${title}
                    </h2>
                    <p class="body-1 text-neutral-7 ellipsis-2">
                        ${content}
                    </p>
                </div>
                <div
                    class="d-flex justify-content-between align-items-center"
                >
                    <div class="small-headline text-neutral-6">
                        ${formattedDate}
                    </div>
                    <div
                        class="small-headline text-primary cursor-pointer"
                    >
                        Read More &#9658;
                    </div>
                </div>
            </div>
        </div>
    `;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = elemHTML.trim();
    return tempDiv.firstChild;
}

function createSkeletonBlogElem() {
    const elemHTML = `
        <div class="card card-blog gap-4 pb-3">
            <div class="card-badge skeleton"></div>
            <div class="card-img-top skeleton"></div>
            <div class="card-body px-4 py-1 gap-3">
                <div class="d-flex flex-column gap-3 me-18">
                    <h2 class="display-2 skeleton-line-2">                        
                    </h2>
                    <p class="body-1 text-neutral-7 ellipsis-2 skeleton-line-2">
                    </p>
                </div>
                <div
                    class="d-flex justify-content-between align-items-center"
                >
                    <div class="small-headline text-neutral-6 skeleton-line w-25">
                    </div>
                </div>
            </div>
        </div>
    `;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = elemHTML.trim();
    return tempDiv.firstChild;
}

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

    const response = await instance.get({ url: '/jobs' });
    let data = response;
    if (location !== 'all') {
        data = data.filter((job) => job.location.slug === location);
    }

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

// function
