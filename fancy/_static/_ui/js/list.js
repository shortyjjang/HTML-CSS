$(function() {
    var $summary = $('#summary');
    var preventDefault = function(e) {
        if (e.which === 1) e.preventDefault();
    }

    var clicked = false;
    $('.menu-title, .menu-content').click(function(e) {
        $(this).closest('.menu-container').toggleClass('opened');
        if($(this).hasClass('menu-title')) e.preventDefault();
        clicked = true;
    });
    $(document).click(function(e) {
        if (e.which === 1) {
            if (clicked) {
                clicked = false;
                return;
            }
            $('.menu-container').removeClass('opened');
        }
    });

    var drag = function(e) {
        if (e.which !== 1 || $(this).hasClass('dragging')) return;
        e.preventDefault();
        var $this = $(this);
        var $li = $this.closest('li');

        var $parent = $li.parent();
        var itemCount = $parent.find('li:visible').length;
        var $clone = $li.clone().addClass('dragging').appendTo($parent);

        $li.addClass('hint-drop');

        var pad = 10;
        var LEFT_LIMIT = 104 - pad; // depends on css
        var RIGHT_LIMIT = 804 + pad; // depends on css
        var TOP_LIMIT = 104 - pad; // depends on css
        var BOTTOM_LIMIT = $parent.height() - 176 + pad; // depends on css
        var parentOffset = $parent.offset();
        var getIndexByOffset = function (x, y) {
            var BLOCK_WIDTH = 230;
            var BLOCK_HEIGHT = 300;
            var idx = Math.min(Math.floor(x / BLOCK_WIDTH), 3) + Math.floor(y / BLOCK_HEIGHT) * 4;
            // if (idx == 0) idx = 1;
            return idx;
        };

        var handleMove = function(e) {
            var relX = e.pageX - parentOffset.left;
            var relY = e.pageY - parentOffset.top;
            relX = Math.min(Math.max(relX, LEFT_LIMIT), RIGHT_LIMIT);
            relY = Math.min(Math.max(relY, TOP_LIMIT), BOTTOM_LIMIT);
            $clone.css({left:relX, top:relY});

            var srcIdx = $parent.children('li:visible').index($li);
            var targetIdx = getIndexByOffset(relX, relY);
            targetIdx = Math.min(targetIdx, itemCount);

            if (srcIdx < targetIdx) {
                $li.insertAfter($parent.children('li:visible').eq(targetIdx));
            } else if (srcIdx > targetIdx) {
                $li.insertBefore($parent.children('li:visible').eq(targetIdx));
            }
        };
        var handleUp = function() {
            $('body').off('mousemove', handleMove).css('cursor','auto');
            $clone.remove();
            $li.removeClass('hint-drop');
            $li = null;
            $parent = null;
            $clone = null;
        };
        handleMove(e);
        $('body').on('mousemove', handleMove).one('mouseup', handleUp).css('cursor','move');
    }
    var orignal_item_ids = [], changed_item_ids = [];
    var $list = $('ol.stream');
    $summary.find('.btn-organize-list').click(function(e) {
        e.preventDefault();

        $.infiniteshow.option('disabled', true);
        $('.viewer .normal').click();

        $('#content').addClass('edit');
        $('#organize-list').show();
		$summary.find('.info').hide();

        orignal_item_ids = [];
        $list.addClass("editing");
        $list.children('li[tid]').each(function(){ orignal_item_ids.push( $(this).attr('tid') ) });
        $list.data('rollback', $list.html())
        $list.find('a').on('click', preventDefault);

        $list.on('dragstart', preventDefault);
        $list.on('mousedown','.figure-item', drag);
        $list.children('li[add-new-thing-button]').hide();
    });

    $('.guide-line h5').hover(
        function(e){
            $(this).parent().find('dl').show();
        },
        function(e){
            $(this).parent().find('dl').hide();
        }
    ).click(function() {
        $(this).parent().find('dl').toggle();
    });

    var tooltip = function(target) {
        var $target = $(target);
        if (!$('#tooltip').length) {
            $('<span>').attr('id','tooltip').appendTo(document.body);
        }
        var $tooltip = $('#tooltip').show();

        $tooltip.text($target.text());
        var o = $target.offset();
        o.left = Math.round(o.left - ($tooltip.width() + 16 - $target.width()) / 2); //16:#tooltip's padding
        o.top = Math.round(o.top - ($tooltip.height() + 9));
        $('#tooltip').offset(o);
    };

    $('.tooltip').hover(function() {
		$(this).find('small').css('margin-left',-($(this).find('small').width()/2)-11+'px');
        //tooltip(this);
    }, function() {
        //$('#tooltip').hide();
    }).click(function() {
        //$('#tooltip').toggle();
    });


    $('.list .vcard .note a').hover(
        function() {
			if ($(this).hasClass('name')==false) {
				$('.list .vcard .note .show-contributors').show();
				if ($('.list .vcard .note .show-contributors').height()>$(this).parents('#summary').height()-30) {
					$('.list .vcard .note .show-contributors').addClass('row');
				}
			}
        },
        function() {
            $('.list .vcard .note .show-contributors').hide();
        }
    );

    $summary.find('.inner-wrapper').hover(
        function() {
            if($summary.hasClass('reposition')) {
                $summary.find('.cover .menu-container').hide();
                return;
            }
            $summary.find('.cover .menu-container').removeClass('opened').show();
        },
        function() {
            if($('#summary').hasClass('reposition')) {
                $summary.find('.cover .menu-container').hide();
                return;
            }
            $summary.find('.cover .menu-container').hide();
        }
    ).mousemove(function(){
        if($summary.hasClass('reposition')) {
            $summary.find('.cover .menu-container').hide();
            return;
        }
        $summary.find('.cover .menu-container').show();
    });

})

$(document).ready(function(){
  window.fbAsyncInit = function() {
      FB.init({appId: '180603348626536', version: 'v2.8', status: true,cookie: true, xfbml: true,oauth : true});
  };
  (function() {
    var e = document.createElement('script');
    e.type = 'text/javascript';
    e.src = document.location.protocol + '//connect.facebook.com/en_US/sdk.js';
    e.async = true;
    document.getElementById('fb-root').appendChild(e);
  }());
});
