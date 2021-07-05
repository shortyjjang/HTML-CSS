$(document).ready(function() {
      
  $('.network .twitter .switch button').on('click',function(){
    // make button group as a toggle button 
    var parent = $(this).parents("div.after").first(); 
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
  $.post("/apps/twitter/login.xml",param, 
    function(xml){
        if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
          popup.location.href = $(xml).find("url").text();
          twitterConnected(popup,$(xml).find("url").text(),
            function(xml){
              if($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1){
                param = {};
                $.post("/link_twitter_user.xml",param, 
                  function(xml){
                    if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                      var screen_name = $(xml).find("screen_name").text();
                      var html_str = 'Connected to Twitter as <a href="http://twitter.com/'+screen_name+'"  target="_blank">'+screen_name+'</a>.<br/><input type="checkbox" checked="checked" id="post_to_facebook" /><label for="post_to_twitter" class="connect-label">Tweet things you fancy automatically.</label>';

                      var parent = $(".network .twitter");
                      parent.find("div.after-on").html(html_str);
                      parent.find(".switch button.btn-switchoff").removeClass("current");
                      parent.find(".switch button.btn-switchon").addClass("current");
                      parent.find(".after-on").show().end().find(".after-off").hide();                      
                    }
                    else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                      alert($(xml).find("message").text());
                    }
                    else {
                      //alert('failed');
                    }
                  }, "xml");
              }
              else{
              }
            },
            function(xml){
            })
        }
        else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
          popup.close();
          alert($(xml).find("message").text());
        }  
    }, "xml");
}

function TwUnlink(){
  $.post("/unlink_twitter_user.xml", {},
      function(xml){
      if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
        var parent = $(".network .twitter");
        parent.find(".switch button.btn-switchon").removeClass("current");
        parent.find(".switch button.btn-switchoff").addClass("current");
        parent.find(".after-off").show().end().find(".after-on").hide();
      }
      else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
          alert($(xml).find("message").text());
      }
      else {
          //alert('failed');
      }
    }, "xml");
}
