/**
 * Fancy UI
 */
window.Fancy = {
	// Init function
	init: function() {
		Fancy.scrollToTop();
		Fancy.buttons();
		// Fancy.formTips();
		// Fancy.verifiedTips();
		// Fancy.privateTips();
		// Fancy.popupTips();
		// Fancy.usersAutoComplete();
		Fancy.validation();
		Fancy.notification();
		Fancy.usernameSyn();
		Fancy.changePass();
		Fancy.filter();
		Fancy.fieldFocus();
		Fancy.datePicker();
		// Fancy.customize();
		Fancy.selectAllFriends();

		// $('.live-chat .chat-set .text-rnd').each(function(){
		// 	var orginTxt = $(this).attr('placeholder');
		// 	if($(this).val()=='') $(this).addClass('placeholder').val(orginTxt).removeAttr('placeholder');
		// 	$(this).focus(function(){
		// 		if($(this).val()==orginTxt) $(this).val('').removeClass('placeholder');
		// 	});
		// 	$(this).blur(function(){
		// 		if($(this).val()=='') $(this).val(orginTxt).addClass('placeholder');
		// 	});
		// });
	},

	//  Scroll to top
	scrollToTop: function() {
		$("#scroll-to-top").hide();

        $(function () {
            var lastCheckTime = +(new Date());
            $(window).scroll(function () {
                if( lastCheckTime+1000> +(new Date()) ) return;
                lastCheckTime = +(new Date());
                if ( $(this).scrollTop() > 300) {
                    $("#scroll-to-top").fadeIn();
                    $('#header-new .live-chat').css('right', $('#scroll-to-top').width()+52+'px');
                } else {
                    $("#scroll-to-top").fadeOut();
                    $('#header-new .live-chat').css('right','11px');
                }
            });

            $(document.body).on('click', '#scroll-to-top', function () {
                $('body,html').animate({
                    scrollTop: 0
                }, 10);
                return false;
            });
        });
	},

	// Buttons
    buttons: function() {
        // Follow links
        $(document.body)
            .on({
                click : function(event) {
					console.log('clicked');
                    var $this = $(this), login_require = $this.attr('require_login'), url, following, params, tnode = getTextNode(this);

					if($this.attr('lid')) return;
                    event.preventDefault();

                    if (typeof(login_require) != undefined && login_require === 'true')  return require_login();
                    if ($this.hasClass('loading') || $this.hasClass('list_')) return;

                    $this.addClass('loading');

                    if (following=$this.hasClass('following')) {
                        url = '/delete_follow.xml';
                    } else {
                        url = '/add_follow.xml';
                    }

                    params = {}
                    var btnStr = gettext('Follow');
                    var btnFollowingStr = gettext('Following');

                    if ($this.attr('uid')) {
                        params['user_id'] = $this.attr('uid');
                    }
                    if ($this.attr('eid')) {
                        params['directory_entry_id'] = $this.attr('eid');
                    }
                    if ($this.attr('sid')) {
                        params['seller_id'] = $this.attr('sid');
                        if(following){
                            try{track_event('Following Store', {seller_id:params['seller_id']});}catch(e){}
                        }else{
                            try{track_event('Follow Store', {seller_id:params['seller_id']});}catch(e){}
                        }
                    }
                    if ($this.attr("lid") && $this.attr("loid")){
                        params.lid  = $this.attr('lid');
                        params.loid = $this.attr('loid');
                        url  = following ? '/unfollow_list.xml' : '/follow_list.xml';
                    }

                    // validate request params
                    if(!params.user_id && !params.directory_entry_id && !params.seller_id && !params.lid){
                        $this.removeClass('loading');
                        // bad request.
                        return;
                    }

                    var old_text, old_uid, old_style;

                    old_text = tnode.nodeValue;
                    if (following) {
                        if ($this.hasClass('btn-private') == false) {
                            tnode.nodeValue = ($this.attr('linktype')=='private')?'':btnStr;
                            old_style = $this.attr('style');
                            $this.removeClass('following').removeAttr('style');
                        }else{
                            tnode.nodeValue = gettext('Private');
                            old_uid = $this.attr('uid');
                            $this.removeClass('following').removeAttr('uid');
                        }
                    }
                    else {
                        tnode.nodeValue = btnFollowingStr;
                        $this.addClass('following');
                    }

                    var revert_button = function() {
                        if (following) {
                            if ($this.hasClass('btn-private') == false) {
                                tnode.nodeValue = old_text;
                                $this.addClass('following').attr('style', old_style);
                            }
                            else {
                                tnode.nodeValue = old_text;
                                $this.addClass('following').attr('uid', old_uid);
                            }
                        }
                        else {
                            tnode.nodeValue = old_text;
                            $this.removeClass('following');
                        }
                    };

                    if( $this.hasClass('_pending') ){
                        $this.removeClass('loading');
                        return;
                    }
                    
                    $.ajax({
                        type : 'post',
                        url  : url,
                        data : params,
                        dataType : 'xml',
                        success : function(xml){
                            var $xml = $(xml), $st = $xml.find('status_code');
                            if ($st.length && $st.text() == 1) {
                                if (!following) {
                                    if ($this.attr('linktype') == 'recommended') {
                                        // remove this recommended user from the list and add new recommendation
                                        // At first, get id list of shown items
                                        var shown_ids = '';
                                        $this.closest('ul,ol').find('.follow-link').each(function(){
                                            shown_ids += this.getAttribute('uid') + ',';
                                        });

                                        $.get('/_single_vcard.html?uids='+shown_ids, function(html){
                                            var $li = $this.parent('li');
                                            $li.delay(1000).fadeTo(500, 0.01, function(){ $li.html(html); }).fadeTo(250, 1);
                                        });
                                    }
                                }
                            }
                            else {
                                var $msg = $xml.find('message');
                                if ($msg.length) alert($msg.text());
                                revert_button();
                            }
                        },
                        error: function() {
                            alert(gettext('Please retry your request.'));
                            revert_button();
                        },
                        complete : function(){
                            $this.removeClass('loading');
                        }
                    });

                    return false;
                },
                mouseover : function(){
                    var $this = $(this), tnode = getTextNode(this);
                    var btnStr = gettext('Following');
                    if($this.hasClass('following') && tnode) {
                        $this.addClass('dimmed');
                        tnode.nodeValue = btnStr;
                    }
                },
                mouseout : function(){
                    var $this = $(this), tnode = getTextNode(this);
                    var btnStr = gettext('Following');
                    if($this.hasClass('following') && tnode) {
                        $this.removeClass('dimmed');
                        if ($this.hasClass('btn-private')) {
                            tnode.nodeValue = gettext('Private');
                        } else {
                            tnode.nodeValue = btnStr;
                        }
                    }
                }
            }, '.follow-user-link, .follow-link, .button.follow, a.follow.entry, a.follow');

        function getTextNode(el) {
            while (el = el.lastChild) {
                if (el.nodeType == 3 && el.nodeValue) return el;
            }
            return null;
        }
    },

	/**
	 * Form Tips
	 */
	// formTips: function() {
	// 	if($('.page-deal-create').length) {
	// 		$('.page-deal-create #content input[title]').tipsy({
	// 			trigger: 'focus',
	// 			gravity: 'n',
	// 			html: true
	// 		});
	// 	}
	// },

	// verifiedTips: function() {
	// 	$('.nickname span.ico-link[title]').tipsy({
	// 		trigger: 'hover',
	// 		gravity: 's',
	// 		html: true
	// 	});
	// },
	// privateTips: function() {
	// 	$('.vcard span.ico-private[title]').tipsy({
	// 		trigger: 'hover',
	// 		gravity: 's',
	// 		html: true
	// 	});
	// },

	/**
 	* Popup Tips
 	*/
	// popupTips: function() {
	// 	$('#new-category[title]').tipsy({
	// 		trigger: 'focus',
	// 		gravity: 's',
	// 		html: true
	// 	});
	// },

	/**
	 * Users auto complete
	//  */
	//  usersAutoComplete: function() {

	// 	if (!$("#users").length) {
	// 		return;
	// 	}

	// 	$.widget("ui.customautocomplete", $.extend({}, $.ui.autocomplete.prototype, {
	// 		_response: function(contents){
	// 			$.ui.autocomplete.prototype._response.apply(this, arguments);
	// 			$(this.element).trigger("autocompletesearchcomplete", [contents]);
	// 		}
	// 	}));


	// 	$("#users").customautocomplete({
	// 		minLength: 0,
	// 		source: "/search-users.json",
	// 		focus: function( event, ui ) {
	// 			$("#users").val( ui.item.username );
	// 			return false;
	// 		},
	// 		select: function( event, ui ) {
	// 			$("#users").val( ui.item.username ).attr('uid', ui.item.id );
	// 			return false;
	// 		}
	// 	});
  //       var $users = $("#users").data('autocomplete') || $("#users").data('uiCustomautocomplete');
	// 	$users._renderItem = function( ul, item ) {
	// 		return $( "<li></li>" )
	// 			.data( "item.autocomplete", item )
	// 			.append('<a><img style="max-width:30px;max-height:30px;" src="' + item.image_url + '" />'  + item.username + "<span>" + item.name + "</span>" + "</a>" )
	// 			.appendTo( ul );
	// 	};

	// 	$("#users").bind("autocompletesearchcomplete", function(event, contents) {
	// 		var users = $('#users');
	// 		if (contents.length === 0) {
	// 			users.removeClass("found");
	// 		}
	// 		else {
	// 			users.addClass("found");
	// 		}
	// 		$('#showpopup form').validate().element("#users");
	// 	});

	// },

	/**
	* Validation
	*/
	validation: function() {
		var $form = $('.sign #content form');
		if (!$form.length || !$form.validate) return;

		$form.validate({
			rules: {
				password: "required",
				username: "required",
				name: "required"
			},
			messages: {
				email: "Hmm, that doesn't look like a valid email address."
			}
		});
	},

	/**
	 * Notification
	 */
	notification: function() {
		$('.hide-notification').click(function(){
			$('.notification').slideToggle('slow');
		})
	},

	/* Username */
	usernameSyn : function(){
		var obj = $('input#username');
		if (obj.length){
			obj.keyup(function(){
				obj.next('.username').children('strong').html($('input#username').val().replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;"));
			})
		}
	},

	/**
	 * Setting - change password
	 */
	changePass: function() {
		$('#change-password').find('.pass-trigger').click( function() {
			$(this).hide();
			$(this).next('ul').animate({
				height: 100
			}, 400 );
			$(this).parent('#change-password').addClass('snp-expanded');
			return false;
		})
	},

	/**
	 * Fancy filter
	 */
	 filter: function() {
		var filter = $('#filter');
		var em = filter.find('h3 em');

		filter.click(function() {
			$(this).toggleClass("expanded");
		});

		filter.find('a').click(function(e) {
			em.html($(this).text());
			e.preventDefault();
		});
	 },

	fieldFocus: function () {
			var sfEls = document.getElementsByTagName("INPUT");
			for (var i=0; i<sfEls.length; i++) {
				if(sfEls[i].type != 'text') continue;
				sfEls[i].onfocus=function() {
					$(this).addClass('sffocus').parent().addClass("hastext");
				}
				sfEls[i].onblur=function() {
					this.className=this.className.replace(new RegExp(" sffocus\\b"), "");
				}

			}
	},

	datePicker: function () {
		if ($.fn.datepicker) $("#deal-end, #deal-start, #store_deal_expiration, #date_from, #date_to, #start_date, #end_date").datepicker();
	},

	// customize: function () {
	// 	$("#content div.customize .toggle").click(function() {
	// 		$(this).parents(".customize").addClass("opened");
	// 		return false;
	// 	});

	// 	$("#content div.customize .send").click(function() {
	// 		var show_featured_items = $('#content div.customize #show_featured_items').is(':checked');
	// 		var show_followed_adds = $('#content div.customize #show_followed_adds').is(':checked');
	// 		var show_shown_to_you = $('#content div.customize #show_shown_to_you').is(':checked');
	// 		var show_followed_fancyd = $('#content div.customize #show_followed_fancyd').is(':checked');

	// 		var selectedRow = $(this);
	// 		var param = {};
	// 		param['show_featured_items']=show_featured_items;
	// 		param['show_followed_adds']=show_followed_adds;
	// 		param['show_shown_to_you']=show_shown_to_you;
	// 		param['show_followed_fancyd']=show_followed_fancyd;

	// 		$.post("/update_timeline.xml",param,
	// 			function(xml){
	// 				if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
	// 					selectedRow.parents(".customize").removeClass("opened");
	// 					location.reload(false);

	// 				}
	// 				else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
	// 					alertify.alert($(xml).find("message").text());
	// 				}
	// 		}, "xml");
	// 		return false;
	// 	});
	// },


	/**
	 * Select all friends checkboxes
	 */
	selectAllFriends: function () {
		if (!$("#content .friends-list").length) {
			return;
		}

		var all = $("#all");
		var checkboxes = $("#content .friends-list ul input[type=checkbox]");
		var all_link = $("#content .friends-list .selected a");

		function toggleAll() {
			if (all.is(':checked')) {
				checkboxes.attr("checked", "checked");
			} else {
				checkboxes.removeAttr("checked", "");
			}
		}

		all_link.bind("click", function() {
			all.attr('checked', !all.is(':checked'));
			toggleAll();
			return false;
		});

		all.bind("click", function() {
			toggleAll();
		});

		checkboxes.bind("click", function() {

			var checked = $("#content .friends-list ul input[type=checkbox]:checked");

			if (checked.length === checkboxes.length) {
				all.attr("checked", "checked");
			} else {
				all.removeAttr("checked", "");
			}
		});
	}
};

// Cart popup layer
$(function(){
	Fancy.init();
});