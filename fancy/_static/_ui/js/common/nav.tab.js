// support tap interface
(function($){
	var $links = $('a.mn-browse,a.mn-you,a.mn-help,a.mn-gifts');
    $links
        .on('focus', function(){
        	if($(this).closest("li.gnb").hasClass("active")) return;
            this.parentNode.className = 'gnb hover';
        })
        .on('blur', function(){
            if($(this).closest("li.gnb").hasClass("active")) return;
            this.parentNode.className = 'gnb';
        })
        .on('touchstart', function(){
            if(this.parentNode.className == 'gnb hover'){
                return true;
            }else{
                this.focus();
                return false;
            }
        });
})(jQuery);