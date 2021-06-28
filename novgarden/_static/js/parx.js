//패럴렉스 애니메이션

jQuery(function($){
var $window = $('body'), $section = $('#content > *'), parxTop = [], marginT = parseInt($('#container-wrapper').css('padding-top')), availH = $(window).height() - marginT, $container = $('.mngparx_container'), scrolling = true, delay = 800;
if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) delay = 300;

if (!$container) return;

$window
	.attr('current-pos',0)
	.css('overflow','hidden');

if (!$container.hasClass('index')) parxTop.push(0);

$section.height(availH)
	.each(function(){
		var $this = $(this), i = $this.index();
		parxTop.push($this.offset().top - marginT);
		$this.attr('section-offset', parxTop[i])
		.find('.background span').css('min-height',$(this).outerHeight()+'px');
	});

//브라우저 리사이징시
$(window).resize(function(){
	location.reload();
});

function parxScreen(wDelta){
	if (scrolling === false) return;

	scrolling = false;
	var paging = parseInt($window.attr('current-pos')), ctop = $window.scrollTop(), next;
	if (paging === 1 && $container.hasClass('index')) $('.index .features').removeClass('show_features').removeClass('about').removeClass('zibap').removeClass('labs');
	if (wDelta === 'down' && paging < parxTop.length ) paging =paging + 1;
	if (wDelta === 'up' && paging > 0) paging = paging - 1;

	if (wDelta === 'down') {
		if (ctop + availH < parxTop[paging] || !parxTop[paging]){
			next = ctop + availH;
			paging =paging - 1;
			$('.mngparx_section:not(#section'+ paging).removeClass('fixed');$('#section'+ paging).addClass('fixed');
		}else{
			next = parxTop[paging];
			$('.mngparx_section:not(#section'+ (paging - 1)).removeClass('fixed');$('#section'+ (paging - 1)).addClass('fixed');
		}
	}else {
		if (parxTop[paging+1] < ctop) {
			paging =paging + 1;
		}else {$('.mngparx_section:not(#section'+ paging).removeClass('fixed');$('#section'+ paging).addClass('fixed');}
		next = parxTop[paging];
	}

	$window
		.animate({scrollTop:next+'px'},{
			duration: delay,
			easing: "swing",
			complete: function(){
				scrolling = true;
			}
		})
		.attr('current-pos',paging);

	//메인페이지 페이징
	if(!$container.hasClass('index')) return;
	if (paging === parxTop.length) paging = paging - 1;
	$('.skip_pagination').find('a').removeClass('current').end().find('a[href="#section'+ paging +'"]').addClass('current');
}

// 마우스로 조정
window.addEventListener('mousewheel', function(e){
	wDelta = e.wheelDelta < 0 ? 'down' : 'up';
	parxScreen(wDelta);
});

//키보드로 조정
window.addEventListener('keydown', function(e){
	wDelta = e.key;
	if (wDelta === 'ArrowDown' || wDelta === 'ArrowUp') {
		wDelta = wDelta === 'ArrowDown' ? 'down' : 'up';
		parxScreen(wDelta);
	}
});

// 터치시 조정
var toucharea = window.innerWidth || document.body.clientWidth, treshold = Math.max(1,Math.floor(0.01 * (toucharea))), touchstartX = 0, touchstartY = 0, touchendX = 0, touchendY = 0, limit = Math.tan(45 * 1.5 / 180 * Math.PI);
window.addEventListener('touchstart', function(e) {
	touchstartX = e.changedTouches[0].screenX;
	touchstartY = e.changedTouches[0].screenY;
}, false);
window.addEventListener('touchend', function(e) {
	touchendX = e.changedTouches[0].screenX;
	touchendY = e.changedTouches[0].screenY;
    var x = touchendX - touchstartX, y = touchendY - touchstartY, xy = Math.abs(x / y);

    if (Math.abs(x) < treshold && Math.abs(y) < treshold) return;
	if (xy > limit) return;

	wDelta = y < 0 ? 'down' : 'up';
	parxScreen(wDelta);
}, false);


});