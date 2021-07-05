$(document).ready(function(){
  
  $(".popup.create-app-banner").find(".select-date input").datepicker();

  $('a.btn-add').click(function(event) {
    event.preventDefault();
    var $layer = $('.create-app-banner');
    $layer
        .find('.extra_info').hide().end()
        .find('.extra_info.all').show().end()
        .find('form')[0].reset();

    $.dialog('create-app-banner').open();
    return false;
  });

  $('a.register').click(function(event){
    event.preventDefault();
    var frm = $(this).parents('form');

    var param = {};
    var is_valid = true;
    frm.find("select[name]:visible,input[name]:visible,textarea[name]:visible").each(function(){
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
    param.action_url = param.action_url_full;
    var extra_info = {}
    for( k in param){
        if( k.startsWith('extra_info') ){
            var v = param[k];
            k = k.replace('extra_info_','');
            extra_info[k] = v;
        }
    }
    param.extra_info = JSON.stringify(extra_info);

    function create_app_banner(){
        $.post("/admin/register_app_banner.json",param, 
          function(json){
            if (json.status_code) {
              location.href="/admin/info-banners";
            }
            else{
                if(json.message) alert(json.message);
            }
        }, "json");
    }
    create_app_banner();
    
    return false;
  });
  

  $('a.delete').click(function(event){
    event.preventDefault();
    var abid = $(this).attr('abid');
    if(!abid) return;

    var param = {abid:abid};
	
    if (window.confirm('Are you sure you want to delete this app banner?')){
    	$.post("/admin/delete_app_banner.json",param,
            function(json){
        	    if (json.status_code) {
                  location.reload();
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
    var abid = $(this).attr('abid');
    if(!abid){
        return;  
    } 

    var param = {abid:abid};
    
    $.get("/admin/get_app_banner.json",param,
        function(json){
            if (json.status_code) {
                if(json.appbanner){
                    var appbanner = json.appbanner;
                    appbanner.start_date = $.datepicker.formatDate('mm/dd/yy',new Date(Date.parse(appbanner.start_date.split(" ")[0])))
                    appbanner.end_date = $.datepicker.formatDate('mm/dd/yy',new Date(Date.parse(appbanner.end_date.split(" ")[0])))
                    var template = $('#appbanner_update_template').template(appbanner);
                    var $updateLayer = $('.update-app-banner');
                    $updateLayer.find('fieldset').html(template);
                    $updateLayer.find('.extra_info').hide().end().find('.extra_info.all, .extra_info.'+appbanner.type).show();
                    $updateLayer.find('[name=type]').val( appbanner.type);
                    $updateLayer.find('[name=action_url_pre] option').each(function(){
                        var pattern = this.value.replace(/\{[^\}]+\}/g,'(.+)');
                        var regex = new RegExp("^"+pattern+"$");
                        var match = appbanner.action_url.match(regex);
                        if( match ){
                            $(this).parent().val(this.value).change();
                            if(match[1]){
                                $updateLayer.find('[name=action_url_detail]').val( match[1] ).change();
                                $updateLayer.find('[name=action_url_selectdetail]').val( match[1] ).change();
                            }
                            if(match[2]) $updateLayer.find('[name=action_url_detail2]').val( match[2] ).change();
                        }
                    })
                    if(appbanner.action_url) $updateLayer.find('[name=action_url_full]').val(appbanner.action_url)
                    try{
                        var extra_info = JSON.parse(appbanner.extra_info);
                        for(var k in extra_info){
                            $updateLayer.find("[name=extra_info_"+k+"]").val( extra_info[k] );
                        }
                    }catch(e){}
                    $(".popup.update-app-banner").find(".select-date input").datepicker();
                    $.dialog('update-app-banner').open();
                }
            }
            else{
                if(json.message) alert(json.message);
            }
    }, "json");
    return false;
  });

  $('.update-app-banner').delegate('a.update','click',function(event){
    event.preventDefault();
    var frm = $(this).parents('form');

    var param = {};
    var is_valid = true;
    frm.find("[name=abid],select[name]:visible,input[name]:visible,textarea[name]:visible").each(function(){
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
    param.action_url = param.action_url_full;
    var extra_info = {}
    for( k in param){
        if( k.startsWith('extra_info') ){
            var v = param[k];
            k = k.replace('extra_info_','');
            extra_info[k] = v;
        }
    }
    param.extra_info = JSON.stringify(extra_info);

    function update_app_banner(){
        $.post("/admin/update_app_banner.json",param, 
          function(json){
            if (json.status_code) {
                location.reload(true);
            }
            else{
                if(json.message) alert(json.message);
            }
        }, "json");
    }

    update_app_banner();
    
    return false;
  });


  $('.create-app-banner,.update-app-banner').delegate('[name=type]','change',function(event){
    var frm = $(this).parents('form');
    frm.find('.extra_info').hide().end().find('.extra_info.all, .extra_info.'+$(this).val()).show();
  });

  $('.create-app-banner,.update-app-banner').delegate('[name=action_url_pre]','change',function(event){
    var frm = $(this).parents('form');
    var option = $(this).find('option:selected');
    frm.find('[name=action_url_detail],[name=action_url_detail2],[name=action_url_selectdetail]').hide().removeAttr('require').removeAttr('placeholder');
    if( option.attr('params') ){
        var params = option.attr('params').split(",");
        if(params[1]){
            frm.find('[name=action_url_detail2]').val('').attr('placeholder', params[1]).attr('require','true').show();
            frm.find('[name=action_url_detail]').width(80);
        }else{
            frm.find('[name=action_url_detail]').width(180);
        }
        frm.find('[name=action_url_detail]').val('').attr('placeholder', params[0]).attr('require','true').show();
    }

    frm.find('[name=action_url_full]').val(option.attr('value'));
    if( option.attr('select') ){
        var params = option.attr('select').split(",");
        frm.find('[name=action_url_selectdetail]').empty();
        $(params).each(function(i, v){
            var $option = $("<option value='"+v+"'>"+v+"</option>");
            frm.find('[name=action_url_selectdetail]').append($option);
        })
        frm.find('[name=action_url_selectdetail]').show().val(params[0]).trigger('change');
    }
  });

  $('.create-app-banner,.update-app-banner').delegate('[name=action_url_detail], [name=action_url_detail2]','keyup paste change',function(event){
    var frm = $(this).parents('form');
    var action_url_pre = frm.find("[name=action_url_pre]").val();
    frm.find("[name=action_url_detail], [name=action_url_detail2]").each(function(){
        if($(this).attr('placeholder')){
            var key = $(this).attr('placeholder');
            var value = $(this).val();
            if(value) action_url_pre = action_url_pre.replace("{"+key+"}", value);
        }
    })
    frm.find('[name=action_url_full]').val(action_url_pre);
  });
  
  $('.create-app-banner,.update-app-banner').delegate('[name=action_url_selectdetail]','change',function(event){
    var frm = $(this).parents('form');
    var action_url_pre = frm.find("[name=action_url_pre]").val();
    frm.find("[name=action_url_selectdetail]").each(function(){
        var key = 'select';
        var value = $(this).val();
        action_url_pre = action_url_pre.replace("{"+key+"}", value);
    })
    frm.find('[name=action_url_full]').val(action_url_pre);
  });
  
  $('a.duplicate').click(function(event){
    event.preventDefault();
    var $this = $(this);    
    var abid = $(this).attr('abid');
    if(!abid){
        return;  
    } 

    var param = {abid:abid};
    
    $.get("/admin/get_app_banner.json",param,
        function(json){
            if (json.status_code) {
                if(json.appbanner){
                    var appbanner = json.appbanner;
                    appbanner.start_date = $.datepicker.formatDate('mm/dd/yy',new Date(Date.parse(appbanner.start_date)))
                    appbanner.end_date = $.datepicker.formatDate('mm/dd/yy',new Date(Date.parse(appbanner.end_date)))

                    var $layer = $('.create-app-banner');

                    for(var k in appbanner){
                        var $el = $layer.find("[name="+k+"]");
                        if($el.is(":checkbox")){
                            if( appbanner[k] ) $el[0].checked=true;
                        }else{
                            $el.val( appbanner[k] );                         
                        }
                    }    

                    $layer.find('.extra_info').hide().end().find('.extra_info.all, .extra_info.'+appbanner.type).show();
                    $layer.find('[name=type]').val( appbanner.type);
                    $layer.find('[name=action_url_pre] option').each(function(){
                        var pattern = this.value.replace(/\{[^\}]+\}/g,'(.+)');
                        var regex = new RegExp("^"+pattern+"$");
                        var match = appbanner.action_url.match(regex);
                        if( match ){
                            $(this).parent().val(this.value).change();
                            if(match[1]){
                                $layer.find('[name=action_url_detail]').val( match[1] ).change();
                                $layer.find('[name=action_url_selectdetail]').val( match[1] ).change();
                            }
                            if(match[2]) $layer.find('[name=action_url_detail2]').val( match[2] ).change();
                        }
                    })
                    try{
                        var extra_info = JSON.parse(appbanner.extra_info);
                        for(var k in extra_info){
                            $layer.find("[name=extra_info_"+k+"]").val( extra_info[k] );
                        }
                    }catch(e){}

                    $.dialog('create-app-banner').open();
                }
            }
            else{
                if(json.message) alert(json.message);
            }
    }, "json");
    return false;
  });

});
