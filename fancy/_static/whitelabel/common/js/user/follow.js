jQuery(function($) {
    var dlg = $.dialog('follow_list');

    var isLoading = false;
    function loadUsers(url, callback){
        if(isLoading) return;
        isLoading = true;
        dlg.$obj.find("div > ul").append('<li class="loading"></li> ');
          
        $.ajax({
            type : 'get',
            url  : url,
            dataType : 'html',
            success  : function(html){
                isLoading = false;
                callback(html);
            }
        });
    }
    function userScroll(e){
        var $this = $(this);
        var scrollTop = $this.scrollTop();
        var scrollHeight = $this[0].scrollHeight;
        if(scrollTop > scrollHeight - $this.height() - 100 ){
            var nextUrl = $this.closest(".popup").find("a.btn-next").attr('href');
            if(nextUrl){
                loadUsers(nextUrl, function(html){
                    var $html = $(html);
                    dlg.$obj.find("div > ul").find('li.loading').remove().end().append( $html.find("li") ).end();
                    var nextUrl = $html.find("a.btn-next").attr("href");
                    if(nextUrl){
                        dlg.$obj.find("div a.btn-next").attr('href', nextUrl );  
                    }else{
                        dlg.$obj.find("div a.btn-next").remove();
                    }
                });
            }
        }
    }

    $('#summary .user-info .info a.following').click(function(event) {
        event.preventDefault();

        var username = $(this).attr('username');

        dlg.$obj.addClass('loading').find(">h3").html("Followings").end().find("div").empty();
        var url = $(this).attr('href')+'?popup';
        loadUsers(url, function(html){
            dlg.$obj.removeClass('loading').find("div").html( html );
            dlg.$obj.find("div > ul").off('scroll').on('scroll', userScroll);
        });
        dlg.open();
    });
    $('#summary .user-info .info a.follower').click(function(event) {
        event.preventDefault();

        var username = $(this).attr('username');

        dlg.$obj.addClass('loading').find(">h3").html("Followers").end().find("div").empty();
        var url = $(this).attr('href')+'?popup';
        loadUsers(url, function(html){
            dlg.$obj.removeClass('loading').find("div").html( html );
            dlg.$obj.find("div > ul").off('scroll').on('scroll', userScroll);
        });
        dlg.open();
    });
});
