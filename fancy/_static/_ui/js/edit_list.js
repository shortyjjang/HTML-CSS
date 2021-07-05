jQuery(function($) {
    var $tmpl_edit_list = $("#tpl-edit-list-popup");
    var $tmpl_edit_list_select_featured = $("#tpl-edit-list-select-featured-popup");
    $('#popup_container').append($tmpl_edit_list.template());
    $('#popup_container').append($tmpl_edit_list_select_featured.template());


	$('.popup.edit_mylist').delegate('.btn-save','click',function(event){
        event.preventDefault();
        
        var $popup = $('.popup.edit_mylist');

		var param = {};
		var oid = $popup.find('.btn-save').attr('data-oid');
		var lid = $popup.find('.btn-save').attr('data-lid');
		param['oid'] = oid;
		param['lid'] = lid;

		var privacy_mode; 
        if ($popup.find('.list-private').is('.on')) {
            param['privacy_mode'] = 1;
        } else {
            param['privacy_mode'] = 0;
        }
        var $dnf = $popup.find('.list-discoverable');
        if ($dnf.length) 
            param['do_not_feature'] = $dnf.hasClass('on') ? 0 : 1;

        $popup.find("input[data-key]:visible,textarea[data-key]:visible").each(function(idx, el) {
            var $el = $(el), key = $el.attr('data-key'), val = $el.val().trim();
            param[key] = val;
        })
        if (!param.title || param.title.length<=0){
            alertify.alert("Please enter the title."); 
            return false;
        }
        var endpoint = "/update_list.xml";
        if (lid == "") {
            endpoint = "/create_list.xml";
            param['list_name'] = param.title;
            param.error_on_dupe = true
        }

		$.post(endpoint,param, 
			function(xml){
				var $xml = $(xml);
				if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
					if(!lid) lid = $(xml).find("list_id").text();
					document.location.reload();
				}
				else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                    var msg = $(xml).find("message").text();
                    if (msg === 'dupe') {
                        alertify.alert(`<b>Collection Title Not Available</b><br><br>There is already a collection named ${title}. Try again with a different name.`);
                    } else {
                        alertify.alert(msg);
                    }
				}
			}, "xml");

		return false;
	});

    $(".popup.edit_mylist").delegate(".btn-delete",'click', function(event){
        var lid = $(this).attr('data-lid');
        var oid = $(this).attr('data-oid');

        var param = {};
        param['lid']=lid;
        param['oid']=oid;

        var msg = "Are you sure you want to delete this collection?";
        var original_labels = alertify.labels
        alertify.set({ labels: {
            ok     : "Delete",
            cancel : "Cancel"
        } });
        alertify.confirm(msg,function(e){
            if (e){
                $.post("/delete_list.xml",param, function(xml){
                    if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                        if($('.popup.edit_mylist').hasClass('list-page')){
                            var url = $(xml).find("url").text();
                            location.href = url;
                        } else {
                            var $node = $('ol#lists').find('li.selected-edit-list');
                            if ($node.attr('lid') == lid){
                                $node.remove();
                                $.dialog('edit_mylist').close();
                                $("body").trigger('listDeleted');
                            } else {
                                location.reload(false);
                            }
                        }
                    } else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                        var msg = $(xml).find("message").text();
                        alertify.alert(msg);
                    }
                }, "xml");
            }
        });
        alertify.set({ labels: original_labels });
		return false;
	});
});

jQuery(function($) {
    function open_edit_list(lid, lousername, is_lists) {
        var param = {};
        var selected_value='edit_mylist';
        param['list_id']=lid;
        param['owner']=lousername;
        $.post("/view-edit-list.json",param, function(response){
            if(response.status_code != undefined && response.status_code == 1){
                $('.popup.'+selected_value).find('.fill').empty().append(response.html).end().find(".ltit").html(lid ? 'Edit Collection' : 'Create New Collection');
                if(is_lists) {
                    $('.popup.'+selected_value).addClass('lists-page');
                } else {
                    $('.popup.'+selected_value).addClass('list-page');
                }
                $.dialog(selected_value).open();
            }
            if(response.status_code != undefined && response.status_code == 0){
                if(response.message != undefined)
                alertify.alert(response.message);
            }
        }, "json");
        return false;
    }

    $("#wrapper-create > a.btn-create").on('click', function(event) {
        event.preventDefault();
        var lousername = $(this).parents('.vcard').attr('lousername');

        open_edit_list(null, lousername, true);
    });

    $('.interaction').delegate('a.edit-list','click',function(event){
        event.preventDefault();
        var lid = $(this).parents('#summary').attr('lid');
        var lousername = $(this).parents('#summary').attr('lousername');

        open_edit_list(lid, lousername, false);
    });

    $('#content #lists').delegate('a.edit-list', 'click', function(event) {
        event.preventDefault();
        var li = $(this).parents('li.vcard');
        var lid = li.attr('lid');
        var lousername = li.attr('lousername');

        $('#content #lists li.selected-edit-list').removeClass('selected-edit-list');
        li.addClass('selected-edit-list');

        open_edit_list(lid, lousername, true);
    });
});

