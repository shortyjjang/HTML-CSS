$(function() {
    var $win = $(window);
    var $body = $('html,body');
    $.ajaxPage({
        contentSelector: '#content',
        scrollTop: false,
		setLoading : function(isLoading){
			if(isLoading) $('#content').addClass('loading');
			else $('#content').removeClass('loading');
		},
		beforeLoad : function(){
			$('div.empty-result').hide();
		},
		success : function($content){
			$.infiniteshow({itemSelector:'#content .itemList > li'});
            if($.ajaxPage.scrollto_target) {
                $body.animate({scrollTop: $($.ajaxPage.scrollto_target).offset().top-($('header').height()+10)},'fast');
            } else {
                //$win.scrollTop(0).trigger('scroll');
            }
		},
        complete : function() {
            $.ajaxPage.scrollto_target = null
        }
    });

    /* Change Column number */
    $('#content').delegate('.collection-view a.change-view', 'click', function(event) {
        var view = $(this).data('view');
        $('.collection-view a.change-view').removeClass('active');
        $(this).addClass('active');
        $('#content>ul.itemList,.store-content>ul.itemList').removeClass('col-2 col-3 col-4');
        $('#content>ul.itemList,.store-content>ul.itemList').addClass(view);
    });

    /* Change Sorting order */
    $('#content').delegate('.collection-header select.sort-by', 'change', function(event) {
        var sort_by = $(this).val();
        $.ajaxPage.changeParam('order_by', sort_by);
    });
});
