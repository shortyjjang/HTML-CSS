$(document).ready(function(){

  $(document).on("click", '.remove_new_thing', function() {
    var thing_id = $(this).attr('thing_id').trim();
    var uid = $(this).attr('uid').trim();
    var ntid = $(this).attr('ntid').trim();
    alertify.confirm("Remove this from Fancy?", function (e) {
      if(e){
	  var param = {};
	  param['thing_id']=thing_id;
	  param['uid']=uid;
	  param['ntid']=ntid;
	  $.post("/remove_new_thing.xml",param, 
		function(xml){
		  if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
		  	$.jStorage.flush();
			location.href=$(xml).find("url").text();
		  }
		  else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
			var msg = $(xml).find("message").text();
			alert(msg);
		  }
	  }, "xml");
      }
	  
	})
    return false;
  });

  $(document).on("click", '.comment-content div.actions a.edit-note', function() {
	alert("boing!");
	var obj = $('.comment-content');
	var obj_button = obj.children('button.action-btn');	
	var obj_note = obj.find('p.note');
	var val = obj_note.html();
	obj_note.hide();
	obj_button.show();
	obj.find('input.note-text').css('color', '#000').val(val).show();
	return false;
	  
  });

  $(document).on("click", '.comment-content button.action-btn:first', function() {
	var obj_input = $(this).parent().find('input.note-text');

	var ntid = $(this).attr('ntid');
	var uid = $(this).attr('uid');
	var note = obj_input.val().trim();
	
	var param = {};
	param['ntid']=ntid;
	param['note']=note;
	param['uid']=uid;
	
	var selectedRow = $(this);
	
	$.post("/edit_note.xml",param, 
	  function(xml){
		if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
		  selectedRow.parent().children('button').hide();
		  obj_input.hide();
		  selectedRow.parent().children('p').html(note).show()
		}
		else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
		  alert($(xml).find("message"));
		}  
	}, "xml");
	return false;
  });
  
  //cancel
  $(document).on("click", '.comment-content button.action-btn:last', function() {
	  var obj_input = $(this).parent().find('input.note-text');
	  $(this).parent().children('button').hide();
	  obj_input.hide();
	  $(this).parent().children('p').show()
	  return false;
  });


});
