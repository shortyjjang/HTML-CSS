$(document).ready(function() {

    $('.edit .remove_new_thing').click(function(event){
        var thing_id = $(this).attr('thing_id').trim();
        var uid = $(this).attr('uid').trim();
        var ntid = $(this).attr('ntid').trim();
        if(window.confirm('Remove this from Fancy?')){
          var param = {};
          param['thing_id']=thing_id;
          param['uid']=uid;
          param['ntid']=ntid;
          $.post("/remove_new_thing.xml",param, 
            function(xml){
              if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                location.href=$(xml).find("url").text();
              }
              else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                var msg = $(xml).find("message").text();
                alert(msg);
              }
          }, "xml");
          
        }
        return false;
    });

    $('.edit .btn-cancel').live('click',function() {
        closePop();
    });
    
    $('.edit .btn-save').live('click',function() {
        var title = $('#fancy-title').val().trim();
        var link = $('#fancy-web-link').val().trim();
        var category = $('#fancy-category').eq(0).val();
        var thing_id = $(this).attr('tid');
        var uid = $(this).attr('uid');
        
        if(title.length <=0 ){
          alert("Please enter title.");
    	  return false;
        }
        var param = {};
        param['name']=title;
        param['link']=link;
        param['thing_id']=thing_id;
        param['uid']=uid;
        //param['img']=img;
        //param['img']=$('input.image_str').val();
        //param['img_mode']=$('input.image_mode').val();
        //param['img_w']=$('input.image_w').val();
        //param['img_h']=$('input.image_h').val();
        if(category !="-1" && category  != "-2")
          param['category']=category;

        var selectedRow = $(this);
        function update_callback(xml) {
            if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
              location.href = $(xml).find("thing_url").text();
            }
            else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
              alert($(xml).find("message").text());
            }  
            else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==2) {
              confirmed = confirm($(xml).find("message").text());
              if (confirmed) {
                  param['ignore_dup_link'] = true;
                  $.post("/update_new_thing.xml", param, update_callback, "xml");
              }
            }
        }
        $.post("/update_new_thing.xml",param, update_callback, "xml");
        
        return false;
    });

    $('.edit .btn-photo').live('click', function() {
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, false);
        document.getElementById('uploadphoto').dispatchEvent(evt);
    });

    $(".edit input:file").change(function(event){
        var selectedRow = $(this);
        var fileval = $(this).val();
        var thing_id =$(this).attr('tid');
        var uid = $(this).attr('uid');
        if (fileval.length>0){
        		$.ajaxFileUpload( { 
        			url:'/newthing_image.xml?thing_id='+thing_id+'&uid='+uid,
        			secureuri:false,
        			fileElementId:'uploadphoto',
        			dataType: 'xml',
        			success: function (data, status) 
        			{
        				if ($(data).find("status_code").length>0 && $(data).find("status_code").text()==1) {
        					//alert($(data).find("image_url").text());
        					location.reload(false);	    
        				}
        				else if ($(data).find("status_code").length>0 && $(data).find("status_code").text()==0) {
        					alert($(data).find("message").text());
        					return false;
        				}
        				else {
        					alert("Unable to upload file..");
        					return false;
        				}
        			},
        			error: function (data, status, e)
        			{
        				alert(e);
        				return false;
        			}
        		});
          $('#uploadphoto').attr('value', '');
        }
        return false;
    });   
  
});
