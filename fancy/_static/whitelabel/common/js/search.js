$(function(){
    
    function initialize() {

        $('.sortable select').change(function(e) {
            $.ajaxPage.changeParam('order_by',$(this).val())
        })
        $('.sortable small a').click(function(e) {
            $.ajaxPage.changeParam('order_by',$(this).attr('data-sorting-order'));
            return false;
        })
        $(".video_player").videoPlayer({autoplay:true, muted:true});
    }

    // set a flag to check if the stream is restored
    var $stream = $('#content .itemList').attr('loc', location.pathname.replace(/\//g, '-').substr(1)), $last;
    $last = $stream.find('>li:last-child');

    var infiniteshow_options = {
        itemSelector:'#content .itemList > ol > li,#content .followerList > ol > li,#content .collectionList > ul > li',
        streamSelector:'#content .itemList,#content .followerList, #content .collectionList',
        loaderSelector:'#infscr-loading-dummy',
        post_callback: function($items, restored){
            $items.find(".video_player").videoPlayer({autoplay:true, muted:true});
        }
    }
    $.infiniteshow(infiniteshow_options)
    

    initialize()

    $("#content").removeClass("loading");

    $stream.data('restored', $last[0] !== $stream.find('>li:last-child')[0]);
    if(!$stream.find('> li').length) $('div.empty-result').show();

    var $win = $(window)
    var $body = $('html,body')

    $.change_param = function(param,value) {
        // Change a field from url params.
        // and set it as url in the browsers'ss address window.
        var args = location.args
        args[param] = value
        if(value==null||value==undefined||value=='') {
            delete args[param]
        }
        var search = []
        for(k in args) {
            search.push(k+'='+args[k])
        }
        var search_param = search.join('&')
        var path = location.origin+location.pathname+(search_param?('?'+search_param):'')
        history.replaceState({url:path}, document.title, path)    

        location.args = args
    }

    $.ajaxPage({
        contentSelector : '#search-result',
        extraSelector : '.sort',
        scrollTop: false,
        setLoading : function(isLoading){
            if(isLoading) $('#content').addClass('loading');
            else $('#content').removeClass('loading');
        },
        beforeLoad : function(){
            $('div.empty-result').hide();
        },
        success : function($content){
            $.infiniteshow(infiniteshow_options)
            initialize()

            if($content.find('#search-result').length>0) {
                $.change_param('tags',$content.find('#search-result').data('refined-tags'))
            }
        },
        complete : function() {
            $.ajaxPage.scrollto_target = null
        }
    })

    $("#container-wrapper").on('change','[name=category]',function(event){
        event.preventDefault();
        var url = $(this).val();
        $.ajaxPage.changeUrlReloadCustomFilter(url, true);
    });


});
