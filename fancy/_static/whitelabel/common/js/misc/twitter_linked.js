$(document).ready(function() {
      
  $('.network .twitter .switch button').on('click',function(){
    // make button group as a toggle button 
    var parent = $(this).closest("div.after"); 
    var onBtn = parent.find(".btn-switchon"); 
    var offBtn = parent.find(".btn-switchoff");
    if ( onBtn.is(".current") ) {
      var r=confirm('Do you really want to remove twitter connection?');
      if (r==true){
        TwUnlink();
      }
    }else{
      TwLink();
    }
    
    return false;
  });
	

});


function TwLink(){
  var loc = document.location.protocol+"//"+document.location.host;
  var param = {};
  param['location']=loc;

  var selectedRow = $(this);
  var popup = window.open(null, '_blank', 'height=400,width=800,left=250,top=100,resizable=yes', true);
  $.post("/apps/twitter/login.json",param, 
    function(json){
        if (json.status_code == 1) {
          popup.location.href = json.url;
          twitterConnected(popup, json.url,
            function(json){
              if(json.status_code == 1){
                param = {};
                $.post("/link_twitter_user.json",param, 
                  function(json){
                    if (json.status_code == 1) {
                      var screen_name = json.screen_name;
                      var html_str = 'Connected to Twitter as <a href="http://twitter.com/'+screen_name+'"  target="_blank">'+screen_name+'</a>.';

                      var parent = $(".network .twitter");
                      parent.find("div.after-on").html(html_str);
                      parent.find(".switch button.btn-switchoff").removeClass("current");
                      parent.find(".switch button.btn-switchon").addClass("current");
                      parent.find(".after-on").show().end().find(".after-off").hide();                      
                    }
                    else {
                      alertify.alert(json.message||"Please retry your request.");
                    }
                  }, "json");
              }
              else{
                alertify.alert(json.message||"Please retry your request.");
              }
            },
            function(json){
            })
        }
        else{
          popup.close();
          alertify.alert(json.message||"Please retry your request.");
        }  
    }, "json");
}

function TwUnlink(){
  $.post("/unlink_twitter_user.json", {},
      function(json){
      if (json.status_code == 1) {
        var parent = $(".network .twitter");
        parent.find(".switch button.btn-switchon").removeClass("current");
        parent.find(".switch button.btn-switchoff").addClass("current");
        parent.find(".after-off").show().end().find(".after-on").hide();
      }
      else {
          alertify.alert(json.message||"Please retry your request.");//alert('failed');
      }
    }, "json");
}
