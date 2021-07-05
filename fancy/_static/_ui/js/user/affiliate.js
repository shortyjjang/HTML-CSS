$('.graph .during .download').click(function(){
    var product = $('.analytics b').attr('product-id');
    var currentPage = $('.affliate .tab .current').text().toLowerCase();
    var url = 'affiliate_datafile.csv?date_period=' + $('.select-date .current').attr('date-period');
    url += '&page=' + currentPage;
    if (product) {
        url += '&product=' + product;
    }
    location.href=url;
});


$('.product .download').click(function(){
    var url = 'affiliate_datafile.csv?page=products&date_period=' + $('.product > ul > li .current').attr('date-period');
    location.href=url;
});