jQuery(function($) {
    var is_loading = false;
    $('#popup_container .popup.edit_mylist').delegate('.select-featured','click',function(e){
        e.preventDefault();    

        is_loading = true;
        var list_id = $(this).attr('lid');
        var username = $(this).attr('lousername');
        var param = {list_id:list_id, username:username};

        if(!list_id) {
            return;
        }

        $('.popup.change_cover ul').empty().removeAttr('next_ts');
        $('.popup.change_cover .loading').show();
        $.dialog('change_cover').open();    
        $.get("/get_list_items.json",param, function(res){
            if(res.status_code && res.items){        
                if(res.next_ts) $('.popup.change_cover ul').attr('next_ts',res.next_ts);
                var $tmpl = $("#tpl-list-item-cover");
                var html = $(res.items).each(function(){
                    this.object.list_item_id = this.id; 
                    $tmpl.template(this.object).appendTo($('.popup.change_cover ul'))
                });
                $('.popup.change_cover ul').attr('list_id', list_id);
                $('.popup.change_cover ul').attr('username', username);
            }else{
                alert("failed to loading items. try again");
            }
        }).always(function(){
            is_loading = false;
            $('.popup.change_cover .loading').hide();
        })
    });

    $('#popup_container .popup.edit_mylist').delegate('.select-featured .btn-del','click',function(e){
        var list_id = $('.popup.edit_mylist .select-featured').attr('lid');
        var username = $('.popup.edit_mylist .select-featured').attr('lousername');
        var cover_img = $('.popup.edit_mylist .select-featured img').css('background-image')
        var param = {list_id:list_id, username:username};
        $.post("/set_list_cover_item.json",param, function(response){
            if(response.status_code != undefined && response.status_code == 1){
                $('.popup.edit_mylist .select-featured a.add').show();
                $('.popup.edit_mylist .select-featured img').hide();
                $('.popup.edit_mylist .select-featured .btn-del').hide();

                var $cover_img = $("#lists li[lid="+list_id+"] .fig-image img:eq(0)");
                if($cover_img.css('background-image')==cover_img) {
                    $cover_img.remove();
                    $("#lists li[lid="+list_id+"] .fig-image img:eq(0)").addClass('on');
                }
            }
            if(response.status_code != undefined && response.status_code == 0){
                if(response.message != undefined) alertify.alert(response.message);
            }
        });
        return false;
    });

    $('#popup_container .popup.edit_mylist').delegate('.btn-switch','click',function(e){
        $(this).toggleClass('on');
        return false;
    })
    
    $('.change_cover').delegate('.btn-save','click',function(e){
        var list_id = $('.popup.change_cover ul').attr('list_id');
        var username = $('.popup.change_cover ul').attr('username');
        var selected_item_id = $('.popup.change_cover ul li.on').attr('item_id');
        var param = {list_id:list_id, list_item_id:selected_item_id, username:username};
        $.post("/set_list_cover_item.json",param, function(response){
            if(response.status_code != undefined && response.status_code == 1){
                var cover_img = $('.popup.change_cover ul li.on img').css('background-image')
                var $cover_img = $("#lists li[lid="+list_id+"] .fig-image img:eq(0)");

                $("#lists li[lid="+list_id+"] .fig-image img").each(function(){
                    if( $(this).css('background-image') == cover_img ){
                        $(this).css('background-image', $cover_img.css('background-image') );
                    }
                })
                $cover_img.css('background-image', cover_img )
                $.dialog('change_cover').close();
            }
            if(response.status_code != undefined && response.status_code == 0){
                if(response.message != undefined) alertify.alert(response.message);
            }
        }, "json");      
    });
});

jQuery(function($) {
    $('.change_cover').delegate('li','click',function(){$('.change_cover li').removeClass('on');$(this).addClass('on');});
    $('#content #lists').delegate('.vcard .move','mouseover',function(){$(this).parents('.vcard').addClass('change');});
    $('#content #lists').delegate('.vcard','mouseleave',function(){$(this).removeClass('change');});
});

