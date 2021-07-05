$(function(){

	var refreshTimer = null;
	var blockedUsers = {};

	function clearMessages(){
		$(".message-filed").find("div.msg, h4.start-date").remove();
	}

	function resetMessageInput(){
		$("._send_message").find("input.text").val("");	
	}

	function loadBlockedUser(){
		$.get('/messages/blocked-users.json', {}, function(res){
			console.log(res);
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

	function addThread( thread ){
		var $list = $("#sidebar .msg-list > ul");			
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
				memberString+=" <span class='label customer'>Customer</span>";
			}
			return memberString;
		})).join(", ") );

		$li.find("img").css('background-image',"url('"+(isSellerThread?member.seller.logo_image:member.image_url)+"')").end()
			.find("b.username").html( thread.is_admin_thread?"Fancy":(isSellerThread?member.seller.brand_name:(member.fullname||member.username))).end()
			.find("span.message").html( thread.last_message.message).end()
			.find(".status .date").html( thread.last_message.sent_since).end();

		if( isSellerThread ){
			$li.addClass("store").find("b.username").addClass("store");
		}		
		if( thread.am_i_store ){
			$li.find("b.username").addClass("store");
		}

		if(thread.unread_count > 0){
			$li.find(".new").show().end().addClass('unread');
		}else if(thread.last_message.from.id == viewerId){
			$li.find("span.message").html('You: '+thread.last_message.message);
		}

		if(thread.last_message.attachments.length){
			if(thread.last_message.attachments[0].name.match(/\.(?:png|jpg|jpeg|gif)$/i)){
				$li.find("span.message").html($li.find("span.message").html()+"(Image)");
			}else{
				$li.find("span.message").html($li.find("span.message").html()+"(Attachment)");
			}
		}

		if(thread.last_message.things && thread.last_message.things.length){
			var thingCardTemplate = $("#thing_card_template").html();
			$li.find("span.message").html($li.find("span.message").html()+thread.last_message.things[0].name);
		}

		$li.appendTo($list);
		
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
		var regexp = new RegExp(q, "i");
		$li.attr('message-id', message.id);
		$li.find("img").css('background-image',"url('"+message.from.image_url+"')").end()
			.find("b.username").html( message.from.fullname).end()
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

	function refreshThreadList( archived, selectedThreadId, selectThreadAfterRefresh){
		var url = '/messages/retrieve-threads.json?count='+limit+'&page=1&archived='+(archived?'true':'false')+"&seller="+(isStoreOnly?'true':'false');
		if( isAdmin  ) url += "&admin&user_id="+viewerId;

		if($("#sidebar .msg-list .search-result").is(":visible")){
			clearSearch();
			startThreadPolling();
		}

		isLoading = true;

		$.get(url, function(res){
			$("#sidebar .msg-list").removeClass("loading");
			isLoading = false;

			if(!res.threads){
				$("#sidebar .msg-list").find(">div, >ul").hide().filter(".empty._thread").show();
				return;
			}
			nextPage = res.next_page;
            
			var $list = $("#sidebar .msg-list > ul");			

			$("#sidebar .msg-list").find(">div, >ul").hide().filter("ul").show();
			$list.find("li").addClass("_mark_delete");

            var threads = res.threads;
			$(threads).each(function(){
				var $li = addThread(this, false);
				$list.find("li._mark_delete[message-id="+this.id+"]").remove();
				
				if($li){
					$li.attr('show',true);
				}
			})
			$list.find("li._mark_delete").remove();

			if(!$list.find("[show]").length)
				$("#sidebar .msg-list").find(">div, >ul").hide().filter(".empty._thread").show();

			if(selectedThreadId){
				$("#sidebar .msg-list > ul > li[thread-id="+selectedThreadId+"] > a").addClass("current");
				if($("#sidebar").is(":visible") && !$("#sidebar .msg-list > ul > li[thread-id="+selectedThreadId+"] > a.current").is(":visible") ){
					$("#sidebar a.threads[type]").not(".current").click();					
				}
			}
			_archived = archived;

			$list.closest('div.inner').off('scroll').on('scroll', function(e){
				var scrollTop = $list.closest('div.inner').scrollTop();
				var scrollHeight = $list.closest('div.inner')[0].scrollHeight;
				if(scrollTop > scrollHeight - $list.closest('div.inner').height() - 100 ){
					loadMoreThreadList();
				}
			});

			if(selectedThreadId && selectThreadAfterRefresh){
				selectThread(selectedThreadId);
			}
		});	
				
		if(!selectedThreadId && !$("#messages fieldset.to").is(":visible")){
			$("#messages")
				.find("> h3").html("").show().end()
				.find("fieldset.to, div.msg-list, div.message-filed, p.find").hide().end()
				.find("._send_message").addClass("disabled").end();
			clearMessages();
		}

		$("#sidebar .btn-box").hide().find("ul.sort li > a").removeClass("current");
		
		if(archived){
			$("#sidebar .btn-box").show().find("ul.sort li.archive > a").addClass("current");
		}else{
			$("#sidebar .btn-box").show().find("ul.sort li.inbox > a").addClass("current");
		}
	}

	function loadMoreThreadList(){
		if(nextPage>1 && !isLoading){
			isLoading = true;
			var url = '/messages/retrieve-threads.json?count='+limit+'&page='+nextPage+'&archived='+(_archived?'true':'false')+"&seller="+(isStoreOnly?'true':'false');
			if( isAdmin  ) url += "&admin&user_id="+viewerId;
			var $list = $("#sidebar .msg-list > ul");

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
		var isSellerThread = $("#sidebar .msg-list > ul > li > a.current").closest("li").attr("is-seller-thread") && message.from.seller;
		
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
		}
		if(!message.message ) {
			$item.find("div.message").hide();
		}

		// add attachments
		if(message.attachments && message.attachments.length){
			$(message.attachments).each(function(){
				if(this.name.match(/\.(?:png|jpg|jpeg|gif)$/i)){
					var $img = $("<div class='attached loading'><a href='#' onclick='openAttached(\""+this.url+"\");return false;'><img src='"+this.url+"?thumb'/></a></div>");
					$($item).find(".message").before($img);
					$img.find("img").load(function(){
						$(this).closest("div").removeClass("loading");						
					}).end().append('<small class="status"><span class="date">'+getTimeText(message.sent_at*1000)+"</span></small>");					
				}else{
					$($item).find("div.message").find('span:eq(1)').html("<a href='"+this.url+"' target='_blank' class='file'>"+this.name+"</a>");
				}		
				if(message.message) $($item).find('.attached').addClass('none');
				
			});			
		}

		// add thing cards
		if(message.things && message.things.length){
			var thingCardTemplate = $("#thing_card_template").html();
			$(message.things).each(function(){
				var $card = $(thingCardTemplate);
				if(message.message) $card.addClass("none");
				$card.find("img").attr('src',this.image_url).end()
					.find("a").attr('href', this.url).end()
					.find("a > figcaption").html(this.name).end();
				if( this.sales ){
					$card.find("b.price").show().html(this.sales.fancy_price);
				}else{
					$card.find("b.price").next().hide();
				}
				if(this.user){
					$card.find("a.username").attr("href","/"+this.user.username).html(this.user.fullname);
				}
				if(this.fancys){
					$card.find("a.username").next().html("+ "+this.fancys);
				}
				$card.appendTo( $item.find(".message") );
			})
			$item.find("div.message").show();
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
			$("#sidebar .msg-list > ul > li[thread-id="+message.thread+"] > a span.message").html(msg);
		}
		if(scrollToLast){
			$("#messages .message-filed").scrollTop( 999999 );
		}			
	}
	
	function addNewThread(thread){
		var $list = $("#sidebar .msg-list > ul");
		if($list.find("[thread-id="+thread.id+"]").length) return;

		addThread(thread, false);
	}
	
	var loadingMessages = false;
	function selectThread( threadId, messageId){
		function refreshMessages( messages ){
			clearMessages();
			$(".message-filed").show();

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

		var $list = $("#sidebar .msg-list > ul");
		$list.attr('thread-id', threadId);
		$list.find("li").not("[thread-id="+threadId+"]").find("> a.current").removeClass("current");
		var $li = $list.find("li[thread-id="+threadId+"] > a").addClass("current").closest("li");
		var isAdminThread = ($li.attr('is-admin-thread')=='true');

		if($li.length){
			$("#sidebar").hide();
			$("#messages").show();
			$li.find(".new").hide();
			$("#messages")
				.find("> h3").html($li.attr("members")).show().end()
				.find("fieldset.to, div.msg-list, p.find").hide().end()
				.find("._send_message").removeClass("disabled").end();

			if( isAdminThread ){
				$("#messages")
				.find("> h3").html('Fancy').end()
				.find("._send_message").addClass("disabled").end();
			}
			
			var params = {thread_id:threadId};
			if( isAdmin  ){
				params.admin = '';
				params.user_id = viewerId;
			}
			if(messageId){
				params.since_id = messageId-1;
				params.limit = 999999;
			}
			$.get('/messages/retrieve-messages.json', params, function(res){
				loadingMessages = false;
				var checkThreadId = $("#sidebar .msg-list > ul").attr("thread-id");
				if(threadId!=checkThreadId) return;

				refreshMessages(res.messages, messageId);

				refreshTimer = setInterval(retrieveNewMessages,30000);
			});
			window.history.pushState({page:"thread", threadId:threadId}, "Fancy - Messages #"+threadId , "/messages/"+threadId);
		}else{
			$("#sidebar").show();
			$("#messages").hide();
			$("#messages")
				.find("> h3").hide().end()
				.find("fieldset.to, div.msg-list, p.find").hide().end()
				.find("._send_message").addClass("disabled").end();
			
			clearMessages();
			window.history.pushState({page:"index"}, "Fancy - Messages " , "/messages");
		}
		setBlockStatus();
	}	

	$(".message-filed").scroll(function(e){
		if(loadingMessages) return;
		var scrollTop = $(this).scrollTop();
		if(scrollTop < 200 ){
			var $firstMessage = $(".message-filed div.msg:first");
			if( $firstMessage.attr("last") ) return;
			loadingMessages = true;
			var threadId = $("#sidebar .msg-list > ul > li > a.current").closest("li").attr("thread-id");
			var firstId = $firstMessage.attr("message-id");

			var params = {thread_id:threadId, max_id:firstId};
			if( isAdmin  ){
				params.admin = '';
				params.user_id = viewerId;
			}
			$.get('/messages/retrieve-messages.json', params, function(res){
				loadingMessages = false;
				var checkThreadId = $("#sidebar .msg-list > ul > li > a.current").closest("li").attr("thread-id");
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
		var threadId = $("#sidebar .msg-list > ul > li > a.current").closest("li").attr("thread-id");
		var lastId = $(".message-filed div.msg:last").attr("message-id");

		if(!threadId) return;
		var param = {thread_id:threadId};
		if( lastId ) param.since_id = lastId;
		if( isAdmin  ){
			param.admin = '';
			param.user_id = viewerId;
		}
		$.get('/messages/retrieve-messages.json', param, function(res){
			$(res.messages).each(function(){
				addMessage(this, false, true);
			})				
		});
	}

	var isSending = false;
	function sendMessage( userId, threadId, message, thingIds ){
		if(isSending) return;

		isSending = true;
		var params = {};
		if(threadId)
			params.thread_id = threadId;
		if(userId)
			params.user_id = userId;
		if(thingIds && thingIds.length)
			params.things = thingIds.join(",");
		if(message)
			params.message = message;

		if(!threadId && !userId){
			alert("Please select recipient.");
			$("._send_message .btn-send").removeAttr('disabled');
			return;
		}

		if(message && message.length>2048){
			isSending = false;
			$("._send_message .btn-send").removeAttr('disabled');
			alert("message is too long. please input < 2048 charaters.");
			return;
		}

		retrieveNewMessages();
		$.post("/messages/send-message.json", params, function(res){
			$("._send_message .btn-send").removeAttr('disabled');
			if(!res.status_code){
				alert(res.message || "Failed to send a message.");
				return;
			}else{
				if(threadId){
					addMessage(res.message, true, true);
					refreshThreadList(false, threadId, false);
				}else if(userId){
					res.thread.last_message = res.message;
					$(".to").find('.selected').hide().end().find('.userlist').show();
					addNewThread(res.thread);
					$("#sidebar > li.inbox > a[type=friend]").click();
					refreshThreadList(false, res.thread.id, true);					
				}
				resetMessageInput();
			}
		})
		.always(function(){
			isSending = false;
		})
	}

    function findUser(username){
        var fn = arguments.callee;

        function search(username){
            if(fn.xhr) { try { fn.xhr.abort(); } catch(e) { } }
            var $ul = $('#messages div.msg-list > ul');
            $ul.show().addClass("loading");
            var xhr = $.get('/search-users.json', {term:username,limit:15,filter_messages_permission:true},function(json) {
                $ul.removeClass("loading").find("li").remove();
                var template = $ul.find("script").html();
                if(json.length){
                    for(var i=0,c=json.length; i < c; i++){
                        var $item = $(template);
                        if(json[i].messages_permission){
                            $item.find("b.username").html(json[i].fullname).end()
                                .find("span.nickname").html(json[i].username).end()
                                .find("img").css('background-image',"url('"+json[i].image_url+"')").end()
                                .data('uid', json[i].id)
                            $item.appendTo($ul);
                        }
                    }
                }
                if( !$ul.find("li").length ){
                    $ul.append('<li class="empty">No users found</li>');
                }
			    $('#messages div.msg-list').show();
            });
            fn.xhr = xhr;
            $('#messages p.find').hide();
        }
        if(username && username.length > 1) {
			search(username);
        }
    }

    function cancelFindUser(){
        var fn = findUser;
        if(fn.xhr) { try { fn.xhr.abort(); } catch(e) { } }
        var $ul = $('#messages div.msg-list > ul');
        $ul.removeClass("loading");
    }

	function selectUser(fullname, uid){
		$("fieldset.to span.selected").find("span").html(fullname).end()
			.attr("uid", uid)
			.show();		
		$("._send_message").removeClass("disabled");
		
		$('#messages div.msg-list, #messages p.find').hide();
		$("#messages fieldset.to input:text").val('').hide();
		$("#messages fieldset.to label").hide();
	}

	function archieve(thread_id){
		$.post("/messages/archive-thread.json", {thread_id:thread_id}, function(res){
			refreshThreadList(false);
			window.history.pushState({page:"index"}, "Fancy - Messages" , "/messages");
		});
		$("._send_message").addClass("disabled");
	}

	function unarchieve(thread_id){
		$.post("/messages/unarchive-thread.json", {thread_id:thread_id}, function(res){
			refreshThreadList(false, thread_id);
		});
	}

	function blockUser(userId){
		$.post("/messages/block-user.json", {target_user_id:userId}, function(res){
			if(res.status_code){
				blockedUsers[userId] = {};
				setBlockStatus();
			}
		});
	}

	function unblockUser(userId){
		$.post("/messages/unblock-user.json", {target_user_id:userId}, function(res){
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
		$("#sidebar .msg-list").addClass("loading");
		$("#sidebar .msg-list > div").hide();
		$("#sidebar .msg-list > ul > li").remove();
		$("#sidebar .search a.remove").show();
			
		searchTimer = setTimeout(function(){
			if(searchAjax) searchAjax.abort();
			searchAjax = $.get('/messages/search.json', {q:q}, function(res){
				$("#sidebar .msg-list").removeClass("loading");
				if(res.status_code && res.results.length){
					$("#sidebar .msg-list > .search-result").show().html("Displaying "+res.results.length+" results for <b>"+q+"</b>");
					$(res.results).each(function(){
						addSearchResult(this, q);
					})
				}else{
					$("#sidebar .msg-list > .empty._search").show();
				}
			})	
		},200);
	}

	function clearSearch(){
		
		if(searchTimer) clearTimeout(searchTimer);
		if(searchAjax) searchAjax.abort();
		$("#sidebar .search [name=q]").val('');
		$("#sidebar .search a.remove").hide();
		$("#sidebar .msg-list .search-result, #sidebar .search .remove").hide();
		$("#sidebar .msg-list ul li").remove();
	}

	$("#sidebar .msg-list > ul").delegate("a", "click", function(e){
		e.preventDefault();
		var threadId = $(this).closest("li").attr("thread-id");
		var messageId = $(this).closest("li").attr("message-id");
		
		selectThread(threadId, messageId);
	});

	function procSendMessage(e){
		e.preventDefault();
		$(this).attr('disabled','disabled');
		var userId = $("#messages fieldset.to span.selected:visible").attr('uid');
		var threadId = null;
		if(!userId)
			threadId = $("#sidebar .msg-list > ul > li > a.current").closest("li").attr("thread-id");
		var message = $("._send_message input.text").val();
		if(!message){
			alert("Please input message");
			$("._send_message .btn-send").removeAttr('disabled');
			$("._send_message input.text").focus();
			return;
		}
		sendMessage(userId, threadId, message );
	}


	$("._send_message .btn-send").on("click", procSendMessage);


	$("#messages fieldset.to input:text").keyup(function(e){
		var val = $(this).val();
		findUser(val);
	});
	$("#messages fieldset.to input:text").focus(function(e){
		var val = $(this).val();
		findUser(val);
	});
	$("#messages fieldset.to input:text").blur(function(e){
        cancelFindUser();
        $('#messages p.find').hide();
	});

	$("#messages fieldset.to").click(function(e){
		$(this).find("input:text:visible").focus();
	})

	$("#messages fieldset.to a.delete").click(function(e){
		e.preventDefault();
		$(this).closest('.to').find('.selected').hide().end().find('input,label').show();
	})

	$('#messages div.msg-list').delegate('ul > li > a','click',function(e){
		e.preventDefault();
		var $li = $(this).closest("li");
		var fullname = $li.find("b.username").html();
		var uid = $li.data('uid');
		selectUser(fullname, uid);
	})

	$(".btn-new").click(function(e){
		e.preventDefault();
		if(refreshTimer) clearInterval(refreshTimer);

		$("#sidebar").hide();
		$("#messages").show()
			.find("> h3").html("New Message").show().end()
			.find("fieldset.to").show()
				.find("input:text").val('').show().end()
				.find("label").show().end()
				.find("span.selected").find("span").html("").end()
				.removeAttr("uid").hide().end()
			.end()
			.find("div.msg-list").show()
				.find("p").removeAttr('style').end()
				.find("ul > li").remove().end()
			.find("div.msg-filed").hide().end()
			.find("._send_message").addClass("disabled").end();
		clearMessages();
		
		$("#sidebar .msg-list > ul > li > a.current").removeClass("current");		

		$(".new-message fieldset.to input:text:visible").focus();
		
		window.history.pushState({page:"new"}, "Fancy - Messages " , "/messages");
	});

	$("#sidebar ul.sort > li > a.threads").click(function(e){
		e.preventDefault();
		var $this = $(this);
		$("#sidebar .search [name=q]").val('');
		if( !$this.is("li.archive > a") && $("a.threads.current")[0] && !$("a.threads.current").is("li.archive > a")){
			
			$("a.threads").removeClass("current");
			$(this).addClass("current");

			$("#sidebar div.msg-list li").show();
			
			if(!$("#sidebar div.msg-list li:visible").length)
				$("#sidebar .msg-list").find(">div, >ul").hide().filter(".empty._thread").show();
			else
				$("#sidebar .msg-list").find(">div, >ul").hide().filter("ul").show();

		}else{
			$("a.threads").removeClass("current");
			$this.addClass("current");
			var archived = $this.is("li.archive > a");

			$("#sidebar .msg-list").addClass("loading").find(">ul, >div").hide();
			refreshThreadList(archived);
		}
	});

	$("#sidebar .search [name=q]").keyup(function(){
		var q = $(this).val();
		if(!q){
			clearSearch();
			$("#sidebar > ul.sort > li.inbox > a.threads").click();
		}else{
			search(q);
		}
	})

	$("#sidebar .search a.remove").click(function(e){
		e.preventDefault();
		clearSearch();
		$("#sidebar ul.sort > li.inbox > a.threads").click();
	});

	if(!selectedThread && recipient){
		$(".btn-new").click();
		selectUser( recipient.fullname, recipient.id);
	}
	refreshThreadList(isArchived, selectedThread, !!selectedThread);
	
	var isRefreshThreadPause = false;
	/*setInterval(function(){
		if(isRefreshThreadPause) return;
		var thread_id = $("#sidebar .msg-list li a.current").closest("li").attr("thread-id");
		var archived = $("#sidebar > ul.sort > li.archive > a.current").length;
		refreshThreadList(archived, thread_id);
	},60000);	*/

	function startThreadPolling(){
		isRefreshThreadPause = false;
	}
	function pauseThreadPolling(){
		isRefreshThreadPause = true;
	}
	
	window.onpopstate = function(e){
		if(!e.state){
			selectThread(null);
			return;
		}
		if(e.state.page == "thread"){
			selectThread( e.state.page.threadId);
		}else if(e.state_page == "new"){
			$(".btn-new").click();
		}else{			
			$("#sidebar .msg-list").addClass("loading").find("> div, >ul").hide();
			selectThread(null);
			var archived = $("#sidebar > ul.sort > li.archive > a.current").length;			
			refreshThreadList(archived);
		}
	}


	loadBlockedUser();


})
