if(!window.Fancy) window.Fancy = {};

// top menu bar
jQuery(function($){
    var $nav = $('.navigation'), $cur = null, cur_len = 0, timer, sc, $container = $('.container:visible'), $submenu = $('.submenu');
    var delay = 200;

    clearTimeout(timer);

	$('#header .trick')
		.css('top',$('#header').height()+'px')
		.on('click',function(e){
			if($(this).closest('.gnb-wrap').hasClass('right')){
				e.preventDefault();
				var $this = $(this);
				clearTimeout(timer);

				$('html').trigger('unlockScroll');
				$this.closest('.gnb').removeClass('active').removeClass('open').removeClass('hover').end();
				$nav.find('.search').removeClass('focus').find('input').val('');
				timer = setTimeout(function(){
					$nav.find('[class^="menu-contain"], [class^="feed-"]').removeClass('show');
					$('html').removeClass('hover');
				},100);
			}else{
				e.preventDefault();
				var $this = $(this);
				clearTimeout(timer);

				$submenu.find('.submenu-dropdown').css('height','0');
				timer = setTimeout(function(){
					$submenu.removeClass('show');
					$this.closest('li.gnb').removeClass('hover');
				},200);
			}
		})
		.on('focus mouseover', function(e){
			if($(this).closest('.gnb-wrap').hasClass('right')) return;

			e.preventDefault();
			var $this = $(this);
			clearTimeout(timer);

			$submenu.find('.submenu-dropdown').css('height','0');
			timer = setTimeout(function(){
				$submenu.removeClass('show');
				$this.closest('li.gnb').removeClass('hover');
			},200);
		})

	$nav.find('a[data-menu]')
		.on('click',function(){
			clearTimeout(timer);
			var menu = $(this).attr('data-menu');
			var $menu = $(this).closest('#header').find('.submenu[data-menu="'+menu+'"]');
			var $submenu = $menu.find('.submenu-main small a:first-child');
			if ($(window).width()<701) {
				$(this)
					.closest('.navigation').find('a').removeClass('hover').end().end()
					.addClass('hover')
					.closest('#header').find('.submenu').hide().find('.submenu-main small a').removeClass('hover');
					$menu.show().find('.submenu-detail').hide().end();
					return false;
			}
		})
		.on('mouseover focus',function(){
			clearTimeout(timer);
            $this = $(this);
			var menu = $this.attr('data-menu');
			var $menu = $this.closest('#header').find('.submenu[data-menu="'+menu+'"]');
			var $submenu = $menu.find('.submenu-main small a:first-child');
			if ($(window).width()>700) {
				$this
					.closest('.navigation').find('a').removeClass('hover').end().end()
					.addClass('hover')
					.closest('#header').find('.submenu').hide().find('.submenu-main small a').removeClass('hover');
					if ($menu.find('.submenu-detail').length>1) {
						$menu.show()
							.find('.submenu-detail').hide().end()
							.find('.submenu-detail[data-menu="'+$submenu.attr('data-menu')+'"]').show();
						$submenu.addClass('hover').end();
					}else{
						$menu.show()
							.find('.submenu-detail').show();
						$submenu.addClass('hover').end();
					}
			}
		})
		.on('mouseleave blur',function(){
			clearTimeout(timer);
			if ($(window).width()>700) {
				timer = setTimeout(function(){
					$('#header').find('.navigation').find('a').removeClass('hover').end().end().find('.submenu').hide();
				},200);
			}
	});
	$submenu
		.on('mouseover',function(){
			clearTimeout(timer);
		})
		.on('mouseover focus','a',function(){
            $this = $(this);
			clearTimeout(timer);
		})
		.on('mouseleave blur', function(){
			clearTimeout(timer);
			if ($(window).width()>700) {
				timer = setTimeout(function(){
					$('#header').find('.navigation').find('a').removeClass('hover').end().end().find('.submenu').hide();
				},200);
			}
		})
		.find('.submenu-main small a[data-menu]')
			.hover(function(){
				var $menu = $(this).closest('.submenu');
				var $submenu = $(this);
				clearTimeout(timer);
				if ($(window).width()>700) {
					$(this).closest('small').find('a').removeClass('hover').end().end().addClass('hover');
					$menu
						.find('.submenu-detail').hide().end()
						.find('.submenu-detail[data-menu="'+$submenu.attr('data-menu')+'"]').show();
				}
			})
			.click(function(){
				var $menu = $(this).closest('.submenu');
				var $submenu = $(this);
				if ($(window).width()<701) {
					$(this).closest('small').find('a').removeClass('hover').end().end().addClass('hover');
					$menu
						.find('.submenu-detail').hide().end()
						.find('.submenu-detail[data-menu="'+$submenu.attr('data-menu')+'"]').show();
					return false;
				}
			})
		.end()
		.find('.submenu-main .back').click(function(){
			if ($(window).width()<701) {
				$('#header').find('.navigation a').removeClass('hover').end().find('.submenu').hide().find('.submenu-detail').hide()
				return false;
			}
		}).end()
		.find('.submenu-detail .back').click(function(){
			var $menu = $(this).closest('.submenu');
			if ($(window).width()<701) {
				$menu.find('.submenu-main small a').removeClass('hover').end().find('.submenu-detail').hide();
				return false;
			}
	});


	$('#header .m_menu').on('click',function(){
		if ($(window).width()<701) {
			$('body').toggleClass('open_nav');
			$('#header .submenu').hide().find('.submenu-main small a').removeClass('hover').end().find('.submenu-detail').hide()
			return false;
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
                        },
                        error : function(xhr, textStatus, errorThrown ) {
                            alertify.alert("Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText);
                        },
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
        //             $('html').trigger('unlockScroll');
        //             return;
        //         }
        //         if(!dlg_drop.showing()){
        //             $('html').trigger('unlockScroll');
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

    $('#header .prompt-inbox a.close').click(function(event) {
        event.preventDefault();
        $('#header .prompt-inbox').hide();
        $.post('/header_notification_as_read.json', {messages_past_a_day_for_merchant:true}, function (data) {});
    });
    $('#header .prompt-inbox a.view').click(function(event) {
        $('#header .prompt-inbox').hide();
        $.post('/header_notification_as_read.json', {messages_past_a_day_for_merchant:true}, function (data) {});
        return true;
    });

});

jQuery(function($){
    Fancy.ActivitiesPreview = {
        $sensor: $(".mn-noti").parent(),    
        $pulldown: $(".mn-noti").parent().find(".feed-activity"),
        $tab: $(".mn-noti").parent().find(".feed-activity > h4 > a"),
        $activityloading: $(".mn-noti").parent().find(".feed-activity > .feed.activity .loading"),
        $activitylist: $(".mn-noti").parent().find(".feed-activity > .feed.activity > ul"),
        $activityempty: $(".mn-noti").parent().find(".feed-activity > .feed.activity > div.empty"),
        $activitymore: $(".mn-noti").parent().find(".feed-activity > .feed.activity > .more"),
        $notificationloading: $(".mn-noti").parent().find(".feed-activity > .feed.notifications .loading"),
        $notificationlist: $(".mn-noti").parent().find(".feed-activity > .feed.notifications > ul"),
        $notificationempty: $(".mn-noti").parent().find(".feed-activity > .feed.notifications > div.empty"),
        $notificationmore: $(".mn-noti").parent().find(".feed-activity > .feed.notifications > .more"),
        $template: $(".mn-noti").parent().find(".feed-activity > .feed.notifications script[type='fancy/template']"),
        pulldownCloseTimer: null,
        loaded: false,
        init: function () {
            var preview = this;
            this.$sensor.mouseenter(function (e) {
                clearTimeout(preview.pulldownCloseTimer);
                preview.openPulldown();
            }).mouseleave(function (e) {
                preview.pulldownCloseTimer = setTimeout(function () { preview.closePulldown(); }, 100);
            });
            this.$tab.click(function(e){
                e.preventDefault();
                preview.$tab.removeClass("current");
                $(this).addClass("current");
                preview.$pulldown.find(".feed").hide();
                if( $(this).attr("tab") == 'activity'){
                    preview.$pulldown.find(".feed.activity").show();
                }else if( $(this).attr("tab") == 'messages'){
                    preview.$pulldown.find(".feed.messages").show();                
                    if( $(this).hasClass('new')){
                        $.post("/header_notification_as_read.json", {messages:true}, function (data) {})
                        $(this).removeClass('new');
    		    $(".feed-inbox.prompt-cs").hide();
                        if( !$('.feed-activity h4 a.new').length ) $(this).closest("li.gnb").find("a.mn-noti").addClass("none");
                    }                
                }else{                
                    preview.$pulldown.find(".feed.notifications").show();
                    if( $(this).hasClass('new')){
                        $.post("/header_notification_as_read.json", {notifications:true}, function (data) {})
                        $(this).removeClass('new');
    		    $(".feed-inbox.prompt-cs").hide();
                        if( !$('.feed-activity h4 a.new').length ) $(this).closest("li.gnb").find("a.mn-noti").addClass("none");
                    }
                }
            });
            this.$pulldown.hide();
            this.$activityloading.hide();
            this.$notificationloading.hide();

            var calling = false;
            var isLast = false;
            this.$activitylist.scroll(function(e){
                if(calling || isLast) return;
                var $list = preview.$activitylist;
                var scrollTop = $list.scrollTop();
                var scrollHeight = $list[0].scrollHeight;
                if(scrollTop > scrollHeight - $list.height() - 400 ){
                    var aid = $list.find("li[data-aid]:last").attr('data-aid');
                    calling = true;
                    $.get("/recent_activity_feed.json", {cursor:aid}, function (data) {
                        if(!data) isLast=true;
                        var lastTimeSince = preview.$activitylist.find("li[data-timesince]:last").attr('data-timesince');
                        preview.$activitylist.append(data);
                        preview.$activitylist.find("li[data-timesince='"+lastTimeSince+"']").not(':first').remove();
                    }).always(function () {
                        calling = false;
                    });
                }
            });
        },
        openPulldown: function () {
            var preview = this;
            var maxFetch = 20;
            var maxShow = 4;
            this.$sensor.addClass("open");
            this.$pulldown.show();

            if (!this.loaded) {
                this.loaded = true;
                this.$activityloading.show();
                this.$notificationloading.show();
                
                $.getJSON("/notifications.json", {count: maxFetch, lang:window.CURRENT_LANGCODE||"en", thumbnail:82}, function (data) {
                    preview.$notificationlist.empty();
                    if (data.response.notifications.length > maxShow) {
                        data.response.notifications = data.response.notifications.slice(0, maxShow);
                    }
                    var now = new Date();
                    var today = $.datepicker.formatDate('yy-mm-dd', now);
                    var yesterday = $.datepicker.formatDate('yy-mm-dd', new Date(now.setDate( now.getDate()+1)));
                    var prev_date = null;
                    for (i in data.response.notifications) {
                        var item = data.response.notifications[i];
                        var $li = $('<li>');
                        var text = item.text;
                        var date = $.datepicker.formatDate('yy-mm-dd',  $.datepicker.parseDate('yy-mm-dd', item.date_created) );
                        if( !prev_date || prev_date!=date){
                            var str = "";
                            if(date==today) str = "Today";
                            else if (date==yesterday) str = "Yesterday";
                            else str = $.datepicker.formatDate('dd MM', $.datepicker.parseDate('yy-mm-dd', item.date_created) );
                            
                            preview.$notificationlist.append("<li class='date-divider'>"+str+"</li>");
                        }
                        prev_date = date;

                        if (item.entities.user) {
                            var user = item.entities.user;
                            $li.append('<a href="/' + user.username + '"><img src="' + user.image_url.replace(/http[s]?:/i,'') + '" class="photo"></a>');
                            text = text.replace((user.fullname||user.username)+" ","<a href='/"+user.username+"' class='username'>"+(user.fullname||user.username)+"</a> ");
                        } else if(item.type=='featured'){
                            var thing = item.entities.thing;
                            $li.append("<a href='" + thing.url + "'><img src='/_ui/images/common/blank.gif' class='photo featured'></a>");
                            text = text.replace(thing.name,"<a href='"+thing.url+"'>"+thing.name+"</a>");
                        } else if(item.type=='order_shipped'){
                            $li.append("<a href='/purchases/" + item.entities.order.order_id + "'><img src='/_ui/images/common/blank.gif' class='photo ship'></a>");
                            text = text.replace("#"+item.entities.order.order_id, "<a href='/purchases/" + item.entities.order.order_id + "' class='full_link'>#"+item.entities.order.order_id+"</a>");
                        } 

                        if (item.entities.thing) {
                            var thing = item.entities.thing;
                            $li.append('<a href="' + thing.url + '"><img src="' + (thing.thumb_image_url||'').replace(/http[s]?:/i,'') + '" class="thing"></a>');
                            text = text.replace(thing.name,"<a href='"+thing.url+"'>"+thing.name+"</a>");
                        } else if (item.entities.deal) {
                            var deal = item.entities.deal;
                            $li.append('<a href="' + deal.url + '"><img src="' + deal.image_url.replace(/http[s]?:/i,'') + '" class="thing"></a>');
                        } else if (item.entities.store) {
                            var store = item.entities.store;
                            $li.append('<a href="/brands-stores/' + store.name + '"><img src="' + store.image_url.replace(/http[s]?:/i,'') + '" class="thing"></a>');
                        } else if (item.entities.user2) {
                            var user = item.entities.user2;
                            $li.append('<a href="/' + user.username + '"><img src="' + user.image_url.replace(/http[s]?:/i,'') + '" class="thing"></a>');
                            text = text.replace((user.fullname||user.username)+" ","<a href='/"+user.username+"'> class='username'"+(user.fullname||user.username)+"</a> ");
                        } else if (item.image_url_120) {
                            $li.append('<a href="/help/promotions"><img src="' + item.image_url_120.replace(/http[s]?:/i,'') + '" class="thing"></a>');
                        }

                        if (item.entities.livechat) {
                            var livechat = item.entities.livechat;
                            text = text.replace('Live Chat',"<a href='"+livechat.url+"' class='username'>Live Chat</a>");
                            text = text.replace('live chat',"<a href='"+livechat.url+"' class='username'>live chat</a>");
                        }

                        $li.append('<span class="noti-wrap">'+text+'</span>');
                        preview.$notificationlist.append($li);
                    }
                    if(!data.response.notifications.length && preview.$notificationempty[0]){
                        preview.$notificationempty.show();
                        preview.$notificationlist.hide();
                    }else{
                        preview.$notificationmore.show();
                    }

                }).always(function () {
                    preview.$notificationloading.hide();
                }).fail(function() {
                    preview.loaded = false;
                });


                $.get("/recent_activity_feed.json", {}, function (data) {
                    preview.$activitylist.empty();                
                    preview.$activitylist.html(data);

                    if(!preview.$activitylist.find("li").length && preview.$activityempty[0]){
                        preview.$activityempty.show();
                        preview.$activitylist.hide();
                    }else{
                        preview.$activitymore.show();
                    }

                }).always(function () {
                    preview.$activityloading.hide();
                }).fail(function() {
                    preview.loaded = false;
                });
            }
        },
        closePulldown: function () {
            this.$pulldown.hide();
            this.$sensor.removeClass("open");
        }
    };


    Fancy.MessagesPreview = {
        $sensor: $(".mn-msg").parent(),
        $tab: $(".mn-msg").parent().find(".feed-activity > h4 > a"),
        $pulldown: $(".mn-msg").parent().find(".feed-activity"),
        $messageloading: $(".mn-msg").parent().find(".feed-activity > .feed.messages .loading"),
        $messageempty: $(".mn-msg").parent().find(".feed-activity > .feed.messages > div.empty"),
        $messagelist: $(".mn-msg").parent().find(".feed-activity > .feed.messages > ul"),
        $messagemore: $(".mn-msg").parent().find(".feed-activity > .feed.messages > .more"),
        $messagetemplate: $(".mn-msg").parent().find(".feed-activity > .feed.messages script[type='fancy/template']"),
        $newslettersloading: $(".mn-msg").parent().find(".feed-activity > .feed.newsletter .loading"),
        $newsletterslist: $(".mn-msg").parent().find(".feed-activity > .feed.newsletter > ul"),
        $newslettersempty: $(".mn-msg").parent().find(".feed-activity > .feed.newsletter > div.empty"),
        $newslettersmore: $(".mn-msg").parent().find(".feed-activity > .feed.newsletter > .more"),
        
        pulldownCloseTimer: null,
        loaded: false,
        init: function () {
            var preview = this;
            this.$sensor.mouseenter(function (e) {
                clearTimeout(preview.pulldownCloseTimer);
                preview.openPulldown();
            }).mouseleave(function (e) {
                preview.pulldownCloseTimer = setTimeout(function () { preview.closePulldown(); }, 100);
            });

            this.$tab.click(function(e){
                e.preventDefault();
                preview.$tab.removeClass("current");
                $(this).addClass("current");
                preview.$pulldown.find(".feed").hide();
                if( $(this).attr("tab") == 'messages'){
                    preview.$pulldown.find(".feed.messages").show();
                }else if( $(this).attr("tab") == 'newsletter'){
                    preview.$pulldown.find(".feed.newsletter").show();
                }
            });
        
            this.$pulldown.hide();
            this.$messageloading.hide();
            this.$messageempty.hide();
            this.$newslettersloading.hide();
            this.$newslettersempty.hide();
        },
        openPulldown: function () {
            var preview = this;
            var maxFetch = 20;
            var maxShow = 4;
            this.$sensor.addClass("open");
            this.$pulldown.show();

            if (!this.loaded) {
                this.loaded = true;
                this.$messageloading.show();
                this.$messageempty.hide();
                this.$newslettersloading.show();
                this.$newslettersempty.hide();
                var storeOnly = typeof isStoreOnly != 'undefined' && isStoreOnly;

                $.getJSON("/messages/retrieve-threads.json", {archived:false}, function (data) {
                    preview.$messagelist.empty();
                    
                    var threads = data.threads;
                    var validThreads = [];
                    $(threads).each(function(){
                        if( !storeOnly || this.am_i_store ) validThreads.push(this);
                    })

                    for (i in validThreads) {
                        var item = validThreads[i];
                        if(!item.last_message) continue;

                        var $li = $(preview.$messagetemplate.html());
                        var member = item.members[0];
                        var isSellerThread = !!member.seller;

                        $li.attr("thread-id", item.id).attr("following", item.following);
                        $li.find("img").css('background-image',"url('"+((isSellerThread?member.seller.logo_image:member.image_url)||'').replace(/http[s]?:/i,'')+"')").end()
                        .find("b.username").html(item.is_admin_thread?"Fancy":(isSellerThread?member.seller.brand_name:(member.fullname||member.username))).end()
                        .find("span.message").html( item.last_message.message).end()
                        .find(".status .date").html(item.last_message.sent_since).end()
                        .find("a").attr("href", (storeOnly?'/merchant':'')+"/messages/"+item.id).end();

                        if( isSellerThread ){
                            $li.addClass("store").find("b.username").addClass("store");
                        }
                        if( item.am_i_store ){
                            $li.find("b.username").addClass("store");
                        }
                        
                        if(item.last_message.attachments.length){
                            if(item.last_message.attachments[0].name.match(/\.(?:png|jpg|jpeg|gif)$/i)){
                                $li.find("span.message").html($li.find("span.message").html()+"(Image)");
                            }else{
                                $li.find("span.message").html($li.find("span.message").html()+"(Attachment)");
                            }
                        }

                        if(item.last_message.things && item.last_message.things.length){
                            $li.find("span.message").html(item.last_message.things[0].name);
                        }

                        if(item.unread_count > 0){
                            $li.find(".new").show().end().addClass('unread');
                            $li.addClass('show');
                        }else if(item.last_message.from.id != member.id){
                            $li.find("span.message").html('You: '+ $li.find("span.message").html());                        
                        }

                        preview.$messagelist.append($li);
                    }
                    if(!preview.$messagelist.find("li").length){
                        preview.$messageempty.show();
                        preview.$messagelist.hide();
                        preview.$messagemore.hide();
                    }else{
                        preview.$messageempty.hide();
                        preview.$messagelist.show();
                        preview.$messagemore.show();
                    }

                }).always(function () {
                    preview.$messageloading.hide();
                }).fail(function() {
                    preview.loaded = false;
                });

                $.get("/newsletters?header", {}, function (data) {
                    preview.$newsletterslist.empty();                
                    preview.$newsletterslist.html(data);

                    if(!preview.$newsletterslist.find("li").length && preview.$newslettersempty[0]){
                        preview.$newslettersempty.show();
                        preview.$newslettersmore.hide();
                        preview.$newsletterslist.hide();
                    }else{
                        preview.$newslettersempty.hide();
                        preview.$newslettersmore.show();
                        preview.$newsletterslist.show();
                    }

                }).always(function () {
                    preview.$newslettersloading.hide();
                }).fail(function() {
                    preview.loaded = false;
                });
            }
        },
        closePulldown: function () {
            this.$pulldown.hide();
            this.$sensor.removeClass("open");
        }
    };
});

$(function(){
    //Fancy.ActivitiesPreview.init();
    Fancy.MessagesPreview.init();
})
