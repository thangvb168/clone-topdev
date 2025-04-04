import Tab from './src/components/tab.js';
import Dropdown from './src/components/dropdown.js';

import './skeleton.js';

function createOptionElem({ title = 'Option-Title', value = 'Option-Value' }) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = title;
    return option;
}

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

const selectLocationElem = document.querySelector(`.js-form-select-location`);
for (let i = 0; i < location.length; i++) {
    const option = createOptionElem({
        title: location[i].title,
        value: location[i].value,
    });
    selectLocationElem.appendChild(option);
}

// Tab({
//     tabsClass: 'js-tabs-job',
// }).init();

Dropdown({
    dropdownClass: 'js-dropdown-profile',
}).init();

// Dropdown({
//     dropdownClass: 'js-dropdown-position',
// }).init();

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
