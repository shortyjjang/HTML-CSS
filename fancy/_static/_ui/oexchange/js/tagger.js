var Tagger = {
	init : function(){
		if(document.addEventListener){
			photo_original_width = this.width;
			photo_original_height = this.height;
		}

		if($('div#getcode').length){
			$('div#getcode').remove();
		}
		if($('div#added_thing').length){
			$('div#added_thing').remove();
		}
		$("input#f-whatisit").focus(function(){
			$(this).select();
		});
		
		Tagger.add_thing();
		Tagger.enterWhatIsIt();
		Tagger.enterNoteForThing();
	},
	add_thing : function(){
		$('#fancyApple form button.btn-add-fancy').click(function(){
			Tagger.handleAddThing();
			return false;
		})
	},
	handleAddThing : function(){
        $('#fancyApple .btn-add-fancy').hide();
        $('#fancyApple .status-message').show();
        $('#fancyApple .apple-form *').attr('disabled', true);
		var param={};
        if($('input.user_key_info').length){
			var user_key = $('input.user_key_info').attr('user_key');
			param['user_key']=user_key;
		}
		var tag_url = $('input.bookmarklet_info').attr('client_url');
		param['tag_url']=tag_url;		
		param['photo_url']=$('#f-picked-image').attr('src');
		var name = $('#f-whatisit').val().trim_str();
		if(name.length<=0){
			alert('Please enter Title');
			return false;
		}
        param['name']=name;
		
        var note_str = $('#f-note-for-thing').val().trim_str();
		var note_val = '';
		if(note_str.length>0){
			param['note']=note_str;
			note_val = note_str;
		}
        var cat_str = $('#f-category-for-thing').val();
        if (cat_str != '-1' && cat_str != '-2'){
            param['category']=cat_str;          
        } 
        param['csrfmiddlewaretoken']=$('input[name=csrfmiddlewaretoken]').val();

		if (!is_add_thing){
			is_add_thing = true;
			var self = this;
			$.post("/add_new_sys_thing.xml", param, function(xml){
				is_add_thing=false;
                if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                    var userkey = $('input.user_key_info').attr('user_key');
                    var photo_url = $(xml).find("photo_url").text();
                    var thing_url = $(xml).find("thing_url").text();
                    var thing_id = $(xml).find("thing_id").text();
                    var user_id = $(xml).find("user_id").text();
                    var width = $(xml).find("width").text();
                    var height = $(xml).find("height").text();
                    var url = '/fancyd.html?userkey='+encodeURIComponent(userkey)+'&photo_url='+encodeURIComponent(photo_url)+'&thing_url='+encodeURIComponent(thing_url)+'&title='+encodeURIComponent(name)+'&tid='+encodeURIComponent(thing_id)+'&ooid='+encodeURIComponent(user_id)+'&width='+encodeURIComponent(width)+'&height='+encodeURIComponent(height);
                    try {
                        window.location.replace(url);
                    } catch (e1) {
                        window.location = url;
                    }		
				} else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
				    var message = $(xml).find("message").text();
				    if (message == 'Fancying not allowed from this site.'){
					    window.close();
				    } else {
					    alert(message);
				    }
                    $('#fancyApple .btn-add-fancy').show();
                    $('#fancyApple .status-message').hide();
                    $('#fancyApple .apple-form *').attr('disabled', false);
				}
		    }, "xml");
		}
	},
	enterWhatIsIt : function(){
		$("#fancyApple #f-whatisit").bind("keypress", function(e) {
			var c = e.which ? e.which : e.keyCode;
			if(c == 13){
				Tagger.handleAddThing();
				return false;
			}
		});
	},
	enterNoteForThing : function(){
		$("#fancyApple #f-note-for-thing").bind("keypress", function(e) {
			var c = e.which ? e.which : e.keyCode;
			if(c == 13){
				Tagger.handleAddThing();
				return false;
			}
		});
	},
}
var is_add_thing = false;
var photo_original_width = 0;
var photo_original_height = 0;
var tag_frame_width=0;
var tag_frame_height=0;
String.prototype.escape_html = function() {
  return this.replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;");
};
String.prototype.trim_str = function() {
  return this.replace(/^\s+|\s+$/g,"");
};
