import Tab from './src/tab.js';
import Dropdown from './src/dropdown.js';

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
