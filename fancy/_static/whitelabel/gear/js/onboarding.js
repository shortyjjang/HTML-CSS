$(function(){

    var dialog = $.dialog("onboarding");
    var interests = [];
    var follows = {};

    $(document.body).addClass('fixed');

    function filter_stores() {
        interests = [];
        dialog.$obj.find('.step1 a.selected').each(function(){
            var iid = $(this).closest('[data-interest-id]').data('interest-id');
            interests.push(iid);
        });

        if(interests.length){
            $(".step2 dl[data-interest]").addClass("hidden").hide();
            interests.forEach(function(interest){
                $(".step2 dl[data-interest="+interest+"]").each(function(){
                    $(this).removeClass("hidden").show();
                })
            })
        }
        $(".step2 dl[data-seller-id]:not(.hidden)").each(function(i, dl) {
            console.log($(dl).data("seller-id"));
            $(".step2 dl[data-seller-id="+$(dl).data("seller-id")+"]:not(.hidden)").each(function(i, dl) {
                if(i==0) {
                } else {
                    $(this).addClass("hidden").hide();
                }
            });
        });
    }

    var step2_ready = false;
    function ready_step2(callback) {
        if(step2_ready) return;

        var callee = arguments.callee;
        if(callback) {
            if(!callee.onReady) {
                callee.onReady = []
            }
            callee.onReady.push(callback);
        }

        if(callee.ajax) {
            console.log('Previous request for step2 exists');
            return;
        }

        callee.ajax = $.get('/onboarding?include_step2=true', function(response) {
            $html = $(response)
            $('.popup.onboarding .step2 .section.followers-list').html($html.find('.popup.onboarding .step2 .section.followers-list').html()).removeClass('loading');
            step2_ready = true;

            if(callee.onReady) {
                for(var i in callee.onReady) {
                    callee.onReady[i]();
                }
            }
        });
    }
    ready_step2(filter_stores);

    dialog.$obj
        .on("click", "li > a", function(e){
            e.preventDefault();
            var $step = $(this).closest('.step');
            $(this).toggleClass("selected");

            if( $step.find("a.selected").length ){
                $step.find(".buttons").removeAttr('disabled');
            }else{
                $step.find(".buttons").attr('disabled','disabled');
            }
        })
        .on("click", ".step1 .btn-skip", function(e){
            $(this).closest('.step1').find("a.selected").removeClass('selected');
            dialog.$obj.removeClass("step1").addClass("step2");
            filter_stores();
        })
        .on("click", ".step1 .buttons", function(e){
            filter_stores();

            /*
            interests = [];
            $(this).closest('.step1').find("a.selected").each(function(){
                var iid = $(this).closest('[data-interest-id]').data('interest-id');
                interests.push(iid);
            });

            if(interests.length){
                $(".step2 dl[data-interest-ids]").hide();
                interests.forEach(function(interest){
                    $(".step2 dl[data-interest-ids]:hidden").each(function(){
                        var ids = $(this).data('interestIds');
                        if(ids.indexOf(interest+"")>-1) $(this).show();
                    })
                })
            }else{
                $(".step2 dl[data-interest-ids]").show();
            }
            */

            dialog.$obj.removeClass("step1").addClass("step2");
        })
        .on("click", ".step2 a:not(.follow,.following,.unfollow)", function(e){
            e.preventDefault();
        })
        .on("click", ".step2 dl", function(e){
            var $button = $(this).find('.btn-follow a:visible');
            if($button.parent().is(".following")) $button = $button.filter('.unfollow');
            else $button = $button.filter('.follow');
            $button.trigger('click');
        })
        .on("click", ".step2 .btn-follow > a", function(e){
            e.preventDefault();
            e.stopPropagation();
            var $button = $(this);
            var username = $button.data('username');
            var is_store = $button.data('store');

            if($button.is(".follow")){
                $button.parent().removeClass('follow').addClass('following')
                follows[username] = true;
            }else{
                $button.parent().removeClass('following').addClass('follow')
                if(follows[username]) delete follows[username];
            }
        })
        .on("click", ".step2 .btn-back", function(e){
            dialog.$obj.removeClass("step2").addClass("step1");
        })
        .on("click", ".step2 .buttons", function(e){
            $.ajax({
                type : 'post',
                url  : '/update-interests.json',
                data : {interests:interests.join(",")},
                success  : function(json){
                    $.ajax({
                        type : 'post',
                        url  : '/follows.json',
                        data : {usernames:Object.keys(follows).join(","), store:"true"},
                        success  : function(json){
                            dialog.close();
                        }
                    });
                }
            });
        })

}) 
