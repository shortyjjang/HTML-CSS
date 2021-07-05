
$(document).ready(function() {
      
    $('.social-links a.fb').click(function(){
    	//var tid = $(this).attr('tid');
    	var name = $(this).attr('t_name');
    	var picture = $(this).attr('picture');
    	var link = $(this).attr('link');
    	var description = ' ';
    	if ($(this).attr('note')!= undefined && $(this).attr('note')!= null){
    		description = $(this).attr('note');
    	}
              
      FB.getLoginStatus(function(response){
        if (response.authResponse) {
          FB.ui(
            {
              method: 'feed',
              name: name,
              link: link,
              picture: picture,
              caption: ' ',
              description: description,
              message: ''
            },
            function(response) {
              if (response && response.post_id) {
                //alert('Post was published.');
              } else {
              }
            }
          );                  
        }
        else{
          FB.login(function(response2) {
            if (response2.authResponse) {
              //if (response.perms) {
                  FB.ui(
                    {
                      method: 'feed',
                      name: name,
                      link: link,
                      picture: picture,
                      caption: ' ',
                      description: description,
                      message: ''
                    },
                    function(response) {
                      if (response && response.post_id) {
                        //alert('Post was published.');
                      } else {
                      }
                    }
                  );
              //} else {
              //}
            } else {
            }
          }, {scope:'publish_stream'});
        }
      });
    	return false;
    });
      
      
    $('.social-links a.tw').click(function() {
  		var url = 'http://twitter.com/share?'
  		var name = $(this).attr('t_name');
  		var link = $(this).attr('link');
  		url = url+'via=fancy&url='+link+'&text='+name;
  		window.open(url, 'tweet-share', 'height=400,width=600,left=250,top=100,resizable=yes', true);

      return false;
    });
});

var fancy_fancyit_check_p = null;
if (parent.postMessage)
    fancy_fancyit_check_p = parent
else if(parent.document.postMessage)
    fancy_fancyit_check_p = parent.document

if(fancy_fancyit_check_p != undefined && fancy_fancyit_check_p != null)
    fancy_fancyit_check_p.postMessage('fancy.fancyit.fancyd','*');
