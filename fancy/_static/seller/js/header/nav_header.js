$(function(){

    function notificationtimesince(date){
        var now = new Date();
        var seconds = now.getTime()/1000 - date.getTime()/1000;
        var days = seconds/86400;
        if(days>0) return $.datepicker.formatDate('d M', date);

        var hours = seconds/3600;
        if(hours>0) return hours>1?(hours+" hrs"):"1 hr";
        var minutes = seconds/60;
        if(minutes > 1) return minutes>1?(minutes+" mins"):"1 min";

        return "Just Now";
    }

    Fancy.ActivitiesPreview = {
        $sensor: $(".mn-noti").parent(),    
        $pulldown: $(".feed-activity"),
        $activityloading: $(".feed-activity > .feed.activities .loading"),
        $activitylist: $(".feed-activity > .feed.activities > ul"),
        $activityempty: $(".feed-activity > .feed.activities > div.empty"),
        $activitymore: $(".feed-activity > .feed.activities > .more"),
        $template: $(".feed-activity > .feed.activities script[type='fancy/template']"),
        pulldownOpenTimer: null,
        pulldownCloseTimer: null,
        loaded: false,
        init: function () {
            var preview = this;
			var sc;
            this.$sensor.mouseenter(function (e) {
                clearTimeout(preview.pulldownCloseTimer);
                preview.pulldownOpenTimer = setTimeout(function () { preview.openPulldown(); }, 300);
            }).mouseleave(function (e) {
                clearTimeout(preview.pulldownOpenTimer);
                $('html').removeClass('fixed');
				var $container = $('#container-wrapper');
                $(window).scrollTop($container.attr('position'));
                $container.removeAttr('style');
                preview.pulldownCloseTimer = setTimeout(function () { preview.closePulldown(); }, 100);
            });
            this.$pulldown.hide();
            this.$activityloading.hide();
        },
        openPulldown: function () {
            var preview = this;
            var maxFetch = 20;
            var maxShow = 5;
            this.$sensor.addClass("open");
			var $container = $('#container-wrapper');
            var sc = $(window).scrollTop();
			$container.attr('position',sc);
			$('html').addClass('fixed');
			$container.css('top',-sc+'px');
            this.$pulldown.show();

            function safe(text) {
                return $("<span>").text(text).html();
            }

            if (!this.loaded) {
                this.loaded = true;
                this.$activityloading.show();

                $.getJSON("/rest-api/v1/seller/"+this.$pulldown.attr('seller-id')+"/dashboard/shop-activity", {count: maxFetch, lang:window.CURRENT_LANGCODE||"en", thumbnail:82}, function (data) {
                    preview.$activitylist.empty();
                    if (data.shop_activities.length > maxShow) {
                        data.shop_activities = data.shop_activities.slice(0, maxShow);
                    }
                    var now = new Date();
                    var today = $.datepicker.formatDate('yy-mm-dd', now);
                    var yesterday = $.datepicker.formatDate('yy-mm-dd', new Date(now.setDate( now.getDate()+1)));
                    var prev_date = null;
                    for (i in data.shop_activities) {
                        var item = data.shop_activities[i];
                        var $li = $('<li>');
                        var text = item.text;
                        var date = $.datepicker.formatDate('yy-mm-dd', new Date(Date.parse(item.date)));
                        if( !prev_date || prev_date!=date){
                            var str = "";
                            if(date==today) str = "Today";
                            else if (date==yesterday) str = "Yesterday";
                            else str = $.datepicker.formatDate('dd MM', new Date(Date.parse(item.date)));
                            
                            //preview.$activitylist.append("<li class='date-divider'>"+str+"</li>");
                        }
                        prev_date = date;

                        var label = "";
                        if(item.order.is_vip ) label = '<label class="label vip">VIP</label>';
                        if(item.order.is_gift ) label = '<label class="label gift">GIFT</label>';
                        if(label) label = " · "+label;
                        var userStr = '';
                        var dateStr = notificationtimesince(new Date(item.date));
                        if(item.customer) {
                            if (item.customer.storefront_user) {
                                userStr = "<a href='/merchant/storefront/users/"+item.customer.username+window.DashboardRequestParams+"'>"+safe(item.customer.name)+"</a>";
                            } else if (item.customer.username == 'guestuser') {
                                userStr = "<b>" + safe(item.customer.name) + "</b>";
                            } else {
                                userStr = "<a href='/"+item.customer.username+"'>"+safe(item.customer.name)+"</a>";
                            }
                        }

                        var orderStr = '';
                    
                        if (item.return_request_id_str) {
                            orderStr = '<a href="/merchant/orders/return-requests/'+item.return_request_id_str+window.DashboardRequestParams+'">#'+item.return_request_id_str+'</a>';
                        } else if (item.order_id_str) {
                            orderStr = '<a href="/merchant/orders/management/detail/'+item.order_id_str+window.DashboardRequestParams+'">#'+item.order_id_str+'</a>';
                        }
                        if (item.status=='order_received') {
                            $li.append('<span class="status order_received"></span>'+userStr+' placed a new order <small class="date">'+orderStr+' · '+dateStr+label+'</small>');
                        } else if(item.status=='order_canceled'){
                            $li.append('<span class="status order_17"></span>Order cancelled <small class="date">'+orderStr+' · '+dateStr+label+'</small>');
                        } else if(item.status=='shipped'){
                            $li.append('<span class="status shipped"></span>Order shipped to '+userStr+' <small class="date">'+orderStr+' · '+dateStr+label+'</small>');
                        } else if(item.status=='sold_out'){
                            $li.append('<span class="status sold_out"></span>Sold out item <a class="things" href="/merchant/products?search-field=id&search-text='+item.sale_item.id_str+'">'+safe(item.sale_item.title) +'</a> <small class="date">'+dateStr+'</small>');
                        } else if(item.status=='remaining_warning'){
                            $li.append('<span class="status remaining_warning"></span>Low quantity on <a class="things" href="/merchant/products?search-field=id&search-text='+item.sale_item.id_str+'">'+safe(item.sale_item.title) +'</a> <small class="date">('+item.sale_item.num_available+' remaining) · '+dateStr+'</small>');
                        } else if (item.status=='return_requested' || item.status=='exchange_requested'){
                            $li.append('<span class="status order_received"></span>'+userStr+' requested a ' + (item.status === 'exchange_requested' ? 'exchange' : 'return') + '<small class="date">'+orderStr+' · '+dateStr+label+'</small>');
                        }
                        preview.$activitylist.append($li);
                    }
                    if(!data.shop_activities.length && preview.$activityempty[0]){
                        preview.$activityempty.show();
                        preview.$activitylist.hide();
                    }else{
                        preview.$activitymore.show();
                        preview.$activitylist.show();
                    }

                    if(preview.$sensor.find('.new').length>0) {
                        preview.$sensor.find('.new:not(a)').remove();
                        preview.$sensor.find('a.new').removeClass('new');
                        $.post("/header_notification_as_read.json", {notifications_for_merchant:true}, function (data) {});
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


    Fancy.MessagePreview = {
        $sensor: $(".mn-msg").parent(),    
        $pulldown: $(".feed-message"),
        $messageloading: $(".feed-message > .feed.messages .loading"),
        $messageempty: $(".feed-message > div.empty"),
        $messagelist: $(".feed-message > .feed.messages > ul"),
        $messagemore: $(".feed-message > .feed.messages > .more"),
        $messagetemplate: $(".feed-message > .feed.messages script[type='fancy/template']"),
        pulldownOpenTimer: null,
        pulldownCloseTimer: null,
        loaded: false,
        init: function () {
            var preview = this;
            this.$sensor.mouseenter(function (e) {
                if(e.toElement.closest('.prevent-pulldown')) {
                    return false;
                }
                clearTimeout(preview.pulldownCloseTimer);
                preview.pulldownOpenTimer = setTimeout(function () { preview.openPulldown(); }, 300);
            }).mouseleave(function (e) {
                clearTimeout(preview.pulldownOpenTimer);
                $('html').removeClass('fixed');
				var $container = $('#container-wrapper');
                $(window).scrollTop($container.attr('position'));
                $container.removeAttr('style');
                preview.pulldownCloseTimer = setTimeout(function () { preview.closePulldown(); }, 100);
            });
            this.$pulldown.hide();
            this.$messageloading.hide();
            this.$messageempty.hide();
        },
        openPulldown: function () {
            var preview = this;
            var maxFetch = 20;
            var maxShow = 4;
            this.$sensor.addClass("open");
			var $container = $('#container-wrapper');
            var sc = $(window).scrollTop();
			$container.attr('position',sc);
			$('html').addClass('fixed');
			$container.css('top',-sc+'px');
            this.$pulldown.show();

            if (!this.loaded) {
                this.loaded = true;
                this.$messageloading.show();
                this.$messageempty.hide();
                var params = { archived: false, count: 10 }, seller_id = this.$pulldown.data("seller-id");
                if (seller_id) { params['user_id'] = seller_id; params['override'] = ''; }

                $.getJSON("/messages/retrieve-threads.json", params, function (data) {
                    preview.$messagelist.empty();

                    var threads = data.threads;
                    var validThreads = [];
                    $(threads).each(function(){
                        if( this.am_i_store ) validThreads.push(this);
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
                        .find("a").attr("href","/merchant/messages/"+item.id).end();

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
            }
        },
        closePulldown: function () {
            this.$pulldown.hide();
            this.$sensor.removeClass("open");
        }
    };

    Fancy.ActivitiesPreview.init();
    Fancy.MessagePreview.init();

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
