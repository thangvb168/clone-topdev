import Tab from './src/tab.js';

const tab1 = Tab({
    tabsClass: 'js-tabs-job',
}).init();

// const tab2 = Tab({
//     tabsClass: 'js-tabs-vertical',
// }).init();

// var owl = $('.owl-carousel');
// owl.owlCarousel({
//     loop: true,
//     margin: 32,
//     // stagePadding: 200,
//     nav: false,
//     autoWidth: true,
//     // dots: true,
//     // items: 5,
// });
$('.owl-carousel-hero').owlCarousel({
    loop: true,
    margin: 10,
    items: 2,
});

$('.owl-carousel-brand').owlCarousel({
    loop: true,
    margin: 32,
    autoWidth: true,
});

$('.owl-carousel-card-job-dots').owlCarousel({
    loop: true,
    margin: 32,
    autoWidth: true,
    center: true,
    items: 1,
    dots: true,
});

$('.owl-carousel-featured-companies').owlCarousel({
    loop: true,
    margin: 32,
    autoWidth: true,
});

const owlCarouselHotJob = $('.owl-carousel-hot-job');
owlCarouselHotJob.owlCarousel({
    loop: true,
    margin: 32,
    autoWidth: true,
    center: true,
});

const owlCarouselBlog = $('.owl-carousel-blog');
owlCarouselBlog.owlCarousel({
    loop: true,
    margin: 16,
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

$('#customPrev').click(function () {
    owlCarouselHotJob.trigger('prev.owl.carousel');
});

$('#customNext').click(function () {
    owlCarouselHotJob.trigger('next.owl.carousel');
});
