

$(document).ready(function() {
      
    $('.sns-button button.btn-f').click(function(){
    	//var tid = $(this).attr('tid');
    	var name = $(this).attr('t_name');
    	var picture = $(this).attr('picture');
    	var link = $(this).attr('link');
    	var description = ' ';
    	if ($(this).attr('note')!= undefined && $(this).attr('note')!= null){
    		description = $(this).attr('note');
    	}
      
      var url = "http://www.facebook.com/sharer.php?u="+encodeURIComponent(link);
      window.open(url, '_blank', 'height=400,width=600,left=250,top=100,resizable=yes')
    	return false;
    });
      
      
    $('.sns-button button.btn-t').click(function(e) {
  		var url = 'http://twitter.com/share?'
  		var name = $(this).attr('t_name');
  		var link = $(this).attr('link');
  		url = url+'via=fancy&url='+encodeURIComponent(link)+'&text='+encodeURIComponent(name);
    
  		window.open(url, '_blank', 'height=400,width=600,left=250,top=100,resizable=yes');

      e.preventDefault();
      return false;
    });


    $('.sns-button button.btn-g').click(function(e) {
      
      var name = $(this).attr('t_name');
      var link = $(this).attr('link');
      var url = 'https://plus.google.com/share?url='+encodeURIComponent(link);
    
      window.open(url, '_blank', 'height=400,width=600,left=250,top=100,resizable=yes');

      e.preventDefault();
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
