$(document).ready(function() {
$('.change-owner .btn-owner').on('click',function(event){
    var new_owner_name = $('.change-owner input:text').val();
    var placeholder_str = $('.change-owner input:text').attr('placeholder');
    var thing_id = $(this).attr('tid');
    var old_user_id = $(this).attr('uid');
    var new_thing_id = $(this).attr('ntid');
    
    if (new_owner_name == placeholder_str || new_owner_name.length <=0){
            alert("Please enter new username.")
            return false;
    }

    var param = {};
    if(window.confirm('sure to owner of the current thing to username: '+new_owner_name+'?')){
        param['new_owner_name']=new_owner_name;
        param['thing_id']=thing_id;
        param['new_thing_id']=new_thing_id;
        param['old_user_id']=old_user_id;

        $.post("/change_new_thing_owner.xml",param, 
            function(xml){
                if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                    alert('done');
                    location.href = $(xml).find("url").text();
                }
                else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                    var msg = $(xml).find("message").text();
                    alert(msg);
                }
            }, "xml");
    }
    return false;
});

$('#homepage_y').on('click', function(event){
    if( $(this).is(":checked") ){
        $("#time_date_published, #homepage_video").show();
    }else{
        $("#time_date_published, #homepage_video").hide();
    }
});

$('.show-on-homepage .btn-video-featured').on('click',function(event){
    var thing_id = $(this).attr('tid');
    var user_id = $(this).attr('uid');
    var new_thing_id = $(this).attr('ntid');
    var show_on_homepage = $(this).closest('p').find("input:checkbox").is(":checked");
    var param = {};
    param['thing_id']=thing_id;
    param['new_thing_id']=new_thing_id;
    param['user_id']=user_id;
    param['show_on_homepage'] = show_on_homepage
    $.post("/set_show_video_on_homepage.xml",param, 
        function(xml){
            if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {                
                alert('show video on timeline set');                
            }
            else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                var msg = $(xml).find("message").text();
                alert(msg);
            }
        }, "xml");
    return false;
});

$('.show-on-homepage .btn-date-published').on('click',function(event){
    var show_on_homepage = $('#homepage_y').is(":checked")?1:0;
    var date_published = $('#time_date_published').val();
    var thing_id = $(this).attr('tid');
    var user_id = $(this).attr('uid');
    var new_thing_id = $(this).attr('ntid');
    var param = {};
    param['show_on_homepage']=show_on_homepage;
    param['date_published']=date_published;
    param['thing_id']=thing_id;
    param['new_thing_id']=new_thing_id;
    param['user_id']=user_id;
    $.post("/set_show_on_homepage.xml",param, 
        function(xml){
            if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {                
                alert('Date published set');                
            }
            else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                var msg = $(xml).find("message").text();
                alert(msg);
            }
        }, "xml");
    return false;
});

$('#feature_item_epick').on('click', function(event){
    if( $(this).is(":checked") ){
        $("#time_date_epicks").show();
    }else{
        $("#time_date_epicks").hide();
    }
});

$('.feature_item_on .time_date_epicks').on('click',function(event){
    var editor_picked = $('#feature_item_epick').is(":checked")?$('#time_date_epicks').val():'';
    var thing_id = $(this).attr('tid');
    var user_id = $(this).attr('uid');
    var new_thing_id = $(this).attr('ntid');
    var param = {};
    param['editor_picked']=editor_picked;
    param['thing_id']=thing_id;
    param['new_thing_id']=new_thing_id;
    param['user_id']=user_id;
    $.post("/set_editor_picked.xml",param, 
        function(xml){
            if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {                
                alert('editors picked set');                
            }
            else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                var msg = $(xml).find("message").text();
                alert(msg);
            }
        }, "xml");
    return false;
});

$('.show_newest button').on('click',function(event){
    var param = {
        sale_item_id: $(this).attr("sid"),
        show_in_newest: $('.show_newest input#show_in_newest').is(":checked") ? "true" : "false"
    };
    $.post("/set_show_in_newest.xml",param, 
        function(xml){
            if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {                
                alert('show in newest set');                
            }
            else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                var msg = $(xml).find("message").text();
                alert(msg);
            }
        }, "xml");
    return false;
});

$('.reassign .btn-reassign').on('click',function(event){
    var reassign_thing_id = $('.reassign input:text').val();
    var placeholder_str = $('.reassign input:text').attr('placeholder');
    var thing_id = $(this).attr('tid');
    var user_id = $(this).attr('uid');
    var new_thing_id = $(this).attr('ntid');
    var selectedRow = $(this);
    if (!reassign_thing_id.is_int()){
        alert("Please enter thing_id");
        return false;
    }
    if (thing_id == reassign_thing_id){
        alert("Please check thing_id. You can't merge this to itself.");
        return false;
    }

    var param = {};
    if($(this).hasClass('waiting')){
        return false;
    }
    if(window.confirm('sure to delete the current thing and reassign to thing_id: '+reassign_thing_id+'?')){
        if($(this).hasClass('waiting'))
            return false;
        $(this).addClass('waiting');
        param['reassign_thing_id']=reassign_thing_id;
        param['thing_id']=thing_id;
        param['new_thing_id']=new_thing_id;
        param['user_id']=user_id;
        $.post("/merge_duplicate_things.xml",param, 
            function(xml){
                if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                    alert('done');
                    location.href = $(xml).find("url").text();
                }
                else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                    var msg = $(xml).find("message").text();
                    alert(msg);
                    selectedRow.removeClass('waiting');
                }
            }, "xml");
    }
    return false;
});

$('.buy-url .btn-buy-url').click(function() {
    var buy_url = $('.buy-url input:text').val().trim();
    var buy_url_placeholder = $('.buy-url input:text').attr('placeholder').trim();
    var param = {};
    if (buy_url == buy_url_placeholder || buy_url.length <=0){
        buy_url='';
    }

    var ntid = $(this).attr('ntid');
    var uid = $(this).attr('uid');
    param['buy_url']=buy_url;
    param['ntid']=ntid;
    param['uid']=uid;
    var selectedRow = $(this);
    $.post("/add_buy_url.xml",param, 
        function(xml){
            if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                selectedRow.parent('form').find('input').val('');
                location.reload(true);
            }
            else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                alert($(xml).find("message").text());
            }  
        }, "xml");
    return false;
});

$('.featured-comments .btn-comments').click(function(e){
    e.preventDefault();

    var tid = $(this).attr('tid');
    var uid = $(this).attr('uid');
    var comments = $('.featured-comments li');
    var param = {};

    param['tid']=tid;
    param['uid']=uid;
    param['comments']=[];
    comments.each(function(){
        var comment_id = $(this).find("[name=comment_id]").val();
        if(comment_id)
            param['comments'].push(comment_id);
    })

    $.post("/set_featured_comments.xml",param, 
        function(xml){
            if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {						
                //location.reload(true);
            }
            else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                alert($(xml).find("message").text());
            }  
        }, "xml");
    return false;
});

$('.featured-comments a.btn-del').click(function(e){
    e.preventDefault();
    $li = $(this).parents('li');
    $li.find("span.cmt").remove().end().find("input[name=comment_id]").val("");
});

$('.featured-comments a.btn-up').click(function(e){
    e.preventDefault();
    $li = $(this).parents('li');
    if($li.prev()) $li.prev().before($li);
});

$('.featured-comments a.btn-down').click(function(e){
    e.preventDefault();
    $li = $(this).parents('li');
    if($li.next()) $li.next().after($li);
});

});
