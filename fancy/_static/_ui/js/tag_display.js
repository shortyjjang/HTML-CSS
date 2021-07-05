var TagDisplay = {

	display : function(selectStr){
		//var selectObj = $('.tag-photo');
		var selectObj = $(selectStr);
		var photo_ids = ''
		selectObj.each(function(){
			//if (photo_ids.length>0){
			//	photo_ids = photo_ids + ' '+$(this).find('img').attr('pid');
			//}
			//else{
			//	photo_ids = $(this).find('img').attr('pid')			
			//}
			var pid = $(this).find('img').attr('pid');
			$(this).find('img').load(function(){
				TagDisplay.load(selectStr,'/get_photo_tags.json',pid);	
			});
		});
		//TagDisplay.load(selectStr,'/get_photo_tags.json',photo_ids);
	},

	init : function(){
		var selectStr = '.tag-photo'
		//var selectObj = $('.tag-photo');
		var selectObj = $(selectStr);
		var photo_ids = ''
		selectObj.each(function(){
			//alert($(this).find('img').attr('pid'));
			if (photo_ids.length>0){
				photo_ids = photo_ids + ' '+$(this).find('img').attr('pid');
			}
			else{
				photo_ids = $(this).find('img').attr('pid')			
			}			
		});
				
		//var photo_id = selectObj.find('img').attr('pid');
		TagDisplay.load(selectStr,'/get_photo_tags.json',photo_ids);
		//TagDisplay.cancel();
		//TagDisplay.tagPhoto();
	},
	
	load : function(selectStr,load_url,photo_ids){
			// Load the tag records.
			$.ajax({
				method: "get",
				url: load_url,
				data: {
					photo_ids: photo_ids
					},
				dataType: "json",
				cache: false,
				success: function( response ){
					$.each(
						response,
						function( index, tagData ){
							TagDisplay.addTag(selectStr,tagData.photo_id,tagData.xcoord,tagData.ycoord,tagData.photo_width,tagData.photo_height,tagData.name,tagData.tag_url,tagData.thing_url);
							//alert(tagData.xcoord)
						}

					
					);
					
					var selectObj = $(selectStr);
					//var selectObj = $('.tag-photo');
					selectObj.each(function(){
						var photo_id = $(this).find('>img').attr('pid');
						var obj = $(this);//$('.tag-photo.'+photo_id)
						var src = obj.find('>img').attr('src');
						var t = new Image();
						t.src = src;
						var rel_img_width = t.width;
						var rel_img_height = t.height;
						//alert(src+" "+rel_img_width+" "+rel_img_height);
						var w = obj.find('>img').width();
						var h = obj.find('>img').height();
						var max_w = $(this).find('>img').css('max-width');
						var make_center = obj.attr('mc');
						//if(max_w != undefined && max_w != null){
						//	max_w = max_w.replace('px','').trim();
						//	if(max_w > w){
						//		var m_l = (max_w - w)/2;
						//		obj.css({"margin-left":m_l});
						//	}
						//}
						if ($('body.tagger-photo-js.thing-page').length && typeof(max_w) != undefined && max_w != null && max_w != false){
							max_w = max_w.replace('px','').trim();
							var ml = (max_w - w)/2;
							if (ml>0){
								obj.css({"width":w,"height":h,"margin-left":ml});
								obj.attr('style', 'width:'+w+'px;height:'+h+'px;margin-left: '+ml+'px !important;');
							}
							else{
								obj.css({"width":w,"height":h});															
							}
						}
						else if(typeof(make_center) != undefined && make_center != false && make_center != null && typeof(max_w) != undefined && max_w != null && max_w != false){
							max_w = max_w.replace('px','').trim();
							//if (max_w <=300){
								var ml = (max_w - w)/2;
								if (ml>0){
									obj.css({"width":w,"height":h,"margin-left":ml});
								}
								//else{
								//	obj.css({"width":w,"height":h});															
								//}
							//}
							//else{
							//		obj.css({"width":w,"height":h});																							
							//}
						}
						else{
							obj.css({"width":w,"height":h});							
						}
						//alert(photo_id+" "+w+" "+h);
						//if ( document.body.style.opacity !== undefined ) {
							TagDisplay.hoverPhoto(obj);
						//} else {
						//	TagDisplay.hoverPhotoNoOpacity(obj);
						//}
						TagDisplay.hoverTags(obj);
						var photo_url = $(this).find('>img').attr('url');
						if(photo_url != undefined && photo_url!= null && photo_url.length>0){								
							$(this).find('>img').click(function(){location.href=photo_url;});
						}

					});
				},
				error: function(){
				}
			});			
	},

	addTag : function(selectStr,photo_id,x,y,photo_width,photo_height,name,tag_url,thing_url){
		// calulate coordinate
		var obj = $(selectStr+'.'+photo_id);
		//var obj = $('.tag-photo.'+photo_id);
		var w = obj.find('>img').width();
		var h = obj.find('>img').height();
		//alert(photo_id+" "+w+" "+h);
		//obj.css({"width":w,"height":h});
		var x_ratio = w/photo_width;
		var y_ratio = h/photo_height;
		var href_str = '';
		if (typeof(tag_url) != undefined && tag_url != null){
			//var regexp = /(ftp|http|https):\/\/[A-Za-z0-9\.-]{3,}\.[A-Za-z]{3}/
			//if (!regexp.test(tag_url)) {
			//	regexp = /[A-Za-z0-9\.-]{3,}\.[A-Za-z]{3}/
			//	if (regexp.test(tag_url)) {
			//		tag_url = "http://"+tag_url;
			//	}
			//}			
			//href_str = 'href="'+tag_url.escape_html()+'"';
		}
		if (typeof(thing_url) != undefined && thing_url != null){
			href_str = 'href="'+thing_url.escape_html()+'"';
		}
		var str_tip = '<a '+href_str+' class="tag" style="left:'+ (x*x_ratio) +'px; top: '+ (y*y_ratio) +'px"></a><div class="tip"><p>'+name.escape_html()+'</p><span class="b"></span></div>';
		//var str_tip = '<a '+href_str+' class="tag" style="left:'+ (x*x_ratio) +'px; top: '+ (y*y_ratio) +'px" original-title="'+name.escape_html()+'"></a>';
		obj.append('<div class="tag-item">'+ str_tip +'</div>');
		//alert(obj.find('div.tag-item').width()+" "+obj.find('div.tag-item').height());
		//var mh=obj.find('div.tag-item').height();
		//obj.find('div.tag-item').css({"top":((y*y_ratio)-mh),"left":(x*x_ratio)-20});
		//TagDisplay.hoverPhoto(obj);
		//TagDisplay.hoverTags(obj);
	},

	hoverPhoto : function(obj){
		obj.hover(function(){
				obj.find('.tag-item').css({opacity:1}).animate({opacity: 'show'}, 200, function(){
					obj.find('.tag-item').each(function(){
						$(this).children('.tip').css({
							top: parseInt($(this).children('.tag').css('top')) - $(this).children('.tip').height() - 20,
							left: parseInt($(this).children('.tag').css('left')) - 12
						})
			})
				});
		}, function(){
		
			obj.find('.tag-item').animate({opacity: 'hide'}, 200)
		});
		/*
		obj.hover(function(e) {
		  $(this).css({ 'cursor': 'pointer' });
		  obj.find('.tag-item').show().animate({ opacity: 1 }, 200, function() {
			obj.find('.tag-item').each(function(){
			  $(this).children('.tip').css({
				top: parseInt($(this).children('.tag').css('top')) - $(this).children('.tip').height() - 20,
				left: parseInt($(this).children('.tag').css('left')) - 12
			  })
		  })
		});
		}, function(e){
		  if ( /tipsy/.test(e.relatedTarget.className) ) {
			return false;
		  }
		  $(this).css({ 'cursor': 'auto' });
		  obj.find('.tag-item').animate({ opacity: 0 }, 200, function() {
			$(this).hide();
		  })
		});
		*/
	},
	/*
	hoverPhotoNoOpacity: function(obj){
	  obj.hover(function(e) {
		$(this).css({ 'cursor': 'pointer' });
		obj.find('.tag-item').show().is(':hidden').animate({ opacity: 'show' }, 200, function() {
		  obj.find('.tag-item').each(function() {
			$(this).children('.tip').css({
			  top: parseInt($(this).children('.tag').css('top')) - $(this).children('.tip').height() - 20,
			  left: parseInt($(this).children('.tag').css('left')) - 12
			})
		})
	  });
	  }, function(e){
		if ( /tipsy/.test(e.relatedTarget.className) ) {
		  return false;
		}
  
		$(this).css({ 'cursor': 'auto' });
		obj.find('.tag-item').hide()
	  });
	},
	*/
	hoverTags : function(obj){
		obj.find('.tag').hover(function(){
			var s_obj = $(this);
			setTimeout(function(){s_obj.addClass('tag-hover');s_obj.parent().addClass("hover");s_obj.next(".tip").addClass("tiphover");},100);
			//$(this).addClass('tag-hover');
			//$(this).parent().addClass("hover");
			//$(this).next(".tip").addClass("tiphover");
		}, function(){
			var s_obj = $(this);
			setTimeout(function(){TagDisplay.hoverPhoto(obj);s_obj.removeClass('tag-hover');s_obj.parent().removeClass("hover");s_obj.next(".tip").removeClass("tiphover");},100);
			//TagDisplay.hoverPhoto(obj);
			//$(this).removeClass('tag-hover');
			//$(this).parent().removeClass("hover");
			//$(this).next(".tip").removeClass("tiphover");
		});
		
		/*
		obj.find('.tag').tipsy({
		  gravity: $.fn.tipsy.autoNS,
		  delayIn: 100,
		  delayOut: 100
		}).hover(function() {
		  $(this).addClass('tag-hover');
		}, function() {
		  $(this).removeClass('tag-hover');
		});
		*/
	}	

	
}
$(window).load(function(){
	TagDisplay.init();	
});
$(document).ready(function(){
});

