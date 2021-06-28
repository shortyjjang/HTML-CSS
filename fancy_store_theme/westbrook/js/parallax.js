$(document).ready(function(){
	
	/* TEMPORARY  ************************************************************************/
	
	function trace(arg){};
	
	/* VARS ************************************************************************/
	
	var mainNavEnabled = true;
	
	var headerOffset = 99;
	//var bottomReveal = 175;
	// var bottomReveal = 295;
	var bottomReveal = 115;
	//var portraitBottomReveal = 595;
	var portraitBottomReveal = 495;
	
	var resizeTimer;
	var scrollTimer;
	
	var scrolling = false;
	
	var currentSection = 0;

	$window = $(window);
	
	var sectionLocArray = new Array();
	sectionLocArray[0] = 0;
	
	var sectionDivideArray = new Array();
	
	// *** CATEGORY NUMBER ADJUSTMENT - MANUAL ***
	var sectionNameArray = new Array();
	sectionNameArray = ['#home','#shop_gold','#shop_optical','#shop_nba', '#allstar_16', '#shop_black','#shop_artist','#russell','#community','#attributes','#contact'];

	var param = document.URL.split('#')[1];

	// *** CATEGORY NUMBER ADJUSTMENT - AUTO ***
	var shopSections = $('#shop_dropdown_nav a').length;
	var shopSectionsOffset = shopSections-1;

	var numSections = $('.section').length;
	
	var isMobile;
	
	initStep1();

	
		
	/* INIT ************************************************************************/
	
	function initStep1(){
      
      	var percent = 0;
      
      	var loader = $('.loaderCanvas').ClassyLoader({
			speed:100,
		    percentage: 2,
		    diameter: 60,
		    showText: false,
		    animate: false,
            lineColor: 'rgba(0, 0, 0, 1)',
            remainingLineColor: 'rgba(255, 255, 255, 0)',
		    lineWidth: 10
		});
      
		populateCommunitySection();
      
		if ("ontouchstart" in window || navigator.msMaxTouchPoints){
			isMobile = true;
		} else {
			isMobile = false;
		}
		
		initScrollListener();
		
		if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
			$("#prlx_content").css({'-webkit-transform': 'translate3d(0,0,0)'});
		}
		
		$.waitForImages.hasImgProperties = ['background-image'];
		
		$('.hidden').waitForImages({
			finished: function(loaded, count, success) {
				initStep2();
			},
			each: function(loaded, count, success){
				var percent = Math.floor((loaded/(count+2))*100);
//               	console.log(loaded + " " + count);
// 				loader.draw(percent);
                loader.setPercent(percent);
              	loader.delay(500).show();
//               	console.log(percent);
			},
			waitForAll: 'true'
		});
      
      function drawLoader(){
        
      }
			
	}
	
	
	
	function initStep2(){
		setPageTopHeight();
		setTimeout(function(){
			sectionLocations();
			sectionDivisions();
			ifPageParam();
			setTimeout(function(){
				$('.hidden').animate({'opacity':1}, 'slow', function(){
					$('#loader').hide();
				});
			}, 100);
		},200);
      	setUpShop('content_shop_artist');
		setUpShop('content_shop');
		setUpShop('content_shop_black');
		setUpShop('content_shop_optical');
      	setUpShop('content_shop_allstar');
      	setUpShop('content_shop_allstar_2016');
      	setUpShop('content_shop_nba');
		initNav();
		setShopSubNavEvent();
		initMailChimpSignup();
//       	startMastheadFadeTimer();
//       	swapMasthead();
		if(isMobile){
			//setUpMobile();
		}
	}
	
	
	/* WINDOW EVENTS ************************************************************************/
	
	$window.resize(function(){
  		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function(){
			setPageTopHeight();
			sectionLocations();
			sectionDivisions();
			//trace('resize event');
		}, 100);
	}); 
	
	function initScrollListener(){ 
		$window.scroll($.throttle( 20, scrollEvent ));	
	}
	
	
	/* FUNCTIONS ************************************************************************/
	
	function setUpMobile(){
		// var numSections = $('.section').length - 1;
		// $('#bg1, #bg2').css({'background-image':'none'});
		// $('.section:lt('+numSections+')').css({'margin-bottom':'0px'});
		// $("<div class='tabletBG'></div>").insertAfter('.section:lt('+numSections+')');
		// $('.tabletBG').last().css({'height':'70px'});
		// $('.tabletBG:even, #footer').addClass('altBG');
	}


	function initMailChimpSignup(){
		$('#mc-embedded-subscribe-form').ajaxChimp({
    		url: 'http://dmaunited.us2.list-manage1.com/subscribe/post?u=34f46d32b3ca6c06b0ec5d944&amp;id=97d0c4d839',
			callback: mcCallback
		});
	}
	
	function mcCallback (resp) {
//       console.log(resp.msg + " mailchimp");
   		if (resp.result === 'success') {
            //alert('success');
			$("#mc-embedded-subscribe").css({'display':'none'});
			$(".mcSuccessForm").css({'display':'block'});
			$(".mcErrorForm").css({'display':'none'});
    	}else{
			//alert('error');
          	
			$(".mcErrorForm").css({'display':'block'});
		}
	}
	
	
	var lastPosition = -1;
	function animation(){
		 if (lastPosition == window.pageYOffset) {
       		requestAnimationFrame(animation);
        	return false;
		} else {
			lastPosition = window.pageYOffset;
			scrollEvent(lastPosition);
			requestAnimationFrame(animation);
		}
	}
	
	function scrollEvent(){
		if(!isMobile){
			setBGPos();
		}
		
		if(!scrolling){
	   		scrolling = true;
	    }
		
		//trace('event');
	   
	   clearTimeout(scrollTimer);
		scrollTimer = setTimeout(function(){
			scrolling = false;
			findActiveLink();
			
		}, 500);    
	}
 	
	
	function populateCommunitySection(){
		if(typeof tumblr_api_read === "undefined"){
			// do nothing
			
		}else{
			var col = 0;
			var numPosts = tumblr_api_read['posts'].length;
			if(numPosts > 12){
				numPosts = 12;
			}
			for(var n=0;n<numPosts;n++){
				$('.comm_col').eq(col).append('<a href="http://westbrookframes.tumblr.com" target="_blank"><img src="' + tumblr_api_read['posts'][n]['photo-url-250'] + '" width="320" border="0" /></a>');
				col++;
				if(col > 2){
					col = 0;
				}
				//trace(tumblr_api_read['posts'][n]['photo-url-400']);
			}
		}
	}
	
	
	/* HISTORY & URL STRING************************/
	
	function saveState(n){
		var stateObj = { 'foo': 'bar' };
		history.pushState(stateObj, null, sectionNameArray[n]);
	}
	

	// *** CATEGORY NUMBER ADJUSTMENT - MANUAL ***
	function ifPageParam(){
		if(param != undefined){
			getPageSection(param, false);
		}else{
			/*VIDEO MAKES TOP SECTION TITLE DISAPPEAR FIX */
			$window.scrollTop(1);
		}
	}
  
    function getPageSection(param, scroll){
      var jumpNum;
      var linkNum;
      switch(param){
            case 'home':
          		jumpNum = 0;
          		linkNum = 0;
                //jumpTo(0);
            break;
            case 'shop':
          		jumpNum = 1;
          		linkNum = 1;
//                 jumpTo(sectionLocArray[1]);
//                 setActiveLink(1);
            break;

            case 'shop_gold':
          		jumpNum = 1;
          		linkNum = 1;
//                 jumpTo(sectionLocArray[2]);
//                 setActiveLink(1);
            break;
            case 'shop_optical':
          		jumpNum = 2;
          		linkNum = 1;
//                 jumpTo(sectionLocArray[3]);
//                 setActiveLink(1);
            break;
            case 'shop_nba':
          		jumpNum = 3;
          		linkNum = 1;
//                 jumpTo(sectionLocArray[4]);
//                 setActiveLink(1);
            break;
  // 				case 'shop_allstar':
  // 					jumpTo(sectionLocArray[6]);
  // 					setActiveLink(1);
  // 				break;
            case 'shop_allstar_16':
          		jumpNum = 4;
          		linkNum = 1;
//                 jumpTo(sectionLocArray[5]);
//                 setActiveLink(1);
            break;
            case 'shop_black':
          		jumpNum = 5;
          		linkNum = 1;
//                 jumpTo(sectionLocArray[6]);
//                 setActiveLink(1);
            break;
             case 'shop_artist':
          		jumpNum = 6;
          		linkNum = 1;
//                 jumpTo(sectionLocArray[1]);
//                 setActiveLink(1);
            break;
            case 'russell':
          		jumpNum = 7;
          		linkNum = 2;
//                 jumpTo(sectionLocArray[7]);
//                 setActiveLink(2);
            break;
            case 'community':
          		jumpNum = 8;
          		linkNum = 3;
//                 jumpTo(sectionLocArray[8]);
//                 setActiveLink(3);
            break;
            case 'attributes':
          		jumpNum = 9;
          		linkNum = 4;
//                 jumpTo(sectionLocArray[9]);
//                 setActiveLink(4);
            break;
            case 'contact':
          		jumpNum = 10;
          		linkNum = 5;
//                 jumpTo(sectionLocArray[10]);
//                 setActiveLink(5);
            break;
            case 'contact-success':
          		jumpNum = 10;
          		linkNum = 5;
//                 jumpTo(sectionLocArray[10]);
//                 setActiveLink(5);
                $('.successForm').css({'display':'block'});
                $('#contactFormSubmit').hide();
            break;
            case 'contact-fail':
          		jumpNum = 10;
          		linkNum = 5;
//                 jumpTo(sectionLocArray[10]);
//                 setActiveLink(5);
                $('.errorForm').css({'display':'block'});
            break;
            default:
            break;
        }
      
      	if(scroll){
          	scrolling = true;
       		scrollToSection(sectionLocArray[jumpNum]);
          	saveState(jumpNum);
          console.log(jumpNum + " " + sectionLocArray[jumpNum]);
      	}else{
        	jumpTo(sectionLocArray[jumpNum]);
      	}
      
      	setActiveLink(linkNum);
      
    }
	
	
	
	/* MAIN NAV ************************/
	
	function initNav(){
		for(var n=0;n<6;n++){
			setMainNavEvent(n);
		}
	}
	
	// *** CATEGORY NUMBER ADJUSTMENT - AUTO ***
	function setMainNavEvent(n){
		$('#header_nav ul li a').eq(n).click(function(){
			/* conditional added for shop dropdown */
          
          getPageSection($(this).attr('data-loc'), true);
// 			if(n!=1){
// 				scrolling = true;
// 				setActiveLink(n);
// 				if(n>1){
// 					saveState(n+shopSectionsOffset);
// 					scrollToSection(sectionLocArray[n+shopSectionsOffset]);
// 				}else{
// 					saveState(n);
// 					scrollToSection(sectionLocArray[n]);

// 				}
				
// 			}	
		}).removeAttr('href');
	}
	
	
	// *** CATEGORY NUMBER ADJUSTMENT - AUTO ***
	function findActiveLink(){
		var step = 0;
		while($window.scrollTop()>sectionDivideArray[step]-1){
			step++;
		}
		if(currentSection != step){
			if($('#header_nav ul li a').eq(step).hasClass('active')){
				// do nothing	
				
			}else{
				
				/* conditional added for shop dropdown */
				/* additional adjustments in ifPageParam() */
				// if(step == 1 || step==2 || step==3){
				if(step>0 && step <= shopSections){
					setActiveLink(1);
				}else{
					/* offset added due to shop dropdown = # of dropdown items minus 1 */
					
					setActiveLink(step-shopSectionsOffset);
					
				}
			}
			currentSection = step;
			
		}
	}
	
	function setActiveLink(n){
		$('#header_nav ul li a').removeClass('active');
// 		window.console.debug(n);
		if(n > 0){
			$('#header_nav ul li a').eq(n).addClass('active');
		}
	}
	
	// *** CATEGORY NUMBER ADJUSTMENT - MANUAL ***
	function setShopSubNavEvent(){
      	var n;
		$('.hp_scroll').click(function(){
		 // n = $('.hp_scroll').index(this);
          		
         getPageSection($(this).attr('data-loc'), true);
          console.log($(this).attr('data-loc'));
          // FIXES FOR ALLSTAR SUB NAV //
//           switch(n){
//             case 0:
//               n=2;
//             break;
//             case 1:
//            	break;
//             default:
//               n=n+1;
//             break;
//           }
//           scrolling = true;
//           setActiveLink(1);
// 		  scrollToSection(sectionLocArray[n]);
//           saveState(n);
              	
		}).removeAttr('href');
	}
	
	
	
	
	/* PAGE & BG POSITIONS ************************/
	
	function jumpTo(offset){
		$('html, body').scrollTop(offset);
	}
	
	function scrollToSection(offset){
		var time = Math.abs(($window.scrollTop()*.5) - offset);
		if(time<800){
			time = 1000;
		}
      time = 800;
		//trace(time);
		$('html, body').stop().animate({'scrollTop':offset},time,'easeInOutExpo',function(){
			mainNavEnabled = true;
		});
	}
	function setBGPos(){
			var scrollTop = window.pageYOffset;
			var bg2Pos = 'translate3d(0,' + (-300+Math.round(scrollTop/5)) + 'px,0)';
			var bg1Pos = 'translate3d(0,' + (-300+Math.round(scrollTop/3)) + 'px,0)';
			var topBgPos = 'translate3d(0,' + (-1*Math.round(scrollTop/2)) +'px,0)';
			
			$('#bg1').css({
				'-moz-transform':bg1Pos,
				'-webkit-transform':bg1Pos,
				'-o-transform':bg1Pos,
				'-ms-transform':bg1Pos,
				'transform':bg1Pos
			});
			
			$('#bg2').css({
				'-moz-transform':bg2Pos,
				'-webkit-transform':bg2Pos,
				'-o-transform':bg2Pos,
				'-ms-transform':bg2Pos,
				'transform':bg2Pos	
			});
			
			$('#page_top >div').css({
				'-moz-transform':topBgPos,
				'-webkit-transform':topBgPos,
				'-o-transform':topBgPos,
				'-ms-transform':topBgPos,
				'transform':topBgPos	
			});
				
 	}
  
  
  /* PAGE MARGINS, SECTION TOPS & DIVISIONS ************************/
    /* BASIC SINGLE IMAGE ************************/
  
  function setPageTopHeight(){
		var reveal;
		if(window.orientation == 0 || window.orientation == 180){
			reveal = portraitBottomReveal;
		}else{
			reveal = bottomReveal;
		}
		
		var newHeight = ($window.height() - headerOffset - reveal) + "px";
		var newMargin = ($window.height() - reveal) + "px";
		$('#page_top').css({'height':newHeight});
		$('#page_top div').css({'height':newHeight});
		
		$('#bg1, #bg2').css({'height':$("#prlx_content").outerHeight(true)});
	}
	


	/* PAGE MARGINS, SECTION TOPS & DIVISIONS ************************/
    /* VIDEO AND SLIDESHOWS ************************/
 