jQuery(function($) {
    $('.change_cover .cover-image .scroll').scroll(function(e){
        var $ul = $(this).find("ul");      
        var list_id = $ul.attr('list_id');
        var page_num = $ul.attr('next_ts');
        var username = $ul.attr('username');
        if(!page_num) return;
        var is_load_more = $(this).find("li:last").offset().top - $(this).scrollTop() < $(this).height();
        if(is_load_more){
            if(is_loading) return;  
            is_loading = true;    
            $('.popup.change_cover .loading').show();
            var param = {list_id:list_id, username:username, page_num:page_num};
            $.get("/get_list_items.json",param, function(res){
                $ul.removeAttr('next_ts');
                if(res.status_code && res.items){
                    if(res.next_ts) $ul.attr('next_ts',res.next_ts);
                    var $tmpl = $("#tpl-list-item-cover")
                    var html = $(res.items).each(function(){
                        this.object.list_item_id = this.id; 
                        $tmpl.template(this.object).appendTo($ul)
                    });
                    $ul.attr('list_id', list_id);
                    $('.popup.change_cover .loading').hide();
                }
            }).always(function(){
                is_loading = false;
                $('.popup.change_cover .loading').hide();
            })
        }
    });

    function processMargin () {
        $(".stream > li:visible").each(function(index) {
            $(".ui-sortable-helper").find('figure > a').height($(".ui-sortable-helper").width());
        });
    }
    var orignal_item_ids = [],
    changed_item_ids = [];
    $("ol.stream.list-items").sortable({
        items: "li[tid]",
        tolerance: "intersect",
        forcePlaceholderSize: true,
        forceHelperSize: true,
        handle: ".figure-item figure > a",
        containment: "parent",
        helper: "clone",
        scroll: false,
        start: function(event, ui) {
            console.log(event)
            console.log(ui)
            orignal_item_ids = [];
            $("ol.stream > li[tid]").each(function() {
                orignal_item_ids.push($(this).attr("tid"));
            });
            ui.item.appendTo(ui.item.parent()); // move to last position, so it doesn't disturb float clear
            processMargin();
        },
        over: function(event, ui) {
            $(".ui-sortable-helper").offset({ top: ui.offset.top }).find('figure > a').height($(".ui-sortable-helper").width());
        },
        sort: function(event, ui) {
            $(".ui-sortable-helper").offset({ top: ui.offset.top }).find('figure > a').height($(".ui-sortable-helper").width());
        },
        change: function() {
            processMargin();
        },
        stop: function(event, ui) {
            processMargin();
            changed_item_ids = [];
            $("ol.stream > li[tid]").each(function() {
                changed_item_ids.push($(this).attr("tid"));
            });
            if (orignal_item_ids.join(",") == changed_item_ids.join(",")) return;

            var params = {
                lid: $("#summary").attr("lid"),
                loid: $("#summary").attr("loid"),
                thing_ids: changed_item_ids.join(","),
            };

            $.ajax({
                type: "post",
                url: "/organize_list_items.json",
                data: params,
                success: function(resp) {
                    if (resp.status_code == 1) {
                        //success
                    } else if (resp.message) {
                        alertify.alert(resp.message);
                    }
                }
            });
        }
    });

    $("ol.stream.list-items li[tid] button.delete").click(function() {
        var $btn = $(this), $li = $btn.closest('li')
        var payload = {
            lid: $("#summary").attr("lid"),
            loid: $("#summary").attr("loid"),
            tid: $li.attr('tid'),
        };
        if (!confirm("Do you want to remove this item from the collection?")) return false;
        var $next = $li.next(), $ol = $li.parent();
        $li.remove();
        $.post("/remove_item_from_list.json", payload).then(function(resp){
            if (resp.status_code == 1) {
            } else {
                alertify.alert(resp.message || "Something went wrong!");
                if ($next.length) $li.insertBefore($next);
                else $li.appendTo($ol);
            }
        }).fail(function() {
            alertify.alert("Failed to remove the item. Please try again later.")
            if ($next.length) $li.insertBefore($next);
            else $li.appendTo($ol);
        });
    });


    $("#lists").sortable({
        items: "li.vcard[lid]",
        helper: "clone",
        tolerance: "intersect",
        forcePlaceholderSize: true,
        forceHelperSize: true,
        handle: "figure, span.move",
        scroll:false,
        containment: false, //'parent',
        start: function(event, ui){
            ui.item.appendTo(ui.item.parent()); // move to last position, so it doesn't disturb float clear
        },
        over: function(event, ui){
            //$('.ui-sortable-helper').offset({top: ui.offset.top}).find('figure > a').height($(".ui-sortable-helper").width());
        },
        sort: function(event, ui){
            //$('.ui-sortable-helper').offset({top: ui.offset.top}).find('figure > a').height($(".ui-sortable-helper").width());
        },
        change: function(){
        },
        update: function(){
            var list_ids = '', oid=$("div.lists[oid]").attr('oid');
            $('.vcard[lid]').each(function(){
                var lid = $(this).removeAttr('style').attr('lid');
                if (lid != undefined) {
                    if (list_ids.length>0)
                        list_ids = list_ids + ','+lid;
                    else
                        list_ids = ''+lid;
                }
            });
            var param = { oid: oid, update_lists: list_ids };
            $.post("/organize_lists_new.xml",param, function(xml){
                if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                } else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                    alertify.alert($(xml).find("message").text());
                }
            }, "xml");
        }
    });

});
