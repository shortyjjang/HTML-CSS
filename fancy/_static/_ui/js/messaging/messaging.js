$(function(){

	var refreshTimer = null;
	var blockedUsers = {};

    function decorateUrl(url) {
        if (isAdmin) {
            if (url.indexOf('?') >= 0) {
		        return url + "&override&user_id="+viewerId;
            } else {
		        return url + "?override&user_id="+viewerId;
            }
        }
        return url;
    }

    function pushState(stateObj, title, url) {
        if (isStoreOnly) {
            url = "/merchant" + url;
            if (isAdmin) url = url + "?seller_id=" + viewerId;
        } else {
            if (isAdmin) url = url + "?override&user_id=" + viewerId;
        }
        window.history.pushState(stateObj, title, url);
    }

	function clearMessages(){
		$(".message-filed").find("div.msg, h4.start-date").remove();
	}

	function resetMessageInput(){
		$("._send_message").find("textarea.text").val("");	
		$("._send_message button.btn-send").attr('disabled','disabled');
	}

	function loadBlockedUser(){
		$.get(decorateUrl('/messages/blocked-users.json'), {}, function(res){
			if(res.blocked_users){
				$(res.blocked_users).each(function(){
					blockedUsers[this.user.id] = this;
				})				
			}
			setBlockStatus();
		})
	}

	function setBlockStatus(){
		var userId = $("#sidebar .msg-list li a.current").closest("li").attr("member_id");

		if(userId && $(".new-message .controller .dropdown").is(":visible")){
			if(blockedUsers[userId]){
				$(".new-message .controller .dropdown a._blockuser").removeClass("_block").addClass("_unblock").html('Unblock user');
			}else{
				$(".new-message .controller .dropdown a._blockuser").removeClass("_unblock").addClass("_block").html('Block user');
			}
		}
	}

	function addThread( thread, prepend ){
		var $list = $(".msg-list > ul");			
		var template = $list.find("script").html();
		var $li = $(template);
		if(!thread.last_message) return;

		var member = thread.members[0];
		var isSellerThread = !!member.seller;

		$li.attr('thread-id', thread.id).attr('is-admin-thread', thread.is_admin_thread).attr('is-seller-thread', isSellerThread).attr('is-customer-thread', thread.am_i_store).attr('member_id', thread.members[0].id);
		$li.attr('members', Array.prototype.slice.call($(thread.members).map(function(){ 
			var memberString = "<a href='/"+this.username+"' target='_blank'>"+(this.fullname||this.username)+"</a>";
			if(isSellerThread){
				memberString = "<a href='/shop/"+this.username+"' target='_blank'>"+this.seller.brand_name+"</a>";
			}
			else if(thread.am_i_store){
				if( this.is_vip){
					memberString += " <span class='label vip'>VIP</span>";
				}
				if( this.is_customer){
					memberString += " <span class='label customer'>Customer</span>";
				}
			}
			return memberString;
		})).join(", ") );

		$li.find("img").css('background-image',"url('"+(isSellerThread?member.seller.logo_image:member.image_url)+"')").end()
			.find("b.username").html( thread.is_admin_thread?"Fancy":(isSellerThread?member.seller.brand_name:(member.fullname||member.username))).end()
			.find("span.message").html( thread.last_message.message).end()
			.find(".status .date").html( thread.last_message.sent_since).end();

		if( isStoreOnly ){
			if( member.is_customer) $li.find("b.username").addClass("customer");
		}else if( isSellerThread ){
			$li.addClass("store").find("b.username").addClass("store");
		}else if( thread.am_i_store ){
			$li.find("b.username").addClass("store");
		}

		if(thread.last_message.attachments.length){
			if(thread.last_message.attachments[0].name.match(/\.(?:png|jpg|jpeg|gif)$/i)){
				$li.find("span.message").html("(Image)");
			}else{
				$li.find("span.message").html("(Attachment)");
			}
		}

		if(thread.last_message.things && thread.last_message.things.length){
			$li.find("span.message").html(thread.last_message.things[0].name);
		}

		if(thread.unread_count > 0){
			$li.find(".new").show().end().addClass('unread');
		}else if(thread.last_message.from.id == viewerId){
			$li.find("span.message").html('You: '+ $li.find("span.message").html());
		}	

		if(prepend){
			$li.prependTo($list);
		}else{
			$li.appendTo($list);
		}
		
		return $li;
	}

	function addSearchResult( result, q ){
		var thread = result.thread;
		var messages = result.messages;
		var message = null;
		var prev_message = null;
		var next_message = null; 
		$(messages).each(function(){
			if(this.is_search_result) message = this;
		})
		if(!message) return;

		$(messages).each(function(){
			if(this.id < message.id) prev_message = this;
			if(this.id > message.id) next_message = this;
		})		

		var $li = addThread(thread);
		var regexp = new RegExp("("+q+")", "i");
		$li.attr('message-id', message.id);
		$li.find("img").css('background-image',"url('"+message.from.image_url+"')").end()
			.find("b.username").html( message.from.fullname || message.from.username).end()
			.find("span.message").addClass("focusline").html( message.message.replace(regexp, "<b class='highlight'>$1</b>")).end()
			.find(".status .date").html(message.sent_since).end();

		if(message.attachments.length){
			if(message.attachments[0].name.match(/\.(?:png|jpg|jpeg|gif)$/i)){
				$li.find("span.message").html("(Image)");
			}else{
				$li.find("span.message").html("(Attachment)");
			}
		}		


		if(prev_message){
			var $prev = $("<span class='message otherline'>"+prev_message.message+"</span>");
			if(prev_message.attachments.length){
				if(prev_message.attachments[0].name.match(/\.(?:png|jpg|jpeg|gif)$/i)){
					$prev.html("(Image)");
				}else{
					$prev.html("(Attachment)");
				}
			}		
			$prev.insertBefore( $li.find("span.message.focusline") );			
		}
		if(next_message){
			var $next = $("<span class='message otherline'>"+next_message.message+"</span>");
			if(next_message.attachments.length){
				if(next_message.attachments[0].name.match(/\.(?:png|jpg|jpeg|gif)$/i)){
					$next.html("(Image)");
				}else{
					$next.html("(Attachment)");
				}
			}		
			$next.insertAfter( $li.find("span.message.focusline") );		
		}

		return $li;
	}

	var nextPage;
	var _archived = false;
	var limit = 50;
	var isLoading = false;

	function refreshThreadList( archived, selectedThreadId, selectThreadAfterRefresh, isUpdate){
		var url = decorateUrl('/messages/retrieve-threads.json?count='+limit+'&page=1&archived='+(archived?'true':'false')+"&seller="+(isStoreOnly?'true':'false'));
		var $list = $("#sidebar .msg-list");

		if( !isUpdate && $list.find(".search-result").is(":visible")){
			clearSearch();
			startThreadPolling();
		}

		isLoading = true;

		$.get(url, function(res){
			$list.removeClass("loading");
			isLoading = false;
			if( !$("a.threads.current")[0] ) return;

			var validThreads = [];
			$(res.threads).each(function(){
				if(isStoreOnly && this.am_i_store) validThreads.push(this);
				else if( !isStoreOnly && !this.am_i_store) validThreads.push(this);
			})

			var threads = validThreads;
			var $ul = $list.find("> ul");

			if(!isUpdate){
				nextPage = res.next_page;

				if(!validThreads.length){
					$list.addClass("empty").find("> p").css('display','table-cell');
					return;
				}
				
			}

			$ul.show().find("li").addClass("_mark_delete");
			$list.removeClass("empty").find("> p").hide();
			
			$(threads).each(function(){
				var $li = addThread(this, false);
				$ul.find("li._mark_delete[thread-id="+this.id+"]").remove();
			})

			if(!isUpdate){
				$ul.find("li._mark_delete").remove();
			}

			if(!$ul.find("li:visible").length)
				$list.addClass("empty").find("> p").css('display','table-cell');

			if(selectedThreadId){
				$ul.find(" > li[thread-id="+selectedThreadId+"] > a").addClass("current");
				if( !$ul.find(" > li[thread-id="+selectedThreadId+"] > a.current").is(":visible") ){
					$("#sidebar a.threads[type]").not(".current").click();					
				}
			}

			_archived = archived;
			$list.off('scroll').on('scroll', function(e){
				var scrollTop = $list.scrollTop();
				var scrollHeight = $list[0].scrollHeight;
				if(scrollTop > scrollHeight - $list.height() - 100 ){
					loadMoreThreadList();
				}
			});

			if(selectedThreadId && selectThreadAfterRefresh){
				selectThread(selectedThreadId);
			}
		});	

		
		if(!selectedThreadId && !$(".new-message fieldset.to").is(":visible")){
			$("#content .new-message")
				.find(" h3").html("").show().end()
				.find("div.controller").show().end()
				.find("fieldset.to").hide().end()
				.find("._send_message").addClass("disabled").end();
			clearMessages();
			$("#content .controller .dropdown").hide();
			$(".messaging").removeClass('detail');
		}

		$("#sidebar ul.sort li > a").removeClass("current");
		
		if(archived){
			$("#sidebar ul.sort li.archive > a").addClass("current");
			$("#content .controller .dropdown li").hide().filter("._archived").show();
		}else{
			$("#sidebar ul.sort li.inbox > a").addClass("current");
			$("#content .controller .dropdown li").hide().filter("._inbox").show();
		}
	}

	function loadMoreThreadList(){
		if(nextPage>1 && !isLoading){
			isLoading = true;
			var url = decorateUrl('/messages/retrieve-threads.json?count='+limit+'&page='+nextPage+'&archived='+(_archived?'true':'false')+"&seller="+(isStoreOnly?'true':'false'));
			var $list = $("#sidebar .msg-list");

			$.get(url, function(res){
				isLoading = false;
				var validThreads = [];
				$(res.threads).each(function(){
					if(isStoreOnly && this.am_i_store) validThreads.push(this);
					else if( !isStoreOnly && !this.am_i_store) validThreads.push(this);
				})
				nextPage = res.next_page;
				var threads = validThreads;

				$(threads).each(function(){
					addThread(this, false);
				})
			});	
		}
	}

	function addMessage( message, setPreview, scrollToLast, prepend){
		var $list = $(".message-filed");

		if( $list.find("[message-id="+message.id+"]").length) return;

		var template = $list.find("#message_template").html();

		var $lastMessage = $list.find("div.msg:last");
		if(prepend){
			$lastMessage = $list.find("div.msg:first");
		}
		var lastDate = new Date($lastMessage.attr('ts')*1000);
		var currentDate = new Date(message.sent_at*1000);
		var isSellerThread = $(".msg-list > ul > li > a.current").closest("li").attr("is-seller-thread") && message.from.seller;
		
		if(lastDate.getDate()!= currentDate.getDate()){
			if(prepend){
				$("<h4 class='start-date'><b>"+$.datepicker.formatDate("MM dd, yy", currentDate)+"</b></h4>").prependTo($list);
			}else{
				$("<h4 class='start-date'><b>"+$.datepicker.formatDate("MM dd, yy", currentDate)+"</b></h4>").appendTo($list);
			}
		}

		function getTimeText(timestamp){
			var date = new Date(timestamp);
			var hour = date.getHours();
			var min = date.getMinutes();
			var amPm = "am";
			if(hour>12){
				hour-=12;
				amPm = "pm";
			}
			var hm = hour+":"+(min<10?"0":"")+min+amPm;

			return hm +  "<em>Sent "+$.datepicker.formatDate("MM dd", date)+", "+hm+"</em>";
		}

		var messagecontent = message.message.replace(/\n/g,"<br/>");
		
		var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
		var urls = messagecontent.match(exp);
		$(urls).each(function(i,v){
			messagecontent = messagecontent.replace(v, "##URL"+i+"##");
		});
		$(urls).each(function(i,v){
			messagecontent = messagecontent.replace("##URL"+i+"##", "<a href='"+v+"' target='_blank'>"+v+"</a>");
		});

		var $item = $(template);
		$item.attr('message-id', message.id)
			.attr('ts', message.sent_at)
			.attr('from', message.from.id)
			.addClass('msg').find("img").css('background-image',"url('"+(isSellerThread?message.from.seller.logo_image:message.from.image_url)+"')").end()
			.find("a").attr("href","/"+(isSellerThread?'shop/':'')+message.from.username).end()
			.find("b.username").html( isSellerThread?message.from.seller.brand_name:(message.from.fullname||message.from.username) ).end()
			.find("div.message > span").html(messagecontent).end()
			.find(".status .date").html(getTimeText(message.sent_at*1000)).end();


		if( isSellerThread){
			$item.addClass("store").find("b.username").addClass("store");
		}

		if(viewerId != message.from.id){
			$item.addClass("user");
			if( isStoreOnly && message.from.is_customer)  $item.find("a.info").addClass('customer');
		}
		if(messagecontent == '' || messagecontent == ' ') {
			if(message.attachments && message.attachments.length){
			}else if(message.things && message.things.length){
			}else{
				$item.hide();
			}
		}

		// add attachments
		if(message.attachments && message.attachments.length){
			$(message.attachments).each(function(){
				if(this.name.match(/\.(?:png|jpg|jpeg|gif)$/i)){
					var $img = $("<div class='attached loading'><a href='#' onclick='openAttached(\""+this.url+"\");return false;'><img src='"+this.url+"?thumb'/></a></div>");
					$($item).addClass('file').find(".message").before($img);
					$img.find("img").load(function(){
						$(this).closest("div").removeClass("loading");						
					}).end().append('<small class="status"><span class="date">'+getTimeText(message.sent_at*1000)+"</span></small>");					
				}else{
					$($item).find("div.message").find('span:eq(1)').html("<a href='"+this.url+"' target='_blank' class='file'>"+this.name+"</a>");
				}
				if(messagecontent == '' || messagecontent == ' ') {
                    $item.addClass('none');
                }
				
			});			
		}

		// add thing cards
		if(message.things && message.things.length){
			var thingCardTemplate = $("#thing_card_template").html();
			$(message.things).each(function(){
				if(!this.name) return;
				var $card = $(thingCardTemplate);
				if(message.message) $card.addClass("none");
				$card.find("figure, span.figure").css('background-image', 'url('+this.image_url+')').end()
					.find("a").attr('href', this.url).end()
					.find("a.title").html(this.name).end();
				if( this.sales ){
					$card.find("span.price").show().html("$" + this.sales[0].fancy_price);
				}else{
					$card.find("span.username > i").hide();
				}
				if(this.user){
					$card.find("span.username > a").attr("href","/"+this.user.username).html((this.user.fullname||this.user.username));
				}
				if(this.fancys){
					$card.find("span.username > span").html("+ "+this.fancys);
				}
				$card.insertBefore( $item.find(".message") );
				$item.addClass('figure');
				if(messagecontent == '' || messagecontent == ' ') {
                    $item.addClass('none');
                }
			})
		}

		if(prepend){
			$item.prependTo($list);
		}else{
			$item.appendTo($list);
		}
		if( $item.prev().attr("from") == message.from.id){
			$item.addClass("continue");
			$item.prev().addClass("hasnext");
		}
		
		if(setPreview){
			var msg = message.message;
			if(message.attachments.length){
				if(message.attachments[0].name.match(/\.(?:png|jpg|jpeg|gif)$/i)){
					msg = "(Image)";
				}else{
					msg = "(Attachment)";
				}
			}
			$(".msg-list > ul > li[thread-id="+message.thread+"] > a span.message").html("You: "+msg);
		}
		if(scrollToLast){
			$(".message-filed").scrollTop( 999999 );
		}			

		$item.find(".status .date").hover(function(){
			$(this).find('em').css('margin-left',-($(this).find('em').width()/2)-11+'px');
		});

	}
	
	function addNewThread(thread){
		var $list = $(".msg-list > ul");
		if($list.find("[thread-id="+thread.id+"]").length) return;

		addThread(thread, false);
	}
	
	var loadingMessages = false;
	function selectThread( threadId, messageId){
		function refreshMessages( messages ){
			clearMessages();

			$(messages).each(function(){
				addMessage(this, false, !messageId);
			})

			if(messageId){
				if($("div.message-filed div.msg[message-id="+messageId+"]")[0]){
					$("div.message-filed div.msg[message-id="+messageId+"]")[0].scrollIntoView();
				}
			}
		}

		if(refreshTimer) clearInterval(refreshTimer);

		var $list = $(".msg-list > ul");
		$list.find("li > a.current").removeClass("current");
		var $li = $list.find("li[thread-id="+threadId+"] > a").addClass("current").closest("li");
		var isAdminThread = ($li.attr('is-admin-thread')=='true');

		if($li.length){
			$li.find(".new").hide();
			$("#content .new-message")
				.find(" h3").html($li.attr("members")).show().end()
				.find("div.controller").show().end()
				.find("fieldset.to").hide().end()
				.find("._send_message").removeClass("disabled").end();

			if( isAdminThread ){
				$("#content .new-message")
				.find(" h3").html('Fancy').end()
				.find("div.controller").hide().end()
				.find("._send_message").addClass("disabled").end();
			}
			
			$("#content .controller .dropdown").show();
			var params = {thread_id:threadId};
			if(messageId){
				params.since_id = messageId-1;
				params.limit = 999999;
			}
			loadingMessages = true;
			$.get(decorateUrl('/messages/retrieve-messages.json'), params, function(res){
				loadingMessages = false;
				var checkThreadId = $("#sidebar .msg-list li a.current").closest("li").attr("thread-id");
				if(threadId!=checkThreadId) return;

				refreshMessages(res.messages);

				refreshTimer = setInterval(retrieveNewMessages,30000);
			});
			pushState({page:"thread",threadId:threadId}, "Fancy - Messages #"+threadId , "/messages/"+threadId);
		}else{
			$("#content .new-message")
				.find(" h3").hide().end()
				.find("div.controller").hide().end()
				.find("fieldset.to").hide().end()
				.find("._send_message").addClass("disabled").end();
			
			clearMessages();
			pushState({page:"index"}, "Fancy - Messages ", "/messages");
		}
		$(".messaging").addClass('detail');
		setBlockStatus();
	}

	$(".message-filed").scroll(function(e){
		if(loadingMessages) return;
		var scrollTop = $(this).scrollTop();
		if(scrollTop < 200 ){
			var $firstMessage = $(".message-filed div.msg:first");
			if( $firstMessage.attr("last") ) return;
			loadingMessages = true;
			var threadId = $(".msg-list > ul > li > a.current").closest("li").attr("thread-id");
			var firstId = $firstMessage.attr("message-id");

			var params = {thread_id:threadId, max_id:firstId};
			$.get(decorateUrl('/messages/retrieve-messages.json'), params, function(res){
				loadingMessages = false;
				var checkThreadId = $("#sidebar .msg-list li a.current").closest("li").attr("thread-id");
				if(threadId!=checkThreadId) return;

				if(!res.messages.length){
					$(".message-filed div.msg:first").attr("last", true);
				}else{
					$(res.messages.reverse()).each(function(){
						addMessage(this, false, false, true);
					})

					$(".message-filed div.msg[message-id="+firstId+"]")[0].scrollIntoView();
				}
			});
		}
	});

	function retrieveNewMessages(){
		var threadId = $(".msg-list > ul > li > a.current").closest("li").attr("thread-id");
		var lastId = $(".message-filed div.msg:last").attr("message-id");

		if(!threadId) return;
		var param = {thread_id:threadId};
		if( lastId ) param.since_id = lastId;
		$.get(decorateUrl('/messages/retrieve-messages.json'), param, function(res){
			$(res.messages).each(function(){
				addMessage(this, false, true);
			})				
		});
	}

	var isSending = false;
	function sendMessage( userId, sellerId, threadId, message, thingIds, asStore ){
		if(isSending) return;

		isSending = true;
		var params = {as_store:asStore};
		if(threadId)
			params.thread_id = threadId;
		if(userId)
			params.user_id = userId;
		if(sellerId)
			params.seller_id = sellerId;
		if(thingIds && thingIds.length)
			params.things = thingIds.join(",");
		if(message)
			params.message = message;

		if(!threadId && !userId && !sellerId){
            isSending = false
			alertify.alert("Please select recipient.");
			$("._send_message .btn-send").removeAttr('disabled');
			return;
		}

		if(message && message.length>2048){
			isSending = false;
			$("._send_message .btn-send").removeAttr('disabled');
			alertify.alert("Sorry, message is too long. Please write less than 2048 characters.");
			return;
		}

		retrieveNewMessages();
		$.post(decorateUrl("/messages/send-message.json"), params, function(res){
			$("._send_message .btn-send").removeAttr('disabled');
			if(!res.status_code){
				alertify.alert(res.message || "Failed to send a message.");
				return;
			}else{
				if(threadId){
					addMessage(res.message, true, true);
					refreshThreadList(false, threadId, false);
				}else if(userId || sellerId){
					res.thread.last_message = res.message;
					$(".to").find('.selected').hide().end().find('.label.customer').hide().end().find('.userlist').show();
					addNewThread(res.thread);
					$("#sidebar > .user-type > ul > li > a[type=friend]").click();
					refreshThreadList(false, res.thread.id, true);					
				}
				resetMessageInput();
			}
		})
		.always(function(){
			isSending = false;
		});
        try { track_event("Send Message", { type: (thingIds && thingIds.length) ? "Thing" : "Text" }); } catch (e) {}
	}

    function findUser(username){
        var fn = arguments.callee;

        function search(username){
            if(fn.xhr) { try { fn.xhr.abort(); } catch(e) { } }
            var xhr = $.get(decorateUrl('/search-users.json'), {term:username,limit:15,filter_messages_permission:true},function(json) {
                var $ul = $('div.userlist .listing > ul');
                $ul.find("li").remove();
                var template = $ul.find("script").html();
                if(json.length){
                    for(var i=0,c=json.length; i < c; i++){
                        var $item = $(template);
                        if(json[i].messages_permission){
                            $item.find("b.fullname").html((json[i].fullname||json[i].username)).end()
                                .find("span.username").html(json[i].username).end()
                                .find("img").css('background-image',"url('"+json[i].image_url+"')").end()
                                .data('uid', json[i].id);
                            $item.appendTo($ul);
                        }
                    }
                }
                if( !$ul.find("li").length ){
                    $ul.append('<li class="empty">No users found</li>');
                }
                $('div.userlist').addClass("opened");				
            });
            fn.xhr = xhr;
		    $('div.userlist').removeClass("opened");
		}
        if(username && username.length > 1) {
            search(username);
        }
	}

    function cancelFindUser(){
        var fn = findUser;
        if(fn.xhr) { try { fn.xhr.abort(); } catch(e) { } }
    }

	function selectUser(fullname, uid, isSeller){
		$("fieldset.to span.selected").find("span").html(fullname).end()
			.attr( (isSeller?"sid":"uid"), uid)
			.show();
        if(send_as_seller) {
            $("fieldset.to span.label.customer").show();
        }
		$("._send_message").removeClass("disabled");
		
		$('div.userlist').hide().find("input:text").val('');
	}

	function archieve(thread_id){
		$.post(decorateUrl("/messages/archive-thread.json"), {thread_id:thread_id}, function(res){
			refreshThreadList(false);
			pushState({page:"index"}, "Fancy - Messages ", "/messages");
		});
		$("._send_message").addClass("disabled");
	}

	function unarchieve(thread_id){
		$.post(decorateUrl("/messages/unarchive-thread.json"), {thread_id:thread_id}, function(res){
			refreshThreadList(false, thread_id);
		});
	}

	function blockUser(userId){
		$.post(decorateUrl("/messages/block-user.json"), {target_user_id:userId}, function(res){
			if(res.status_code){
				blockedUsers[userId] = {};
				setBlockStatus();
			}
		});
	}

	function unblockUser(userId){
		$.post(decorateUrl("/messages/unblock-user.json"), {target_user_id:userId}, function(res){
			if(res.status_code){
				delete blockedUsers[userId];
				setBlockStatus();
			}			
		});
	}

	var searchTimer = null;
	var searchAjax = null;
	function search(q){
		if(searchTimer) clearTimeout(searchTimer);
		pauseThreadPolling();
		$("a.threads.current").removeClass("current");
		var $list = $(".msg-list");
		$list.addClass("loading").find(">p,>div,>ul").hide();
		$(".msg-list > ul > li").remove();
			
		searchTimer = setTimeout(function(){
			if(searchAjax) searchAjax.abort();
			searchAjax = $.get(decorateUrl('/messages/search.json'), {q:q}, function(res){
				$list.removeClass("loading");
				if(res.status_code && res.results.length){
					$list.find("> .search-result").show().html("Displaying "+res.results.length+" results for <b>"+q+"</b>");
					$list.find(">ul").show();
					$(res.results).each(function(){
						addSearchResult(this, q);
					})
				}else{
					$(".msg-list > .search-result").show().html("<p>We couldn't find any result for <b>"+q+"</b>.<br>Try searching for different term?</p>");
				}
			})	
		},200);
	}

	function clearSearch(){		
		if(searchTimer) clearTimeout(searchTimer);
		if(searchAjax) searchAjax.abort();
		$("#sidebar .search [name=q]").val('');
		$(".msg-list .search-result").hide();
		$(".msg-list ul li").remove();
	}

	$(".msg-list > ul").delegate("a", "click", function(e){
		e.preventDefault();
		var threadId = $(this).closest("li").attr("thread-id");
		var messageId = $(this).closest("li").attr("message-id");

		if( $(this).hasClass("current") ){
			if(messageId){
				if( $("div.message-filed div.msg[message-id="+messageId+"]")[0] ){
					$("div.message-filed div.msg[message-id="+messageId+"]")[0].scrollIntoView();
				}
			}
			return;
		}
		
		selectThread(threadId, messageId);
	});

	function procSendMessage(e){
		e.preventDefault();
		$(this).attr('disabled','disabled');
		var userId = $(".new-message fieldset.to span.selected:visible").attr('uid');
		var sellerId = $(".new-message fieldset.to span.selected:visible").attr('sid');
		var threadId = null;
		var asStore = false;
        try {
            asStore = send_as_seller;
        } catch(e) {
        }
		if(!userId && !sellerId){
			threadId = $(".msg-list > ul > li > a.current").closest("li").attr("thread-id");
			asStore = $(".msg-list > ul > li > a.current").closest("li").attr("is-customer-thread")=='true';
		}
		var message = $("._send_message textarea.text").val();
		if(!message){
			alertify.alert("Please input message");
			$("._send_message .btn-send").attr('disabled','disabled');
			$("._send_message textarea.text").focus();
			return;
		}
		sendMessage(userId, sellerId, threadId, message, null, asStore );
	}


	// share thing layer
	var ShareThing = {
		$el : $(".popup.share_items"),
		template : $(".popup.share_items script").html(),
		url : "/"+username+"/fancyd.json",
		searchTimer: null,
		loadAjax:null,
		isLoading:false,
		init : function(){
			var self = this;
			this.$el.find(".btn-cancel").click(function(){self.close()});
			this.$el.find(".btn-send").attr('disabled','disabled').click(function(){self.send()});
			this.$el.find(".search input:text").keyup(function(){
				var q = $(this).val();
				self.search(q);
			});
			this.$el.find(".item-list").delegate('input:checkbox','change',function(){
				if(this.checked){
					$(this).closest("li").addClass("selected");
					self.$el.find(".btn-send").removeAttr('disabled');
				}else{
					$(this).closest("li").removeClass("selected");
					if(!self.$el.find("li.selected").length){
						self.$el.find(".btn-send").attr('disabled','disabled');
					}
				}
				
			});
			this.$el.find(".item-list").scroll(function(e){
				var $list = self.$el.find(".item-list");
				var scrollTop = $list.scrollTop();
				var scrollHeight = $list[0].scrollHeight;
				if(scrollTop > scrollHeight - $list.height() - 100 ){
					self.load();
				}
			});
		},		
		open : function(){
			this.$el.find(".search input:text").val('');
			this.loadRecentFancyd();
			$.dialog('share_items').open();
		},
		loadRecentFancyd: function(){
			this.$el.find(".item-list > li").remove();
			this.url = "/"+username+"/fancyd.json";
			this.$el.find(".item-list").addClass("loading");
			this.load();
		},
		search: function(q){
			var self = this;
			if(this.searchTimer) clearTimeout(this.searchTimer);
			this.searchTimer = setTimeout(function(){
				if(!q){
					self.loadRecentFancyd();
					return;
				}
				self.$el.find(".item-list > li").remove();
				self.url = "/search.json?q="+q;
				if(self.loadAjax) self.loadAjax.abort();
				self.isLoading = false;
				self.$el.find(".item-list").addClass("loading");
				self.load();
			},300);			
		},
		load: function(){
			var self = this;
			
			if(!this.url){
				self.$el.find(".item-list").removeClass("loading");
				self.isLoading = false;
				return;
			}
			if(this.isLoading) return;
			if(this.loadAjax) this.loadAjax.abort();
			this.isLoading = true;			
			
			if( !this.$el.find(".item-list").hasClass("loading")){
				$("<li class='loading'></li>").appendTo(this.$el.find(".item-list"));
			}
			this.loadAjax = $.get(this.url, function(res){
				if(res.things && res.things.length){
					$(res.things).each(function(){
						self.addThing(this);
					})
					if(res.next_ts){
						self.url = "/"+username+"/fancyd/"+res.next_ts+".json";
					}else if(res.next_page_num){
						if(self.url.indexOf("&pg=") > -1){
							self.url = self.url.replace(/&pg=.*/,"&pg="+res.next_page_num);
						}else{
							self.url = self.url+"&pg="+res.next_page_num;
						}						
					}else{
						self.url = null;
					}
				}else{
					if( !self.$el.find(".item-list li").not("loading").length ){
						var q = self.$el.find(".search input:text").val();
						if(q){
							$("<li class='empty'><p>We couldn't find any result for <b>"+q+"</b>.<br>Try searching for different term?</p></li>").appendTo(self.$el.find(".item-list"));
						}else{
							$("<li class='empty'><p>You didn't fancy'd any things.<br>Try searching for different term?</p></li>").appendTo(self.$el.find(".item-list"));
						}
					}
				}
			}).always(function(){
				self.$el.find(".item-list").removeClass("loading");
				self.$el.find(".item-list li.loading").remove();
				self.isLoading = false;
			})
		},
		addThing: function(obj){
			var $item = $(this.template);
			$item.find("input:checkbox").attr("id", "thing_"+(obj.id||obj.thing_id)+"").val((obj.id||obj.thing_id)+"").end()
				.find("label").attr("for", "thing_"+(obj.id||obj.thing_id)+"").end()
				.find("img").css('background-image', 'url('+(obj.thumbnail||obj.thumb_image_url)+')').attr('alt', obj.name).attr('title', obj.name).end();
			$item.appendTo(this.$el.find(".item-list"));
		},
		close:function(){
			$.dialog('share_items').close();
		},
		send:function(){
			var thingIds = Array.prototype.slice.call($($(".item-list input:checkbox:checked").serializeArray()).map(function(){ return this.value}));
			var userId = $(".new-message fieldset.to span.selected:visible").attr('uid');
			var sellerId = $(".new-message fieldset.to span.selected:visible").attr('sid');
			var threadId = null;
			var asStore = false;
			if(!userId && !sellerId){
				threadId = $(".msg-list > ul > li > a.current").closest("li").attr("thread-id");
				asStore = $(".msg-list > ul > li > a.current").closest("li").attr("is-customer-thread")=='true';
			}
			sendMessage(userId, sellerId, threadId, null, thingIds, asStore);
			this.close();
		}
	}

	if(isStoreOnly){
		ShareThing = {
			$el : $(".popup.share_items"),
			template : $(".popup.share_items script").html(),
			url : "/rest-api/v1/seller/"+viewerId+"/products/",
			searchTimer: null,
			loadAjax:null,
			isLoading:false,
			init : function(){
				var self = this;
				this.$el.find(".btn-cancel").click(function(){self.close()});
				this.$el.find(".btn-send").attr('disabled','disabled').click(function(){self.send()});
				this.$el.find(".search input:text").keyup(function(){
					var q = $(this).val();
					self.search(q);
				});
				this.$el.find(".item-list").delegate('input:checkbox','change',function(){
					if(this.checked){
						$(this).closest("li").addClass("selected");
						self.$el.find(".btn-send").removeAttr('disabled');
					}else{
						$(this).closest("li").removeClass("selected");
						if(!self.$el.find("li.selected").length){
							self.$el.find(".btn-send").attr('disabled','disabled');
						}
					}
					
				});
				this.$el.find(".item-list").scroll(function(e){
					var $list = self.$el.find(".item-list");
					var scrollTop = $list.scrollTop();
					var scrollHeight = $list[0].scrollHeight;
					if(scrollTop > scrollHeight - $list.height() - 100 ){
						self.load();
					}
				});
			},		
			open : function(){
				this.$el.find(".search input:text").val('');
				this.loadRecentFancyd();
				$.dialog('share_items').open();
			},
			loadRecentFancyd: function(){
				this.$el.find(".item-list > li").remove();
				this.url = "/rest-api/v1/seller/"+viewerId+"/products/",
				this.$el.find(".item-list").addClass("loading");
				this.load();
			},
			search: function(q){
				var self = this;
				if(this.searchTimer) clearTimeout(this.searchTimer);
				this.searchTimer = setTimeout(function(){
					if(!q){
						self.loadRecentFancyd();
						return;
					}
					self.$el.find(".item-list > li").each(function(i, item) {
		                if (q && $(item).find("img").attr('title').toLowerCase().indexOf(q.toLowerCase()) < 0) {
		                    $(item).hide();
		                } else {
		                    $(item).show();
		                }
		            });
				},300);			
			},
			load: function(){
				var self = this;
				
				if(!this.url){
					self.$el.find(".item-list").removeClass("loading");
					self.isLoading = false;
					return;
				}
				if(this.isLoading) return;
				if(this.loadAjax) this.loadAjax.abort();
				this.isLoading = true;			
				
				if( !this.$el.find(".item-list").hasClass("loading")){
					$("<li class='loading'></li>").appendTo(this.$el.find(".item-list"));
				}
				this.loadAjax = $.get(this.url, function(res){
					if(res.products && res.products.length){
						$(res.products).each(function(){
							self.addThing(this);
						})
						if(res.current_page < res.max_page){
							self.url = "/rest-api/v1/seller/"+viewerId+"/products/?page="+(res.current_page+1);
						}else{
							self.url = null;
						}
					}else{
						if( !self.$el.find(".item-list li").not("loading").length ){
							var q = self.$el.find(".search input:text").val();
							if(q){
								$("<li class='empty'><p>We couldn't find any result for <b>"+q+"</b>.<br>Try searching for different term?</p></li>").appendTo(self.$el.find(".item-list"));
							}else{
								$("<li class='empty'><p>You didn't fancy'd any things.<br>Try searching for different term?</p></li>").appendTo(self.$el.find(".item-list"));
							}
						}
					}
				}).always(function(){
					self.$el.find(".item-list").removeClass("loading");
					self.$el.find(".item-list li.loading").remove();
					self.isLoading = false;
				})
			},
			addThing: function(obj){
				var $item = $(this.template);
				$item.find("input:checkbox").attr("id", "thing_"+obj.thing_id_str+"").val(obj.thing_id_str).end()
					.find("label").attr("for", "thing_"+obj.thing_id_str).end()
					.find("img").css('background-image', 'url('+obj.image_url+')').attr('alt', obj.title).attr('title', obj.title).end();
				$item.appendTo(this.$el.find(".item-list"));
			},
			close:function(){
				$.dialog('share_items').close();
			},
			send:function(){
				var thingIds = Array.prototype.slice.call($($(".item-list input:checkbox:checked").serializeArray()).map(function(){ return this.value}));
				var userId = $(".new-message fieldset.to span.selected:visible").attr('uid');
				var sellerId = $(".new-message fieldset.to span.selected:visible").attr('sid');
				var threadId = null;
				var asStore = false;
				if(!userId && !sellerId){
					threadId = $(".msg-list > ul > li > a.current").closest("li").attr("thread-id");
					asStore = $(".msg-list > ul > li > a.current").closest("li").attr("is-customer-thread")=='true';
				}
				sendMessage(userId, sellerId, threadId, null, thingIds, asStore);
				this.close();
			}
		}
	}
	ShareThing.init();

	if( $.jStorage.get('auto_send_message') ){
		$('._send_message .auto-message').addClass('checked').find("#auto_send_message").prop('checked',true);
	}

	$("._send_message #auto_send_message").on('click', function(){
		$(this).closest('.auto-message').toggleClass('checked');
		$.jStorage.set('auto_send_message', $(this).closest('.auto-message').hasClass('checked') );
	});

	$("._send_message .btn-send").on("click", procSendMessage);

	$("._send_message textarea.text").on("focus", function(){
		$(this).closest('.text_box').addClass('focus');
	});

	$("._send_message textarea.text").on("blur", function(){
		$(this).closest('.text_box').removeClass('focus');
	});

	$("._send_message textarea.text").on("keydown", function(e){
		if( !e.altKey && !e.shiftKey && e.keyCode==13 && $("._send_message .auto-message").hasClass('checked')){
			e.preventDefault();
			if( !$("._send_message .btn-send").attr('disabled') ){
				$("._send_message .btn-send").click();
			}
		}
	});
	
	$("._send_message textarea.text").on("keyup", function(e){
		var text_limit = 2048-$(this).val().length;
		if (text_limit<0) {
			$(this).closest('._send_message').find('.byte').text(text_limit).addClass('error').removeClass('caution').end().find('.btn-send').attr('disabled','disabled');
		} else if (text_limit<11) {
			$(this).closest('._send_message').find('.byte').text(text_limit).addClass('error').removeClass('caution').end().find('.btn-send').removeAttr('disabled');
		} else if (text_limit<21) {
			$(this).closest('._send_message').find('.byte').text(text_limit).removeClass('error').addClass('caution').end().find('.btn-send').removeAttr('disabled');
		} else if (text_limit<49) {
			$(this).closest('._send_message').find('.byte').text(text_limit).removeClass('error').removeClass('caution').end().find('.btn-send').removeAttr('disabled');
		} else{
			$(this).closest('._send_message').find('.byte').text('').removeClass('error').removeClass('caution').end().find('.btn-send').removeAttr('disabled');
		}
		if( text_limit>0 && ( $(this).val() || $('._send_message .attached_file').is(":visible") )){
			$("._send_message button.btn-send").removeAttr('disabled');	
		}else{
			$("._send_message button.btn-send").attr('disabled','disabled');	
		}		
	});

	$('._send_message #add_file_input').bind('fileuploadadd', function (e, data) {
	  $.each(data.files, function (index, file) {
	  	var filename = file.name;
	  	if(filename.length > 20) filename = filename.substring(0,20) + "...";
	  	$('._send_message .attached_file').html('<i class="icon"></i> '+ filename).show().attr('title', file.name);
		$('._send_message .text').addClass('added');
		$("._send_message button.btn-send").removeAttr('disabled');	
	  	//$('._send_message .add_file').hide();
	  });
	});

	$('._send_message .attached_file').click(function(){
		$(this).hide().closest('.frm').find('.add_file').val('').end().find('.text').removeClass('added');
		$("._send_message .btn-send").off("click").on("click", procSendMessage);
		if(! $("._send_message textarea.text").val()){
			$("._send_message .btn-send").attr('disabled','disabled');	
		}
	});


	$('._send_message .share_file').click(function(e){
		e.preventDefault();
		ShareThing.open();
	});

	$('._send_message #add_file_input').fileupload({
		dataType: 'json',
	    url: decorateUrl('/messages/send-message.json'),
	    singleFileUploads: true,
	    maxNumberOfFiles: 1,
	    autoUpload: false,
	    add: function(e,data){
	         $("._send_message .btn-send").off("click").on("click",function(e2){
	         	if(isSending) return;
	         	isSending = true;
	         	$("._send_message .btn-send").attr('disabled','disabled');
	         	$('._send_message .attached_file').trigger("click");			
	         	$("._send_message .add_file").addClass("loading");
	         	data.submit();
             })
	    },
	    done: function(e, data) {
	    	isSending = false;
			$("._send_message .add_file").removeClass("loading");
			$("._send_message .btn-send").removeAttr('disabled').off("click").on("click", procSendMessage);
	    	if(!data.result.status_code){
				alertify.alert(data.result.message || "Failed to send a message.");
				return;
			}else{
          var threadId = $(".msg-list > ul > li > a.current").closest("li").attr("thread-id");
          var userId = $(".msg-list > ul > li > a.current").closest("li").attr("member_id");
		    	if(threadId){
					addMessage(data.result.message, true, true);
				}else if(userId){
					data.result.thread.last_message = data.result.message;
					addNewThread(data.result.thread);
				}
				resetMessageInput();
			}			
            try { track_event("Send Message", { type: "Attachment" }); } catch (e) {}
	    }
	});	


	$('._send_message #add_file_input').bind('fileuploadsubmit', function (e, data) {
		// The example input, doesn't have to be part of the upload form:
	    var input = $('#add_file_input');
	    var userId = $(".new-message fieldset.to span.selected:visible").attr('uid');
	    var message = $("._send_message textarea.text").val();
		var threadId = null;
		var asStore = false;
		if(!userId)
			threadId = $(".msg-list > ul > li > a.current").closest("li").attr("thread-id");
			asStore = $(".msg-list > ul > li > a.current").closest("li").attr("is-customer-thread")=='true';
		var params = {as_store:asStore};
		if(threadId)
			params.thread_id = threadId;
		if(userId)
			params.user_id = userId;
		if(message)
			params.message = message;

	    data.formData = params;	    
	});


	$("div.userlist input:text").keyup(function(e){
		var val = $(this).val();
		findUser(val);
	});
	$("div.userlist input:text").focus(function(e){
		var val = $(this).val();
		findUser(val);
	});
	$("div.userlist input:text").blur(function(e){
        cancelFindUser();
		setTimeout(function(){$('div.userlist').removeClass("opened")},200);
	});

	$(".new-message fieldset.to").click(function(e){
		$(this).find("div.userlist input:text:visible").focus();
	})

	$('div.userlist').delegate('ul > li > a','click',function(e){
		e.preventDefault();
		var $li = $(this).closest("li");
		var fullname = $li.find("b.fullname").html();
		var uid = $li.data('uid');
		selectUser(fullname, uid, false);
	})

	$(".btn-new").click(function(e){
		e.preventDefault();
		if(refreshTimer) clearInterval(refreshTimer);
		$(".new-message")
			//.find(" h3").html("New Message").end()
			.find(" h3").hide().end()
			.find("div.controller").hide().end()
			.find("fieldset.to").show()
				.find("span.selected").find("span").html("").end()
				.removeAttr("uid").hide().end()
			.end()
			.find("div.userlist").show().find("input:text").val('').end().end()
			.find("._send_message").addClass("disabled").end();
		clearMessages();
		
		$("#content .controller .dropdown").hide();
		$(".msg-list > ul > li > a.current").removeClass("current");
		$(".messaging").addClass('detail');

		$(".new-message div.userlist input:text:visible").focus();
		
		pushState({page:"new"}, "Fancy - Messages " , "/messages");
	});

	$("#sidebar > ul.sort > li > a.threads[type], #sidebar > .user-type > a.threads").click(function(e){
		e.preventDefault();
		var $this = $(this);

		$("#sidebar .search [name=q]").val('');

		if( !$this.is("li.archive > a") && $("a.threads.current")[0] && !$("a.threads.current").is("li.archive > a")){
			
			$("a.threads").removeClass("current");
			$(this).addClass("current");
			$("#sidebar div.msg-list li").show();

			if(!$("#sidebar div.msg-list li:visible").length)
				$(".msg-list").addClass("empty").find("> p").css('display','table-cell');
			else
				$(".msg-list").removeClass("empty").find("> p").hide();

		}else{
			$("a.threads").removeClass("current");
			$this.addClass("current");
			var archived = $this.is("li.archive > a");

			$("#sidebar .msg-list").addClass("loading").find(">p,>div,>ul").hide();
			refreshThreadList(archived);
		}
	});

	$(document).click(function(e){
		if( !$(e.target).is("#sidebar > .user-type *") ){
			$("#sidebar > .user-type").removeClass("opened");
		}
	})

	$("#content .dropdown a._archive").click(function(e){
		e.preventDefault();
		var thread_id = $("#sidebar .msg-list li a.current").closest("li").attr("thread-id");
		archieve(thread_id);
	});

	$("#content .dropdown a._unarchive").click(function(e){
		e.preventDefault();
		var thread_id = $("#sidebar .msg-list li a.current").closest("li").attr("thread-id");
		unarchieve(thread_id);
	});

	$("#content .dropdown").delegate("a._block","click",function(e){
		e.preventDefault();
		var user_id = $("#sidebar .msg-list li a.current").closest("li").attr("member_id");
		blockUser(user_id);
	});

	$("#content .dropdown").delegate("a._unblock","click",function(e){
		e.preventDefault();
		var user_id = $("#sidebar .msg-list li a.current").closest("li").attr("member_id");
		unblockUser(user_id);
	});

	var oldq = "";
	$("#sidebar .search [name=q]").keyup(function(e){
		var q = $(this).val();
		if(oldq==q) return;

		oldq = q;
		if(!q){
			clearSearch();
			$("#sidebar > ul.sort > li.inbox > a.threads").click();
		}else{
			search(q);
		}
	})

	$(document).click(function(e){
		if( !$(e.target).is(".dropdown > a.btn-set") ){
			$(".new-message div.dropdown.opened").removeClass("opened");
		}
	})

	if(!selectedThread && recipient){
		$(".btn-new").click();
		selectUser( recipient.fullname, recipient.id, recipient.isSeller);
	}else if(isCreateMode){
		$(".btn-new").click();
	}

	refreshThreadList(isArchived, selectedThread, !!selectedThread);
	var isRefreshThreadPause = false;
	setInterval(function(){
		if(isRefreshThreadPause) return;
		var thread_id = $("#sidebar .msg-list li a.current").closest("li").attr("thread-id");
		var archived = $("#sidebar > ul.sort > li.archive > a.current").length;
		refreshThreadList(archived, thread_id, false, true);
	},60000);

	function startThreadPolling(){
		isRefreshThreadPause = false;
	}
	function pauseThreadPolling(){
		isRefreshThreadPause = true;
	}
	
	loadBlockedUser();



})