//  	function setPageTopHeight(){
//       	$('video').css({'visibility':'hidden'});	
      
// 		var reveal;
// 		if(window.orientation == 0 || window.orientation == 180){
// 			reveal = portraitBottomReveal;
// 		}else{
// 			reveal = bottomReveal;
// 		}
// 		//var newHeight = ($window.height() - headerOffset - reveal) + "px";
      
//       	// FIXES FOR ARTIST SLIDESHOW //
//       if($window.width() >= 1024){
// 		var maxHeight = ($window.height() - headerOffset - reveal);
//       	var newHeight = Math.round($window.width() * 949 / 2000);
//       }else{
//         var newHeight = 1024 * 949 / 2000;
//         var maxHeight = newHeight;
//       }

//       	if(newHeight > maxHeight){
//       		newHeight = maxHeight;
          	
//       	}
//       newHeight = newHeight + "px";
      	
//       console.log('win width ' + $window.width() + 'win height ' + $window.height());
//       	console.log('new ' + newHeight + 'max ' + maxHeight);
      
// 		var newMargin = ($window.height() - reveal) + "px";
	
//       	$('#page_top, #page_top div').css({'height':newHeight});
		
// 		$('#bg1, #bg2').css({'height':$("#prlx_content").outerHeight(true)});
      	
