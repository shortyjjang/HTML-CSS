
var TagDisplay = {

	init : function(){
		var selectObj = $('.tag-photo');
		var photo_ids = ''
		var w = selectObj.find('img').width();
		var h = selectObj.find('img').height();
		selectObj.css({width: w, height: h});
		
		selectObj.each(function(){
			//alert($(this).find('img').attr('pid'));
			if (photo_ids.length>0){
				photo_ids = photo_ids + ' '+$(this).find('img').attr('pid');
			}
			else{
				photo_ids = $(this).find('img').attr('pid');
			}
		});
				
		//var photo_id = selectObj.find('img').attr('pid');
		TagDisplay.load('/get_photo_tags.json',photo_ids);
		//TagDisplay.cancel();
	},	
	load : function(load_url,photo_ids){
			// Load the tag records.
			$.ajax({
				method: "get",
				url: load_url,
				data: {
					photo_ids: photo_ids,
					'all':true
					},
				dataType: "json",
				cache: false,
				success: function( response ){
					$.each(
						response,
						function( index, tagData ){
							TagDisplay.addTag(tagData.id,tagData.user_id,tagData.photo_id,tagData.xcoord,tagData.ycoord,tagData.photo_width,tagData.photo_height,tagData.name,tagData.thing_id,tagData.status,tagData.tag_url);
							//alert(tagData.xcoord)
						}
					);
					//TagDisplay.addTipEvent( $('.tag-photo'));
					TagDisplay.addAutoSearchEvent($('.tag-photo'));
					//TaggerPhoto.init();
					TagDisplay.tagPhoto($('.tag-photo'));

				},
				error: function(){
				}
			});			
	},

	tagPhoto : function(obj){
		TagDisplay.addTagEvent(obj);
	},
	
	addTagEvent : function(obj){
		obj.bind('mouseover', function(e){
			$(this).bind('click', function(e){
				TagDisplay.addTagClickEvent(obj, e);
				$('body').unbind('click');
			});
		});
		
		obj.bind('mouseout', function(e){
			$(this).unbind('click');
			$('body').bind('click', function(){
				TagDisplay.hideTip(obj);
			})
		});
	},
	
	addTagClickEvent : function(obj, e){
		// calulate coordinate
		var offset = obj.offset();
		TagDisplay.hideTip(obj);
		//var str_tip = '<div class="tip"><div class="head"><h4>Tag</h4><span class="btn-del">Delete</span></div><div class="body"><label class="hide">what is it?</label><input type="text" value="what is it?" class="txt" /><label class="hide">optional: URL where it can be found or purchased</label><input type="text" value="optional: URL where it can be found or purchased" class="txt" /></div><span class="b"></span></div>';
		//var one = $('<div class="point focus" style="left:'+ (e.pageX - offset.left - 10) +'px; top: '+ (e.pageY - offset.top - 10) +'px">'+ str_tip +'</div>');
		var str_tip = '<div class="tip more"><div class="body"><label class="hide name">what is it?</label><input type="text" value="what is it?" class="txt name"/><label class="hide tag_url">optional: URL where it can be found or purchased</label><input type="text" value="optional: URL where it can be found or purchased" class="txt tag_url" /><label class="hide">Search Things</label><input type="text" value="Search Things" class="txt auto-search-things" /></div><div class="actions"><span class="btn-add">Add</span><label class="thing-id">thing-id:<input value="" type="text" class="txt-thing-id"/></label><span class="btn-cancel">Delete</span></div><span class="b"></span></div>';
		var one = $('<div class="point" style="left:'+ (e.pageX - offset.left - 10) +'px; top: '+ (e.pageY - offset.top - 10) +'px"><span class="dot"></span>'+ str_tip +'</div>');

		//var str_tip = '<div class="tip"><div class="body"><label class="hide">what is it?</label><input type="text" value="what is it?" class="txt" /><label class="hide">optional: URL where it can be found or purchased</label><input type="text" value="optional: URL where it can be found or purchased" class="txt" /></div><div class="actions"><span class="btn-save">Save</span><span class="btn-del">Delete</span></div><span class="b"></span></div>';
		//var one = $('<div class="point focus" style="left:'+ (e.pageX - offset.left - 10) +'px; top: '+ (e.pageY - offset.top - 10) +'px"><span class="dot"></span>'+ str_tip +'</div>');

		obj.append(one);
		obj.find('.point').css('zIndex', '1');
		one.addClass('focus').css('zIndex', '999');
		one.find('input').eq(0).focus().select();
		TagDisplay.accessibleInputValues(one.find('input').eq(0));
		TagDisplay.accessibleInputValues(one.find('input').eq(1));
		TagDisplay.enterKeyOptional(one.find('input').eq(1), obj);
		TagDisplay.enterTipsyInputKey(one.find('input').eq(0));
		TagDisplay.enterTipsyInputKey(one.find('input').eq(1));
		
		TagDisplay.accessibleInputValues(one.find('input.auto-search-things'));		
		TagDisplay.addDraggable(one);
		TagDisplay.addTipEvent(obj,one);
		TagDisplay.addAutoSearchEvent(one);
		
	},

	addTag : function(ptid,user_id,photo_id,x,y,photo_width,photo_height,name,thing_id,status,tag_url){
		// calulate coordinate
		var obj = $('.tag-photo.'+photo_id)
		TagDisplay.hideTip(obj);
		var w = obj.find('img').width();
		var h = obj.find('img').height();
		var x_ratio = w/photo_width;
		var y_ratio = h/photo_height;
		var labelAssign = 'Assign';
		var txt_thing_id = '';
			var head_text = "Tag";
		if (status!=2){
			if (thing_id != null){
				labelAssign="Reassign"
				txt_thing_id = thing_id;
			}
		}
		if (status==2){
			head_text="Rejected"
			txt_thing_id = "Rejected";
		}
		var txt_tag_url='';
		var val_tag_url='';
		if (typeof(tag_url) != undefined && tag_url != null){
			txt_tag_url='<a href="'+tag_url.escape_html()+'"+ target="new" style="color:white;margin-top:6px;margin-left:5px;">link</a>';
			val_tag_url = tag_url.escape_html();
		}

		//var str_tip = '<div class="tip"><div class="head"><h4>'+head_text+'</h4><span class="thing-id">thing-id:<input value="'+txt_thing_id+'" type="text" class="txt-thing-id"/></span><span class="btn-assign" uid="'+user_id+'" ptid="'+ptid+'" photo_id="'+photo_id+'">'+labelAssign+'</span><span class="btn-reject" uid="'+user_id+'" ptid="'+ptid+'" photo_id="'+photo_id+'">Reject</span></div><div class="body"><label class="hide">what is it</label><input type="text" value="'+name+'" class="txt" readonly/><label class="hide">Search Things</label><input type="text" value="Search Things" class="txt auto-search-things" /></div><span class="b"></span></div>';
		//var one = $('<div class="point" style="left:'+ (x*x_ratio) +'px; top: '+ (y*y_ratio) +'px"><span class="dot"></span>'+ str_tip +'</div>');
		var str_tip = '<div class="tip more"><div class="body"><label class="hide name">'+name.escape_html()+'</label><input type="text" value="'+name.escape_html()+'" class="txt name"/><label class="hide tag_url">'+val_tag_url+'</label><input type="text" value="'+val_tag_url+'" class="txt tag_url" /><label class="hide">Search Things</label><input type="text" value="Search Things" class="txt auto-search-things" /></div><div class="actions"><span class="btn-assign" uid="'+user_id+'" ptid="'+ptid+'" photo_id="'+photo_id+'" photo_width="'+photo_width+'" photo_height="'+photo_height+'">'+labelAssign+'</span><label class="thing-id">thing-id:<input value="'+txt_thing_id+'" type="text" class="txt-thing-id"/></label>'+txt_tag_url+'<span class="btn-remove" uid="'+user_id+'" ptid="'+ptid+'" photo_id="'+photo_id+'">Delete</span><span class="btn-reject" uid="'+user_id+'" ptid="'+ptid+'" photo_id="'+photo_id+'">Reject</span></div><span class="b"></span></div>';
		var one = $('<div class="point" style="left:'+ (x*x_ratio) +'px; top: '+ (y*y_ratio) +'px"><span class="dot"></span>'+ str_tip +'</div>');

		obj.append(one);
		obj.find('.point').css('zIndex', '1');
		//one.addClass('focus').css('zIndex', '999');
		//TagDisplay.accessibleInputValues(one.find('input').eq(0));
		TagDisplay.accessibleInputValues(one.find('input.auto-search-things'));
		TagDisplay.addDraggable(one);
		TagDisplay.addTipEvent(obj,one);
	},

	addAutoSearchEvent: function(obj){
		obj.find(".auto-search-things").autocomplete('/autofill_thing.cr', { minChars:3,matchSubset:0,matchContains:0,autofill:true,formatItem:function formatItem(row) {return '<span class="thumb_container"><img src="'+row[2]+'"/></span><span class="text"><a href="">'+row[1]+' (id: '+row[0]+')</a></span>';}}).result(function(event, item) {
			$(this).parents('.point').find('input.txt-thing-id').val(item[0]);
			$(this).val(item[1]);
			$(this).attr('tid',item[0])
			$(this).attr('thing_name',item[1])
			$(this).attr('thing_url',item[3])
		});
		
	},
	
	hideTip : function(obj){
		obj.find('.point').removeClass('focus');
	},

	accessibleInputValues: function(e) {
		
      labeltxt = $(e).prev('label').html();
      if ($(e).val() == '') $(e).val(labeltxt);
      $(e)
        .focusin(function() {
        	
          labeltxt = $(this).prev('label').html();
          if ($(this).val() == labeltxt) $(this).val('');
        }).focusout(function() {
          labeltxt = $(this).prev('label').html();
          if ($(this).val() == '') $(this).val(labeltxt);
        });
    },
	addDraggable : function(obj){
		obj.draggable({ containment: '#content div.tag-photo', scroll: false, cursor: 'move' });
	},

	addTipEvent : function(obj,point){
		//click event
		point.find('.dot').click(function(){
			TagDisplay.hideTip(obj);
			point.css('zIndex', '1');
			$(this).parent().addClass('focus').css('zIndex', '999');
			//Tagger.focusInput($(this));
		})
		//hover event
		point.hover(function(){
			$('body').unbind('click');
			obj.unbind('mouseover');
			obj.unbind('mouseout');
		}, function(){
			TagDisplay.addTagEvent(obj);
			//$(this).unbind('click');
			//$('body').bind('click', function(){
			//	TagDisplay.hideTip(obj);
			//})

		});

		//close event
		point.find('.btn-cancel').click(function(){
			$(this).parent().parent().parent().remove();
			TagDisplay.addTagEvent(obj);			
		});
		
		//close event
		point.find('.btn-assign').click(function(){
			//TagDisplay.hideTip(obj);
			var uid=$(this).attr('uid');
			var photo_id=$(this).attr('photo_id');
			var photo_height=$(this).attr('photo_height');
			var photo_width=$(this).attr('photo_width');
			var ptid=$(this).attr('ptid');
			var thing_id=$(this).parents('.point').find('input.txt-thing-id').val().trim();
			var new_name=$(this).parents('.point').find('input.name').val().trim();
			var ori_name=$(this).parents('.point').find('label.name').text().trim();
			var new_tag_url=$(this).parents('.point').find('input.tag_url').val().trim();
			var ori_tag_url=$(this).parents('.point').find('label.tag_url').text().trim();
			//alert(new_name+" "+ori_name+" "+new_tag_url+" "+ori_tag_url+" "+thing_id);
			//alert(new_name+" "+ori_name+" "+thing_id);
			//alert(new_tag_url+" "+ori_tag_url+" "+thing_id);
			if(thing_id.length<=0 || thing_id=='Rejected'){
				alert('please assign thing-id');
				return false;
			}
			var param={};
			param['ptid']=ptid;
			param['thing_id']=thing_id;
			param['uid']=uid;
			param['photo_id']=photo_id;
			if (new_name != ori_name && new_name.length>0){
				param['name']=new_name;				
			}
			else if (new_name.length<=0){
				alert('Name cannot be empty');
				return false;				
			}
			if (new_tag_url != ori_tag_url){
				param['tag_url']=new_tag_url;				
			}

			//var t = new Image();
			//t.src = obj.find('img').attr('src');
			//var rel_img_width = t.width;
			//var rel_img_height = t.height;
			var img_width = obj.find('img').width();
			var img_height = obj.find('img').height();
			var x_ratio = photo_width/img_width;
			var y_ratio = photo_height/img_height;
			var x =parseInt(point.css('left').replace('px').trim()) * x_ratio;
			var y =parseInt(point.css('top').replace('px').trim()) * y_ratio;
			param['xcoord']=parseInt(x);
			param['ycoord']=parseInt(y);

			var selectedRow = $(this);
			$.post("/approve_photo_tag.xml",param, 
			  function(xml){
				if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
					alert('assigned');
					selectedRow.parents('.head').find('h4').text("Tag");
					selectedRow.parent().parent().parent().removeClass('focus');
					selectedRow.text('Reassign');
				}
				else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
				  alert($(xml).find("message").text());
				}
			}, "xml");
		});
		//close event
		point.find('.btn-add').click(function(){
			//TagDisplay.hideTip(obj);
			var uid=obj.find('img').attr('uid');
			var photo_id=obj.find('img').attr('pid');
			var thing_id=$(this).parents('.point').find('input.txt-thing-id').val().trim();
			var new_name=$(this).parents('.point').find('input.name').val().trim();
			var ori_name=$(this).parents('.point').find('label.name').text().trim();
			var new_tag_url=$(this).parents('.point').find('input.tag_url').val().trim();
			var ori_tag_url=$(this).parents('.point').find('label.tag_url').text().trim();
			//alert(new_name+" "+ori_name+" "+new_tag_url+" "+ori_tag_url+" "+thing_id);
			if(thing_id.length<=0 || thing_id=='Rejected'){
				alert('please assign thing-id');
				return false;
			}
			var param={};
			param['thing_id']=thing_id;
			param['uid']=uid;
			param['photo_id']=photo_id;
			if (new_name != ori_name && new_name.length>0){
				param['name']=new_name;				
			}
			else{
				alert('Name cannot be empty');
				return false;				
			}
			if (new_tag_url != ori_tag_url){
				param['tag_url']=new_tag_url;				
			}

			var t = new Image();
			t.src = obj.find('img').attr('src');
			var rel_img_width = t.width;
			var rel_img_height = t.height;
			var img_width = obj.find('img').width();
			var img_height = obj.find('img').height();
			var x_ratio = rel_img_width/img_width;
			var y_ratio = rel_img_height/img_height;
			var x =parseInt(point.css('left').replace('px').trim()) * x_ratio;
			var y =parseInt(point.css('top').replace('px').trim()) * y_ratio;
			param['xcoord']=parseInt(x);
			param['ycoord']=parseInt(y);
			param['photo_width']=t.width;
			param['photo_height']=t.height;
			var width = point.width();
			var height = point.height();
			param['width']=parseInt(width);
			param['height']=parseInt(height);
			param['photo_url']=obj.find('img').attr('src');

			var selectedRow = $(this);
			$.post("/add_photo_tag.xml",param, 
			  function(xml){
				if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
					alert('added');
					location.reload(false);
				}
				else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
				  alert($(xml).find("message").text());
				}
			}, "xml");
		});

		point.find('.btn-reject').click(function(){
			var uid=$(this).attr('uid');
			var photo_id=$(this).attr('photo_id');
			var ptid=$(this).attr('ptid');
			var param={};
			param['ptid']=ptid;
			param['uid']=uid;
			param['photo_id']=photo_id;
			var selectedRow = $(this);
			$.post("/reject_photo_tag.xml",param, 
			  function(xml){
				if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
					alert('rejected');
					selectedRow.parents('.head').find('h4').text("");
					selectedRow.parents('.point').find('input.txt-thing-id').val("Rejected");
					selectedRow.parent().parent().parent().removeClass('focus');
					//selectedRow.text('Reassign');
				}
				else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
				  alert($(xml).find("message").text());
				}
			}, "xml");
		});
		point.find('.btn-remove').click(function(){
			var uid=$(this).attr('uid');
			var photo_id=$(this).attr('photo_id');
			var ptid=$(this).attr('ptid');
			var param={};
			param['ptid']=ptid;
			param['uid']=uid;
			param['photo_id']=photo_id;
			var selectedRow = $(this);
			if (window.confirm('sure to delete it? Warning: This photo page will be deleted if there is no tag left.')){
				$.post("/remove_photo_tag.xml",param, 
				  function(xml){
					if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
						alert('deleted');
						selectedRow.parent().parent().parent().remove();
					}
					else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
					  alert($(xml).find("message").text());
					}
				}, "xml");
			}			

		});
		
	},
	enterTipsyInputKey : function(obj){
		obj.bind('keypress', function(e) {
        if(e.keyCode==13){
        	obj.parent().parent().parent().removeClass('focus');
           return false;
        }
		});
	},

	enterKeyOptional : function(obj_optional, obj){
		obj_optional.bind('keypress', function(e) {
			if(e.keyCode==9){
				TagDisplay.hideTip(obj);
				return false;
			}
		});
	}
	
	
}

