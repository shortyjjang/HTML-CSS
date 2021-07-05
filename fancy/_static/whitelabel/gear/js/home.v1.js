// infiniteshow
jQuery(function($) {
	$.infiniteshow({
        itemSelector:'#content .itemList > ol',
        streamSelector:'#content .itemList',
        loaderSelector:'#infscr-loading-dummy',
        dataKey:null,
        post_callback: function($items, restored){ 
          $items.find(".video_player").videoPlayer({autoplay:true});
          $items.find(".popularList").popularSlide();
        },
        prefetch:true,
        autoload:false,
        changeurl:false,
    })
})

// slideshow
jQuery(function($) {
    var $cover = $('.cover').show(), $slide = $cover.find('.slideshow'), $paging = $cover.find('.pagination'), imageURLs = [];
    $paging.find('a:first').addClass('current');

    // start slideshow
    var slideTimer;

    function startAutoSlide(){
	    slideTimer = setInterval(function(){
	      var $current = $paging.find('a.current');
	      if ($current.next('a').length) {
	        $current.next('a').trigger('click');
	      } else {
	        $paging.find('a:first').trigger('click');
	      }
	    }, 4000);
    } 
    startAutoSlide();

    $cover.hover(function(){
    	if(slideTimer) clearInterval(slideTimer);
    }, function(){
    	startAutoSlide();
    })

    $paging.find("a").click(function(event){
      event.preventDefault();
      $this = $(event.currentTarget);
      if($this.hasClass('current')) return;
      var idx = $this.prevAll("a").length;
      var currentIdx = $paging.find('a.current').prevAll("a").length;
      var $slides = $cover.find('.slideshow li');
      var $slide = $slides.eq(idx);
      var $currentSlide = $slides.eq(currentIdx);
      if(idx > currentIdx){
      	$slide.css('left','100%');
		    $currentSlide.animate({left:'-100%'}, 300,"easeInOutExpo");
      }else{
    		$slide.css('left','-100%');
    		$currentSlide.animate({left:'100%'}, 300,"easeInOutExpo");
      }
	      $slide.animate({left:0}, 300,"easeInOutExpo");
      
      $paging.find('a.current').removeClass('current');
      $this.addClass("current");
    });

    $(".video_player").videoPlayer({autoplay:true, muted:true});
    $(".popularList").popularSlide();
})