//       	var videoMargin = -1*($('video').width()/2);
// 		$('video').css({'margin-left':videoMargin});
//       	/* CENTER VIDEO */
//         setTimeout(function(){
//               var videoMargin = -1*($('video').width()/2);
//               $('video').css({'margin-left':videoMargin});
//               $('video').css({'visibility':''});	
//         },500);
// 	}
  
  
	function sectionLocations(){
		for(var n=0;n<numSections;n++){
			recordSectionLoc(n);
		}
	}
	
	function recordSectionLoc(n){
		var centerOffset = 0;
		var section = $('.section');
		if(section.eq(n).outerHeight()<($window.height() - headerOffset)){
			centerOffset = (($window.height() - headerOffset) - section.eq(n).outerHeight())/2;
		}
		
		var newLoc = section.eq(n).offset().top - headerOffset - centerOffset;
		sectionLocArray[(n+1)] = newLoc;
		
		//trace('sec top = '+newLoc);
	}
	
	function sectionDivisions(){
		for(var n=0;n<numSections;n++){
			recordSectionDivide(n);
		}
	}
	
	function recordSectionDivide(n){
		sectionDivideArray[n] = sectionLocArray[n+1] - ((sectionLocArray[n+1] - sectionLocArray[n])/2);
		//trace('divider '+ n + ' = '+sectionDivideArray[n]);
		
	}
	
	
	
	/* SHOP SECTION STAGGERED ROWS ************************/
	
	function isEven(value) {
		if (value%2 == 0){
			return true;
		}else{
			return false;
		}
	}

	function setUpShop(containingDiv){
		var numShopItems = $('#' + containingDiv + ' .product_array .hp_product').length;
// 		console.log(numShopItems);
		var columnCount = 1;
		var rowCount = 1;
		
		for(var n=0;n<numShopItems;n++){
          	if($('#' + containingDiv + ' .product_array .hp_product').eq(n).hasClass('new-row')){
// 				console.log('break found');
				$('<br />').insertBefore('#' + containingDiv + ' .product_array .hp_product:eq('+n+')');
				columnCount = 1;
				rowCount = 1;
			}
			if(isEven(rowCount)){
				if(columnCount <= 3){
					$('#' + containingDiv + ' .product_array .hp_product').eq(n).addClass('prod_array_right_margin');
				}
				if(columnCount == 4){
					$('<br />').insertAfter('#' + containingDiv + ' .product_array .hp_product:eq('+n+')');
					rowCount++;
					columnCount = 0;
				}
			}else{
				if(columnCount <= 2){
					$('#' + containingDiv + ' .product_array .hp_product').eq(n).addClass('prod_array_right_margin');
				}
				if(columnCount == 3){
					$('<br />').insertAfter('#' + containingDiv + ' .product_array .hp_product:eq('+n+')');
					rowCount++;
					columnCount = 0;
				}
			}
			columnCount++;
		}
	}
  
  
  
  	/* MISC ************************/
  
  $('p.contact_short_link').css({'cursor':'pointer'}).click(function(){
    	getPageSection('contact', true);
  });
  
  /* MASTHEAD ************************/

