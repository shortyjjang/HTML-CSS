
function domReady(fn) {
	var d = document;
	if (d.addEventListener) {
		d.addEventListener('DOMContentLoaded', fn, false);
	} else {
		d.attachEvent('onreadystatechange', function(){ d.readyState === 'interactive' && fn() });
	}
};

domReady(function(event){

	if(!$) return;
	if(!parent || parent==window) return;
	

	var placeholder, container, section;
	if ($('.cover').length < 1) {
		section = 'Slideshow';
		placeholder = '<div class="placeholder"><p><b>Upload '+ section +' images</b> <small>Use multiple images to create a '+ section +' at the top of your Storefront.</small></p><p class="notify">Use the <b>'+ section +' Images</b> section in the left sidebar to add images.</p></div>';
		container = '<div class="cover"><div class="slidesfx"><div id="slides" class="noslideshow"></div></div>'+placeholder+'</div>';
		$('#content').prepend(container);
	}
	if ($('.collections').length<1) {
		section = 'Collections';
		placeholder = '<div class="placeholder"><p><b>Upload '+ section +' images</b> <small>Use multiple images to create a '+ section +' at the top of your Storefront.</small></p><p class="notify">Use the <b>'+ section +' Images</b> section in the left sidebar to add images.</p></div>';
		container = '<div class="collections index"><h3>Collections</h3><ul class="after inner"><li style="opacity:0.5;"><a href="#"><img src="//static-ec6.thefancy.com/_static_gen/themes/assets/img/blank.325472601571.gif" style="background-color:#b7b8ba;"><b class="title">Collection Name</b></a></li><li style="opacity:0.5;"><a href="#"><img src="//static-ec6.thefancy.com/_static_gen/themes/assets/img/blank.325472601571.gif" style="background-color:#b7b8ba;"><b class="title">Collection Name</b></a></li><li style="opacity:0.5;"><a href="#"><img src="//static-ec6.thefancy.com/_static_gen/themes/assets/img/blank.325472601571.gif" style="background-color:#b7b8ba;"><b class="title">Collection Name</b></a></li></ul>'+placeholder+'</div>';
		$('.cover').after(container);
	}else{
		if ($('.collections li').length<3) {
			var container = $('.collections').find('ul').html();
			var num = $('.collections li').length;
			for(i = num;i < 3;i++){
				var container = container+'<li style="opacity:0.5;"><a href="#"><img src="//static-ec6.thefancy.com/_static_gen/themes/assets/img/blank.325472601571.gif" style="background-color:#b7b8ba;"><b class="title">Collection Name</b></a></li>';
			}
			$('.collections').find('ul').html(container);
		}
	}

	if ($('.featuredList').length>1) {
		if ($('.featuredList li').length<3) {
			var container = $('.featuredList').find('ul,ol').html();
			var num = $('.featuredList li').length;
			for(i = num;i < 3;i++){
				var container = container+'<li class="itemElement" style="opacity:0.5"><a href="#"><span class="figure"><img src="//static-ec6.thefancy.com/_static_gen/themes/assets/img/blank.325472601571.gif" style="background-color:#b7b8ba;"/></span><span class="figcaption"><small class="category">{{settings.page_title}}</small><b class="title">Product Name</b> <span class="price">$100 <small class="unit">USD</small></span></span></a></li>';
			}
			$('.featuredList').find('ul,ol').html(container);
		}
	}else {
		if ($('.featuredList li').length<3) {
			var inner_container = $('.featuredList').find('ul,ol').html();
			var num = $('.featuredList li').length;
			for(i = num;i < 3;i++){
				var inner_container = inner_container+'<li class="itemElement" style="opacity:0.5"><a href="#"><span class="figure"><img src="//static-ec6.thefancy.com/_static_gen/themes/assets/img/blank.325472601571.gif" style="background-color:#b7b8ba;"/></span><span class="figcaption"><small class="category">{{settings.page_title}}</small><b class="title">Product Name</b> <span class="price">$100 <small class="unit">USD</small></span></span></a></li>';
			}
			$('.featuredList').find('ul,ol').html(inner_container);
		}
		if ($('.featuredList').closest('.shoptitle').find('h3').text()=='New In' || $('.featuredList').length < 1) {
			var section = "Shopper's Picks";
			placeholder = '<div class="placeholder"><p><b>Upload '+ section +' images</b> <small>Use multiple images to create a '+ section +' at the top of your Storefront.</small></p><p class="notify">Use the <b>'+ section +' Images</b> section in the left sidebar to add images.</p></div>';
			container = '<div class="shoptitle index top"><h3>'+section+'</h3><div class="featuredList"><ol class="stream"><li class="itemElement" style="opacity:0.5"><a href="#"><span class="figure"><img src="//static-ec6.thefancy.com/_static_gen/themes/assets/img/blank.325472601571.gif" style="background-color:#b7b8ba;"></span><span class="figcaption"><small class="category">Thursday Boot Company</small><b class="title">Product Name</b> <span class="price">$100 <small class="unit">USD</small></span></span></a></li>   <li class="itemElement" style="opacity:0.5"><a href="#"><span class="figure"><img src="//static-ec6.thefancy.com/_static_gen/themes/assets/img/blank.325472601571.gif" style="background-color:#b7b8ba;"></span><span class="figcaption"><small class="category">Thursday Boot Company</small><b class="title">Product Name</b> <span class="price">$100 <small class="unit">USD</small></span></span></a></li>   <li class="itemElement" style="opacity:0.5"><a href="#"><span class="figure"><img src="//static-ec6.thefancy.com/_static_gen/themes/assets/img/blank.325472601571.gif" style="background-color:#b7b8ba;"></span><span class="figcaption"><small class="category">Thursday Boot Company</small><b class="title">Product Name</b> <span class="price">$100 <small class="unit">USD</small></span></span></a></li></ol></div>'+placeholder+'</div>';
			if ($('.blogSection').length>0) {
				$('.blogSection').before(container);
			}else{
				$('#content').append(container);
			}
		}
		if ($('.featuredList').closest('.shoptitle').find('h3').text()=="Shopper's Picks" || $('.featuredList').length < 1) {
			var section = "New In";
			placeholder = '<div class="placeholder"><p><b>Upload '+ section +' images</b> <small>Use multiple images to create a '+ section +' at the top of your Storefront.</small></p><p class="notify">Use the <b>'+ section +' Images</b> section in the left sidebar to add images.</p></div>';
			container = '<div class="shoptitle index top"><h3>'+section+'</h3><div class="featuredList"><ol class="stream"><li class="itemElement" style="opacity:0.5"><a href="#"><span class="figure"><img src="//static-ec6.thefancy.com/_static_gen/themes/assets/img/blank.325472601571.gif" style="background-color:#b7b8ba;"></span><span class="figcaption"><small class="category">Thursday Boot Company</small><b class="title">Product Name</b> <span class="price">$100 <small class="unit">USD</small></span></span></a></li>   <li class="itemElement" style="opacity:0.5"><a href="#"><span class="figure"><img src="//static-ec6.thefancy.com/_static_gen/themes/assets/img/blank.325472601571.gif" style="background-color:#b7b8ba;"></span><span class="figcaption"><small class="category">Thursday Boot Company</small><b class="title">Product Name</b> <span class="price">$100 <small class="unit">USD</small></span></span></a></li>   <li class="itemElement" style="opacity:0.5"><a href="#"><span class="figure"><img src="//static-ec6.thefancy.com/_static_gen/themes/assets/img/blank.325472601571.gif" style="background-color:#b7b8ba;"></span><span class="figcaption"><small class="category">Thursday Boot Company</small><b class="title">Product Name</b> <span class="price">$100 <small class="unit">USD</small></span></span></a></li></ol></div>'+placeholder+'</div>';
			$('.collections').after(container);
		}
	}
	if ($('.trending').length<1) {
		section = 'Trending';
		placeholder = '<div class="placeholder"><p><b>Upload '+ section +' images</b> <small>Use multiple images to create a '+ section +' at the top of your Storefront.</small></p><p class="notify">Use the <b>'+ section +' Images</b> section in the left sidebar to add images.</p></div>';
		container = '<div class="shoptitle index"><h3>'+section+'</h3><div class="featuredCover" style="opacity:0.5"><div class="itemElement" style="background:#b7b8ba;box-shadow:none;"><span class="figure"><img src="//static-ec6.thefancy.com/_static_gen/themes/assets/img/blank.325472601571.gif"></span><span class="figcaption" style="background:#ccc;"><span class="bg"></span><b class="title">Product Name</b><a href="#fff" style="background:#ffffff;">Shop Now</a></span></div></div>'+placeholder+'</div>';
		if ($('.blogSection').length>0) {
			$('.shoptitle.index:last-nth-child(2)').before(container);
		}else{
			$('.shoptitle.index:last-child').before(container);
		}
	}
});