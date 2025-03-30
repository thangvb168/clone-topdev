import Tab from './src/tab.js';

const tab1 = Tab({
    tabsClass: 'js-tabs-align-center',
}).init();

const tab2 = Tab({
    tabsClass: 'js-tabs-vertical',
}).init();

var owl = $('.owl-carousel');
owl.owlCarousel({
    loop: true,
    margin: 10,
    stagePadding: 200,
    nav: false,
    dots: true,
    items: 3,
});

$('#customPrev').click(function () {
    owl.trigger('prev.owl.carousel');
});
$('#customNext').click(function () {
    owl.trigger('next.owl.carousel');
});
