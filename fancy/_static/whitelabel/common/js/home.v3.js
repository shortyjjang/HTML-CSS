var mWidth = 600;

// infiniteshow
$(function() {
    
    if ($(window).width()<mWidth) {
        var SlideH = 295;
    }else{
        var SlideH = 500;
    }
    $('#slides:not(.noslideshow)').slidesjs({
        width: $(window).width(),
        height: SlideH,
        navigation: {
            effect: "slide"
        },
        pagination: {
            effect: "slide"
        },
        effect: {
            slide: {
                speed: 200
            }
        },
        play: {
            active: false,
            effect: "slide",
            interval: 4000,
            auto: true,
            swap: false,
            pauseOnHover: true,
            restartDelay: 4000
          }
        });


    $(window).scroll(function(){
      var showNewsletter = Cookie.get('ck_newsletter') !='opened';
      if( showNewsletter && $(".popup.newsletter").is(":hidden") && $("#footer .newsletter").is(":in-viewport") ){
          $('#popup_container').addClass('start-newsletter').show();
      }
    });

    $(".popup.start-newsletter .popup-close").click(function(e){
      Cookie.set('ck_newsletter', "opened", 9999 );
    })
})

// category slide
$(function() {

    if ($(window).width()<mWidth){
        $(".recommend").css('visibility','visible');
        $(".category").css('visibility','visible');
        return;
    }
    
    $(".recommend").recommendSlide();
    $(".category").recommendSlide({center:false});
    $(window).resize(function(){
        $(".recommend").recommendSlide();
        $(".category").recommendSlide({center:false});
    });
});

