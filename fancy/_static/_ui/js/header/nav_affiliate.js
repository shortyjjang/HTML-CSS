$(function(){

    var  $cur = null, cur_len = 0, timer, sc, $container = $('.container:visible');
    var delay = 200;

    clearTimeout(timer);
    $('.gnb')
        .on('mouseover', '.mn-you', function(){
            $('.menu-contain-you').find('.menu-container-you').height($('.menu-contain-you .you-main').height());
        })
        .on('mouseleave', 'li', function(){
            $this = $(this);
            if ($(this).hasClass('_shop') || $(this).hasClass('_store')){
                clearTimeout(timer);
                timer = setTimeout(function(){$('.menu-contain-shop').removeClass('show');timer = setTimeout(function(){$('html').removeClass('hover');},400);},100);
            }else{
                $('.menu-contain-shop').removeClass('show');
                $('html').removeClass('hover');
            }
            $(this).removeClass('hover');
        })
        .on('click','.you-main a.add-to-fancy',function(e){
            e.preventDefault();
            $(this).closest('.menu-contain-you .menu-container-you').height($(this).closest('.you-main').height());
            setTimeout(function(){
                    $('.menu-contain-you').addClass('show').find('.menu-container-you').height($('.menu-contain-you .you-main-add').height())
                },10);
        })
        .on('click','.you-main-add a.back',function(e){
            e.preventDefault();
            $('.menu-contain-you').removeClass('show').find('.menu-container-you').height($('.menu-contain-you .you-main').height());
        })
        .on('click','.add-web, .add-file',function(e){
            e.preventDefault();
            $('html').removeClass('fixed');
            $(window).scrollTop($container.attr('position'));
                $container.css('top','0');
            $(this).closest('.navigation').find('.gnb').removeClass('active').end();
            setTimeout(function(){$('.gnb').find('[class^="menu-contain"]').removeClass('show');$('html').removeClass('hover');},100);
            $('#popup_container').addClass('add-fancy').show().css('opacity','1').find('.popup.add-fancy').removeClass('upload').removeClass('select').removeClass('info');
            if ($(this).hasClass('add-web')) {
                $.dialog('add-fancy').$obj.addClass('web');
                $.dialog('add-fancy').open();
            }else{
                $.dialog('add-fancy').$obj.addClass('upload');
                $.dialog('add-fancy').open();
            }
        });
    
    // uploading files to add to Fancy
    var dlg_drop=$.dialog('drop-to-upload'), dlg_add=$.dialog('add-fancy'), $_drag_objs=$();

    if(!dlg_add.$obj.length || !dlg_drop.$obj.length) return;

    // load lists and categories
    $.ajax({
        type : 'get',
        url  : '/categories_lists.json',
        success : function(json){
            if(!json || !json.response) return;

            var i,c,r=json.response,cate,list,html='';

            // categories
            html = '';
            for(i=0,c=r.categories.length; i<c; i++){
                cate  = r.categories[i];
                html += '<li><label data-value="'+cate.key+'">'+cate.label.escape_html()+'</label></li>';
            }
            dlg_add.$obj.find('.lists-popout.category > ul').html(html);//.find('li:first-child').click();

            // lists
            html='';
            for(i=0,c=r.lists.length; i<c; i++){
                list  = r.lists[i];
                html += '<li><label data-value="'+list.id+'">'+list.title.escape_html()+'</label><input type="checkbox"></li>';
            }
            dlg_add.$obj.find('.lists-popout.lists > ul').html(html);//.find('li:first-child').click();

        }
    });
    
    // add fancy dialog
    dlg_add.$obj
        .append('<iframe name="iframe_img_upload" frameborder="0" />') // we should use script to add iframe to workaround firefox
        .on({
            open : function(){
                $(this).find('img.photo').attr('src','');
            },
            close : function(){                
                var $this = $(this);
                $this.removeClass("web upload select info");
                $this.find('input:text').val('').end()
                    .find('select').each(function(){ this.selectedIndex = 0; }).end()
                    .find('form').trigger('reset').end()
                    .find('button:submit').disable(false).end();
            },
            tab : function(e, tab){
                var $this = $(this);
                $this.removeClass('web upload select info').addClass(tab);
                $this.find(".step.info").find(".error").removeClass("error");
            }
        })
        
        .on('click', 'button.cancel_', function(event){
            event.preventDefault();
            if($(this).hasClass('disabled')) return;
            dlg_add.close();
        })        
        .on('click', 'button.btn-add-note', function(event){
            event.preventDefault();
            $(this).hide().next('input:text').show();
        })        
        // Fetch images from web
        .find('.step.web')
            .find('input.url_').keydown(function(event){ if(event.which==13){event.preventDefault();$(this).closest('.step').find('.btn-blue-embo-fetch').click()} }).end()
            .find('.btn-blue-embo-fetch')
                .click(function(){
                    var $btn=$(this),$step=$btn.closest('.step'),$pg,$ind,url;

                    url = $step.find('input.url_').val().trim().replace(/^https?:\/\//i,'');
                    if(!url.length) return alertify.alert(gettext('Please enter a website address.'));

                    // hide buttons and show progress bar
                    $step.find('.btns-area').hide().end().find('.progress').show().end();
                    $pg  = $step.find('.progress-bar');
                    $ind = $pg.find('em').width(0).animate({'width':'70%'},1500);

                    function check(images, callback){
                        var fn=[], list=[], cur=80, step=30/images.length, timer;

                        function load(src){
                            var def = $.Deferred(), img = new Image();
                            img.onload = function(){
                                clearTimeout(timer);

                                cur += step;
                                if(cur > 100) cur = 100;
                                $ind.stop().animate({'width':cur+'%'},100);

                                if(this.width > 200 || this.height > 200) list.push({src:this.src, dimension: this.width+'x'+this.height});
                                def.resolve(this);
                            };
                            img.onerror = function(){
                                clearTimeout(timer);
                                def.reject(this);
                            };
                            img.src = src;
                            // 3 seconds timeout
                            timer = setTimeout(img.onerror, 3000);
                            return def;
                        };

                        for(var i=0,c=images.length; i < c; i++) fn[i] = load(images[i]);

                        $.when.apply($,fn).always(function(){
                            if(list.length){
                                dlg_add.$obj.trigger('tab','select');
                                dlg_add.center();
                                $step.siblings('.select').trigger('set.images',[list]);
                                $('#fancy_add-link').val('http://'+url);
                            }else{
                                alertify.alert(gettext("Oops! Couldn't find any good images for the page."));
                                dlg_add.$obj.trigger('tab','web');
                            }
                        });
                    };

                    if(/\.(jpe?g|png|gif)$/i.test(url)) return check(['http://'+url]);

                    // fetching images
                    $.ajax({
                        type : 'get',
                        url  : '/extract_image_urls.json?url='+encodeURIComponent(url),
                        dataType : 'json',
                        success  : function(json){
                            if(!json) return;
                            if(json.response){
                                check(json.response);
                            } else if(json.error && json.error.message){
                                alertify.alert(json.error.message);
                            }
                        },
                        complete : function(){
                            $step.find('.btns-area').show().end().find('.progress').hide().end();
                        }
                    });
                })
            .end()
        .end()
        // Upload local images
        .find('>.step.upload')
            .find('form')
                .on({
                    upload_begin : function(event){
                        $(this)
                            .find('>.btns-area').hide().end()
                            .find('>.progress').show().end();
                    },
                    upload_complete : function(event,json){
                        var $this = $(this);

                        $this.trigger('reset');

                        if(!json || typeof(json.status_code) == 'undefined') return;
                        if(json.status_code == 1){
                            $step3 = $this.closest('.popup').find('>.info');
                            if(json.image && json.image.url){
                                $step3.trigger('set.uploaded_image', [json.image]);
                                dlg_add.$obj.trigger('tab','info');
                                dlg_add.center();
                            } else {
                                alertify.alert(gettext('Something went wrong. Please upload again.'));
                            }
                        }else if(json.status_code == 0){
                            if(json.message) alertify.alert(json.message);
                        }
                    },
                    reset : function(){
                        $(this)
                            .find('>.btns-area').show().end()
                            .find('>.progress').hide().find('em').width(0);
                    },
                    submit : function(event,filelist){
                        var $this=$(this),$step=$this.closest('.step'),$indicator,file_form=this.elements['file'],file,progress_id,filename,extension;

                        if(!filelist) filelist = file_form.files || (file_form.value ? [{name:file_form.value}] : []);
                        if(filelist && filelist.length) file = filelist[0];

                        if(!file){
                            alertify.alert(gettext('Please select a file to upload'));
                            return false;
                        }

                        if(!/([^\\\/]+\.(jpe?g|png|gif))$/i.test(file.name||file.filename)){
                            alertify.alert(gettext('The image must be in one of the following formats: .jpeg, .jpg, .gif or .png.'));
                            return false;
                        }

                        filename  = RegExp.$1;
                        extension = RegExp.$2;

                        $indicator = $this.find('.progress-bar em').css('width','0.5%');

                        $this.trigger('upload_begin');

                        function onprogress(cur,len){
                            var prog = Math.max(Math.min(cur/len*100,100),0).toFixed(1);
                            $indicator.stop().animate({'width':prog+'%'},500);
                        };

                        if(!window.FileReader || !window.XMLHttpRequest) {
                            var null_counter = 0, completed = false;

                            progress_id = parseInt(Math.random()*10000);
                            document.cookie = 'X-Progress-ID='+progress_id+'; path=/';
                            window._upload_image_callback = function(json){ completed = true; $this.trigger('upload_complete',json); };

                            function get_progress(){
                                $.ajax({
                                    type : 'get',
                                    url  : '/get_upload_progress.json',
                                    data : {'X-Progress-ID':progress_id},
                                    dataType : 'json',
                                    success  : function(json){
                                        if(!json) return;
                                        if(json.uploaded + 1000 >= json.length) json.uploaded = json.length;
                                        onprogress(json.uploaded, json.length);
                                    },
                                    complete : function(xhr){
                                        if(completed || null_counter > 10) return;
                                        if(xhr.responseText == 'null') null_counter++;
                                        setTimeout(get_progress, 500);
                                    }
                                });
                            };
                            setTimeout(get_progress, 300);
                            return true;
                        }

                        // Here is ajax file upload
                        var reader = new FileReader(), xhr = new XMLHttpRequest();
                        xhr.upload.addEventListener('progress', function(e){ onprogress(e.loaded, e.total)}, false);
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

                                $this.trigger('upload_complete', json);
                            }
                        };
                        xhr.open('POST', '/upload_image.json?thumbnail_size=916&filename='+filename, true);
                        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                        xhr.setRequestHeader('X-Filename', encodeURIComponent(filename));
                        xhr.send(file);

                        return false;
                    }
                })
                .on('change', 'input[type="file"]', function(){
                    $(this).nextAll('.text').val(this.value.replace(/.*fakepath\\/,''));
                })
            .end()
        .end()
        .find('>.step.select')
            .on({                
                'set.images' : function(event,images){
                    var $this=$(this), title, template;
                    if(!$.isArray(images)) images = [images];

                    url = $this.closest('.popup').find('.step.web input.url_').val().replace('http://','');                    
                    template = $this.find("ul > script").html();

                    $this
                        .find('p.ltit').text("Add from "+url).end()
                        .find("ul > li").remove();

                    $(images).each(function(){
                        var $li = $(template);
                        $li.find("img").css('background-image','url('+this.src+')').end()
                            .find(".size").html(this.dimension).end()
                            .attr('image-url', this.src);
                        $li.appendTo( $this.find("ul") );
                    })
                        
                }
            })
            .delegate('li input:checkbox','click',function(e){
                var $li = $(this).closest('li');
                if( !$li.hasClass('selected') ){
                    $li.parent().find("li.selected").removeClass('selected').find("input:checkbox").removeAttr('checked');
                }
                $li.toggleClass('selected');
            })
            .on('click', '.back_', function(event){
                event.preventDefault();
                if($(this).hasClass('disabled')) return;
                dlg_add.$obj.trigger('tab','web');
                dlg_add.center();
            })
            .find(".btn-blue-embo-add").click(function(e){
                var $step = $(this).closest('.step');
                var image_url = $step.find("li.selected").attr('image-url');
                if(!image_url){
                    alertify.alert("please select an image");
                    return;
                }
                $step.siblings('.info').trigger('set.image',image_url);
                dlg_add.$obj.trigger('tab','info');
                dlg_add.center();

            }).end()
        .end()
        .find('>.step.info')
            .on({
                'set.uploaded_image' : function(event,image_info){
                    var $this=$(this), title;

                    $this
                        .data('from', 'upload')
                        .data('req_url', '/add_new_thing.xml')
                        .data('fields', 'name link category list_ids note')
                        .find('img.photo').attr('src', image_info.url+"?original").end()                        
                },
                'set.image' : function(event,image){
                    var $this=$(this);
                    
                    $this
                        .data('from', 'web')
                        .data('req_url', '/add_new_sys_thing.json')
                        .data('fields', 'name link category list_ids note user_key photo_url')
                        .find('#fancy_add-photo_url').val(image).end()
                        .find('img.photo').attr('src', image).end()
                }
            })
            .find('.btn-blue-embo-add')
                .click(function(){
                    var $btn=$(this), $step=$btn.closest('.step'), fields, req_url, key, datatype, val, params={via:'web'};

                    req_url  = $step.data('req_url');
                    fields   = $step.data('fields').split(' ');
                    datatype = req_url.match(/\.(json|xml)$/)[1];

                    for(var i=0,c=fields.length; i < c; i++){
                        key = fields[i];
                        val = $step.find('#fancy_add-'+key).val();
                        params[key] = val;
                    }

                    var is_valid = true;
                    $step.find(".error").removeClass("error");
                    if(!params['name']) {
                        $step.find("#fancy_add-name").addClass("error");
                        is_valid = false;
                    }
                    if(!params['category']){
                        $step.find("#fancy_add-category").next().addClass("error");
                        is_valid = false;
                    }
                    if(!is_valid) return;
                    if(params['photo_url'] && params['link']) params['tag_url'] = params['link'];

                    $btn.disable().addClass('loading');

                    function json_handler(json){
                        if(!json) return;
                        if(json.status_code == 1){
                            location.href = json.thing_url;
                        } else if (json.status_code == 0 && json.message){
                            alertify.alert(json.message);
                        }
                    };

                    function xml_handler(xml){
                        var $xml = $(xml), $st = $xml.find('status_code');
                        if(!$st.length) return;
                        if($st.text() == '1'){
                            location.href = $xml.find('thing_url').text();
                        } else if ($st.text() == '0' && $xml.find('message').length){
                            alertify.alert($xml.find('message').text());
                        }
                    };

                    $.ajax({
                        type : 'post',
                        url  : req_url,
                        data : params,
                        dataType : datatype,
                        success  : datatype=='xml'?xml_handler:json_handler,
                        complete : function(){
                            $btn.disable(false).removeClass('loading');
                        }
                    });
                })
            .end()           
            .on('click', '.back_', function(event){
                event.preventDefault();
                if($(this).hasClass('disabled')) return;
                if( $(this).closest('.step').data('from') == 'web'){
                    dlg_add.$obj.trigger('tab','select');
                }else{
                    dlg_add.$obj.trigger('tab','upload');
                }
                dlg_add.center();
            }) 
            .on('click', 'a.select-category', function(event){
                event.preventDefault();

                var $this = $(this), $div;

                if($this.hasClass('list_')) {
                    $div = dlg_add.$obj.find('.lists-popout.lists');
                } else {
                    $div = dlg_add.$obj.find('.lists-popout.category');
                }

                $div.show().find('>ul').scrollTop(0).end().find('input:text').val('');
                $this.removeClass("error");
            })
            .on('change keyup', '#fancy_add-name', function(event){            
                $(this).removeClass("error");
            })
            .on('click', '.lists-popout > span.trick', function(){
                $(this).closest('div').hide();
            })
            .on('click', '.lists-popout li', function(){
                var $this=$(this), $div=$this.closest('.lists-popout'), $label=$this.find('>label'), value=$label.attr('data-value'), text=$label.text(), $a;

                if($div.hasClass('category')){
                    dlg_add.$obj
                        .find('a.select-category.category_').text(text).end()
                        .find('#fancy_add-category').val(value);
                    $div.find("ul li").show().end().find(".result").hide();
                    $div.hide();
                } else {
                    $this.find("input:checkbox")[0].checked = !$this.find("input:checkbox")[0].checked;
                    var selectedList = $this.parent().find("li input:checked");
                    var title = selectedList.eq(0).prev().text() || 'Add to list';
                    if(selectedList.length > 1) title += " and "+(selectedList.length-1)+ " more";
                    var ids = Array.prototype.slice.call(selectedList.map(function(){ return $(this).prev().attr('data-value') })).join(",");
                    dlg_add.$obj
                        .find('a.select-category.list_').text(title).end()
                        .find('#fancy_add-list_ids').val(ids);
                }
            })
            .on('change keyup', '.lists-popout .search input:text', function(event){            
                var q = $(this).val();                
                var $div = $(this).closest('.lists-popout');
                if(!q){
                    $div.find("ul li").show().end().find(".result").hide();
                    return;
                }
                
                var regexp = new RegExp(q,"i");
                $div.find("ul li").each(function(){
                    if($(this).find("label").text().match(regexp)){
                        $(this).show();
                    }else{
                        $(this).hide();
                    }
                })
                if( $div.find("ul li:visible").length ){
                    $div.find(".result").hide();
                }else{
                    $div.find(".result").show();
                }
            })
            .on('click', '.create-list > label', function(e){
                $(this).hide();
                $(this).next().val('');
            })
            .on('keydown', '.lists-popout .create-list input:text', function(event){            
                if(event.which != 13) return;
                $(this).next().click();
            })
            .on('click', '.create-list > button.btn-create', function(event){
                var $this=$(this), $div=$this.closest('.lists-popout'), $ul=$div.find('>ul'), text=$.trim( $(this).prev().val());

                if(!text || $this.data('loading')) return;

                $this.data('loading', true);

                $.ajax({
                    type : 'post',
                    url  : '/create_list.xml',
                    data : {list_name:text},
                    dataType : 'xml',
                    success  : function(xml){
                        var $xml = $(xml), $st = $xml.find('status_code'), lid;
                        if(!$st.length || $st.text() != 1) {
                            if($xml.find('message').length) alertify.alert($xml.find('message').text());
                            return;
                        }
                        if($xml.find("created").text()=='False'){
                            alertify.alert("A list with this name already exists");
                            return;
                        }

                        lid = $xml.find('list_id').text();

                        $('<li><label data-value="'+lid+'">'+text.escape_html()+'</label><input type="checkbox"></li>').prependTo($ul).click();

                        //$div.hide();
                        $this.parent().find("label").show();
                    },
                    complete : function(){
                        $this.data('loading', false);
                    }
                });
            })
        .end();

        // when drag files over document, show "drop to upload" message
        var $popup_container = $('#popup_container');
        // $(window).on({
        //     dragenter : function(event){
        //         var ev, dt;

        //         event.preventDefault();

        //         if(($_drag_objs=$_drag_objs.add(event.target)).length > 1 || !(ev=event.originalEvent) || !(dt=ev.dataTransfer)) return;
        //         if(dt.types.indexOf ? dt.types.indexOf('Files') == -1 : !dt.types.contains('application/x-moz-file')) return;
        //         if($popup_container.is(':visible') && !dlg_add.showing()) return;

        //         dlg_drop.open();
        //     },
        //     dragleave : function(event){
        //         var ev, dt;

        //         event.preventDefault();

        //         if(($_drag_objs=$_drag_objs.not(event.target)).length || !(ev=event.originalEvent) || !(dt=ev.dataTransfer)){
        //             $("html").removeClass("fixed");
        //             $(".container").css('top','');
        //             return;
        //         }
        //         if(!dlg_drop.showing()){
        //             $("html").removeClass("fixed");
        //             $(".container").css('top','');
        //             return;
        //         }

        //         dlg_drop.close();
        //     }
        // });

        if($('._send_message #add_file_input').length){
            $popup_container.find("h1 strong").text("Upload Attachment");
            $popup_container.bind({
                dragover : function(event){ event.preventDefault() },
                drop : function(event){

                    $_drag_objs = $();
                    dlg_drop.close();
                }
            });
        }else{
            $popup_container.bind({
                dragover : function(event){ event.preventDefault() },
                drop : function(event){
                    var ev, dt, images=[];

                    event.preventDefault();
                    if(!(ev=event.originalEvent) || !(dt=ev.dataTransfer) || !dt.files || !dt.files.length) return;

                    $_drag_objs = $();

                    for(var i=0,c=dt.files.length; i < c; i++) {
                        if(/\.(jpe?g|gif|png)$/i.test(dt.files[i].name)) images.push(dt.files[i]);
                    }

                    if(!images.length) {
                        alertify.alert("Please try uploading again. Filetype is not supported.");
                        return;
                    }

                    dlg_add.open().$obj.trigger('tab','upload').find('form').trigger('submit',[images]);
                }
            });
        }

    $('#header.v2 #navigation .gnb .prompt-inbox a.close').click(function(event) {
        event.preventDefault();
        $('#header.v2 #navigation .gnb .prompt-inbox').hide();
        $.post('/header_notification_as_read.json', {messages_past_a_day_for_merchant:true}, function (data) {});
    });
    $('#header.v2 #navigation .gnb .prompt-inbox a.view').click(function(event) {
        $('#header.v2 #navigation .gnb .prompt-inbox').hide();
        $.post('/header_notification_as_read.json', {messages_past_a_day_for_merchant:true}, function (data) {});
        return true;
    });

	$(window).scroll(function(){
		if($(window).width()<971){
			$('#header').css('left',-$(window).scrollLeft()+'px');
		}else{
			$('#header').css('left','');
		}
	});
})
