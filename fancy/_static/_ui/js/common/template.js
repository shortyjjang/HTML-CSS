// template
jQuery.fn.template = function(args) {
	if(!args) args = {};
	var html = jQuery.trim(this.html()).replace(/##(\w+)##/g, function(whole,name){
		return args[name] || '';
	});

	return jQuery(html);
};