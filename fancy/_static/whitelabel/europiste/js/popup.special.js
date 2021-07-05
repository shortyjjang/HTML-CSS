// this script is depends on signup.js

jQuery(function($) {
    
    var dlg_invite = $.dialog('dm-invite'), $popup = dlg_invite.$obj;
    
    $popup.find("input[name=email]").keyup(function(e){
        if(e.keyCode == 13){
            e.preventDefault();
            $popup.find(".btn-invite").click();
        }
    })

    $popup.find(".btn-invite").click(function(){
        var emails = $popup.find("input[name=email]").val();
        if(!emails){
            alertify.alert("Please input an email addresses");
            return;
        }

        $popup.find(".btn-invite").prop('disabled', true);
        $.post("/invite_friends_with_emails.json", {emails: emails}, function(json){
            if(json.status_code==1){
                $popup.find("input[name=email]").val('');
                var message = "Invitation sent!";
                if(emails.split(",").length > 1){
                    message = "Invitations sent!";
                }
                alertify.alert(message);
            }else{
                alertify.alert(json.message||'Request Failed. Please try again');
            }
        }).always(function(){
            $(".btn-invite").prop('disabled', false);
        })
    })

    $popup.find('.btn-copy')
        .on('mousedown',function(event) {
            event.preventDefault();
            var $link = $(this);
            Gear.prepareClipboard($link.attr('href')); // see common.js
        })
        .on('mouseup',function(event) {
            event.preventDefault();
            Gear.copyToClipboard(); // see common.js
        })
});
