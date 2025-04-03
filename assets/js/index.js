import Tab from './src/components/tab.js';
import Dropdown from './src/components/dropdown.js';

function createCardElem({
    title = 'Card-Title',
    description = 'Card-Description',
    locationType = 'Remote',
    type = 'Full-time',
    salary = 1000,
    thumbnail = '',
}) {
    const cardJob = document.createElement('div');
    cardJob.classList.add('card', 'card-job');

    // Card Header
    const cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header', 'gap-4');

    // Logo
    const cardLogo = document.createElement('div');
    cardLogo.classList.add('card-logo');
    const imgLogo = document.createElement('img');
    imgLogo.src = thumbnail;
    imgLogo.alt = 'Logo';
    cardLogo.appendChild(imgLogo);

    // Title
    const cardTitle = document.createElement('div');
    cardTitle.classList.add('card-title');
    const h2Title = document.createElement('h2');
    h2Title.classList.add('display-2', 'card-title-content');
    h2Title.textContent = title;

    const pPrice = document.createElement('p');
    pPrice.classList.add('text-primary', 'extra-small');
    pPrice.textContent = `Up to ${Math.round(salary)}$`;

    cardTitle.appendChild(h2Title);
    cardTitle.appendChild(pPrice);

    // Tạo icon bookmark
    const bookmarkIcon = document.createElement('i');
    bookmarkIcon.classList.add('fa-solid', 'fa-bookmark', 'fs-4');

    cardHeader.appendChild(cardLogo);
    cardHeader.appendChild(cardTitle);
    cardHeader.appendChild(bookmarkIcon);

    // Line
    const divider = document.createElement('div');
    divider.classList.add('line', 'line-dashed-x2', 'line-neutral-5', 'my-5');

    // Body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body', 'gap-2');

    // Type job
    const infoContainer = document.createElement('div');
    infoContainer.classList.add('d-flex', 'gap-4', 'text-neutral-7');

    const remoteSpan = document.createElement('span');
    remoteSpan.innerHTML =
        '<i class="fa-solid fa-laptop-file fs-4"></i> ' + locationType;

    const fullTimeSpan = document.createElement('span');
    fullTimeSpan.innerHTML = '<i class="fa-regular fa-clock fs-4"></i> ' + type;

    infoContainer.appendChild(remoteSpan);
    infoContainer.appendChild(fullTimeSpan);

    // Description job
    const jobDescription = document.createElement('p');
    jobDescription.classList.add('card-body-description');
    jobDescription.textContent = description;

    cardBody.appendChild(infoContainer);
    cardBody.appendChild(jobDescription);

    cardJob.appendChild(cardHeader);
    cardJob.appendChild(divider);
    cardJob.appendChild(cardBody);

    return cardJob;
}

// Call API
import BaseAPI from './src/api/index.js';
import { MOCKAPI_ENDPOINT_PREFIX } from './src/config/env.js';

const instance = new BaseAPI({
    baseURL: MOCKAPI_ENDPOINT_PREFIX,
    isUseFilter: true,
});

await instance.request({ url: '/jobs' }).then((data) => {
    const owlCarouselHotJob = document.querySelector(
        '.js-owl-carousel-hot-job'
    );

    for (let i = 0; i < 10; i++) {
        const cardJob = createCardElem({
            title: data[i].title,
            description: data[i].description,
            locationType: data[i].locationType,
            type: data[i].type,
            salary: data[i].salary,
            thumbnail: data[i].thumbnail,
        });

        owlCarouselHotJob.appendChild(cardJob);
    }
});

Tab({
    tabsClass: 'js-tabs-job',
}).init();

Dropdown({
    dropdownClass: 'js-dropdown-profile',
}).init();

Dropdown({
    dropdownClass: 'js-dropdown-position',
}).init();

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

$('.js-owl-carousel-hot-job').owlCarousel({
    loop: true,
    margin: 32,
    autoWidth: true,
    center: true,
    items: 1,
    dots: false,
    nav: true,
});

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