$(window).load(function(){
	TagDisplay.init();	
});

$(document).ready(function(){
  $('.show_on_homepage button').live('click',function(event){
    var show_on_homepage = $('#select_show_on_homepage').val();
	var photo_id = $(this).attr('photo_id');
	var param = {};
	param['show_on_homepage']=show_on_homepage;
	param['photo_id']=photo_id;
	$.post("/set_show_on_homepage.xml",param, 
	  function(xml){
		if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
			alert('done');
		}
		else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
		  var msg = $(xml).find("message").text();
		  alert(msg);
		}
	}, "xml");
    return false;
	
	
  });
  
	$('.date_published button').live('click',function(event){
	      var date_published = $('#time_date_published').val();
	      var photo_id = $(this).attr('photo_id');
	      var param = {};
	      param['date_published']=date_published;
	      param['photo_id']=photo_id;
	      
	      $.post("/set_date_published.xml",param, 
		function(xml){
		      if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
			      alert('Date published set');
		      }
		      else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
			if ($(xml).find("message").text() == "Please use YYYY-MM-DD HH:MM:SS format."){
			  var msg = $(xml).find("message").text();
			  alert(msg);
			  location.reload(true);
			}
			else{
			  var msg = $(xml).find("message").text();
			  alert(msg);
			}
		      }
	      }, "xml");
	      return false;
	});

});