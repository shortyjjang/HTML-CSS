$(document).ready(function(){
  
  $('a.register').click(function(event){
    event.preventDefault();
    var frm = $(this).parents('form');

    var param = {};
    var is_valid = true;
    frm.find("input[name],textarea[name]").each(function(){
        var $this = $(this);
        var name = $this.attr('name');
        var value = $this.val().trim();
        if( $this.attr('require') && !value){
            alert("please enter "+name);
            $this.focus();
            is_valid=false;
            return false;
        }else{
            if( $this.is(":checkbox") )
                param[name] = this.checked;
            else 
                param[name] = value;
        }
    })
    if(!is_valid) return;

    var file_form = $('#uploadcover')[0],file,filename,extension,filelist;
    filelist = file_form.files || (file_form.value ? [{name:file_form.value}] : []);
    if(filelist && filelist.length) file = filelist[0];

    if(file && !/([^\\\/]+\.(jpe?g|png|gif))$/i.test(file.name||file.filename)){
        alert(gettext('The image must be in one of the following formats: .jpeg, .jpg, .gif or .png.'));
        return false;
    }

    filename  = RegExp.$1;
    extension = RegExp.$2;

    function create_coupon_popup(){
        $.post("/admin/register_coupon_popup.json",param, 
          function(json){
            if (json.status_code) {
              location.href="/admin/coupon-popup";
            }
            else{
                if(json.message) alert(json.message);
            }
        }, "json");
    }

    if(file){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(e){
            if(xhr.readyState !== 4) return;
            if(xhr.status === 200){
                // success
                var data = xhr.responseText, json;
                try {
                    if(window.JSON) json = window.JSON.parse(data);
                } catch(e){
                    try { json = new Function('return '+data)(); } catch(ee){ json = null };
                }

                create_coupon_popup();
            }
        };

        xhr.open('POST', '/upload_list_cover_image.json?max_width=1940&filename=' + filename, true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('X-Filename', encodeURIComponent(filename));
        xhr.send(file);
    }else{
        create_coupon_popup();
    }
    
    return false;
  });
  

  $('a.delete').click(function(event){
    event.preventDefault();
    var cpid = $(this).attr('cpid');
    if(!cpid) return;

    var selectedRow = $(this);	

    var param = {cpid:cpid};
	
    if (window.confirm('Are you sure you want to delete this coupon popup?')){
    	$.post("/admin/delete_coupon_popup.json",param,
            function(json){
        	    if (json.status_code) {
                  location.href="/admin/coupon-popup";
                }
                else{
                    if(json.message) alert(json.message);
                }
    	}, "json");
    }
    return false;
  });
  
  
  $('a.edit').click(function(event){
    event.preventDefault();
    var $this = $(this);    
    var cpid = $(this).attr('cpid');
    if(!cpid){
        return;  
    } 

    var param = {cpid:cpid};
    
    $.get("/admin/get_coupon_popup.json",param,
        function(json){
            if (json.status_code) {
                if(json.couponpopup){
                    var couponpopup = json.couponpopup;
                    couponpopup.date_from = $.datepicker.formatDate('mm/dd/yy',new Date(Date.parse(couponpopup.date_from)))
                    couponpopup.date_to = $.datepicker.formatDate('mm/dd/yy',new Date(Date.parse(couponpopup.date_to)))
                    couponpopup.check_is_active = couponpopup.is_active?'checked':''
                    var template = $('#coupon_update_template').template(couponpopup);
                    $('.update-coupon-popup').find('fieldset').html(template);                    
                    Fancy.datePicker();
                    $.dialog('update-coupon-popup').open();
                }
            }
            else{
                if(json.message) alert(json.message);
            }
    }, "json");
    return false;
  });

  $('.update-coupon-popup').delegate('a.update','click',function(event){
    event.preventDefault();
    var frm = $(this).parents('form');

    var param = {};
    var is_valid = true;
    frm.find("input[name],textarea[name]").each(function(){
        var $this = $(this);
        var name = $this.attr('name');
        var value = $this.val().trim();
        if( $this.attr('require') && !value){
            alert("please enter "+name);
            $this.focus();
            is_valid=false;
            return false;
        }else{
            
            if( $this.is(":checkbox") )
                param[name] = this.checked
            else 
                param[name] = value;
        }
    })
    if(!is_valid) return;
    

    var file_form = $('#updatecover')[0],file,filename,extension,filelist;
    filelist = file_form.files || (file_form.value ? [{name:file_form.value}] : []);
    if(filelist && filelist.length) file = filelist[0];

    if(file && !/([^\\\/]+\.(jpe?g|png|gif))$/i.test(file.name||file.filename)){
        alert(gettext('The image must be in one of the following formats: .jpeg, .jpg, .gif or .png.'));
        return false;
    }

    filename  = RegExp.$1;
    extension = RegExp.$2;

    function update_coupon_popup(){
        $.post("/admin/update_coupon_popup.json",param, 
          function(json){
            if (json.status_code) {
                location.reload(true);
            }
            else{
                if(json.message) alert(json.message);
            }
        }, "json");
    }

    if(file){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(e){
            if(xhr.readyState !== 4) return;
            if(xhr.status === 200){
                // success
                var data = xhr.responseText, json;
                try {
                    if(window.JSON) json = window.JSON.parse(data);
                } catch(e){
                    try { json = new Function('return '+data)(); } catch(ee){ json = null };
                }

                update_coupon_popup();
            }
        };

        xhr.open('POST', '/upload_list_cover_image.json?max_width=1940&filename=' + filename, true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('X-Filename', encodeURIComponent(filename));
        xhr.send(file);
    }else{
        update_coupon_popup();
    }

    
    return false;
  });


  $('.update-coupon-popup,.create-coupon-popup').delegate('a.check','click',function(event){
    event.preventDefault();
    var $this = $(this);    
    var code = $(this).prev().val();
    if(!code){
        alert('please enter coupon code');
        $(this).prev().focus();
        return;  
    } 

    var param = {code:code};
    
    $.get("/admin/check_coupon_code.json",param,
        function(json){
            if (json.status_code) {
                if(json.coupon){
                    var coupon = json.coupon;
                    var frm = $this.parents('form');
                    frm.find('[name=footer]').val(coupon.description);
                    var date_from = new Date(Date.parse(coupon.start_date));
                    var date_to = new Date(Date.parse(coupon.end_date));
                    frm.find('[name=date_from]').val( $.datepicker.formatDate('mm/dd/yy',date_from));
                    frm.find('[name=date_to]').val( $.datepicker.formatDate('mm/dd/yy',date_to));
                    var info = coupon.discount_amount?" discount Amount:$"+coupon.discount_amount:"";
                    info += coupon.discount_percentage?" discount %:"+(coupon.discount_percentage*100)+'%':"";
                    info += coupon.free_shipping?" free shipping":"";
                    frm.find('#couponinfo').html(info);
                    frm.find('.couponinfo').show();
                }
            }
            else{
                if(json.message) alert(json.message);
            }
    }, "json");

    return false;
  });


  $('.update-coupon-popup,.create-coupon-popup').delegate('a.delete_image','click',function(event){
    event.preventDefault();
    var frm = $(this).parents('form');
    frm.find('.image').hide();    
    frm.find('[name=delete_image]').val('true')
  });


  $('a.duplicate').click(function(event){
    event.preventDefault();
    var $this = $(this);    
    var cpid = $(this).attr('cpid');
    if(!cpid){
        return;  
    } 

    var param = {cpid:cpid};
    
    $.get("/admin/get_coupon_popup.json",param,
        function(json){
            if (json.status_code) {
                if(json.couponpopup){
                    var couponpopup = json.couponpopup;
                    couponpopup.date_from = $.datepicker.formatDate('mm/dd/yy',new Date(Date.parse(couponpopup.date_from)))
                    couponpopup.date_to = $.datepicker.formatDate('mm/dd/yy',new Date(Date.parse(couponpopup.date_to)))
                    couponpopup.check_is_active = couponpopup.is_active?'checked':''

                    for(var k in couponpopup){
                        var $el = $('.create-coupon-popup').find("[name="+k+"]");
                        if($el.is(":checkbox")){
                            if( couponpopup[k] ) $el[0].checked=true;
                        }else{
                            $el.val( couponpopup[k] );                         
                        }
                    }                    
                    $.dialog('create-coupon-popup').open();
                }
            }
            else{
                if(json.message) alert(json.message);
            }
    }, "json");
    return false;
  });

  
});