// 	var currentMH = 0;
// 	var numMastheadSlides = $('#page_top div div').length-1;

// 	function swapMasthead(){
// 		if(currentMH == numMastheadSlides){
// 			$('#page_top div div:eq(0)').css({'left':'100%'}).animate({'left':'0%'}, 4000, 'easeInOutQuart');
// 			$('#page_top div div').eq(numMastheadSlides).animate({'left':'-100%'}, 4000, 'easeInOutQuart');
// 			currentMH = 0;
// 		}else{
// 			$('#page_top div div').eq(currentMH+1).css({'left':'100%'}).animate({'left':'0%'}, 4000, 'easeInOutQuart');
// 			$('#page_top div div').eq(currentMH).animate({'left':'-100%'}, 4000, 'easeInOutQuart');
// 			currentMH++;
// 		}
		
// 		startMastheadFadeTimer();
// 	}

	function startMastheadFadeTimer(){
		setTimeout(function(){
			swapMasthead();
		}, 5000);
	}
 
  $('#page_top div').click(function(){
    	scrollToSection(sectionLocArray[2]);
  });

// 	$("#page_top div div:eq(0)").click(function(e){
// 		window.location = "/products/santa-monica-summer";
// 	});
// 	$("#page_top div div:eq(1)").click(function(e){
// 		window.location = "/products/pasadena-americana";
// 	});
//   	$("#page_top div div:eq(2)").click(function(e){
// 		window.location = "/products/pasadena-americana";
// 	});

// 	$("#page_top").click(function(e){
// 		if(e.pageX<($window.width()/2)){
// 			window.location = "/products/all-star-east-2016";
// 		}else{
// 			window.location = "/products/all-star-west-2016";
// 		}
// 	});

}); 