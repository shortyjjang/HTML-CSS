$(function(){
	var currencies;
	window.user_waiting_options = {};
	setTimeout(function(){
		$.ajax({
            type: 'GET',
            url: '/get_all_currencies.json',
            dataType: 'json',
            success: function(json) {
                if (json && json.currencies) {
                    currencies = json.currencies;
                }
                else return;
            }
        });
	},100)

	var saleItems = {};
	var isCalling = false;
	var prefetchTimer;
	$('.stream, #slideshow').on('mouseover','.figure-item .btn-cart, a.btn-cart',function(e){
		var $this = $(this);

		if( $this.hasClass("nopopup") ) return;

    	if ($.isFunction($this.data('updateAttrs'))) {
			$this.data('updateAttrs')();
		}

		var sid = $this.attr('data-id'), thing_id = $this.attr('data-thing-id'), param = {sale_item_id:sid, thing_id:thing_id, 'new':true, 'link_to_title':true};
		if( saleItems.sid ) return;
		var login_require = $(this).attr('require_login');
		if (typeof(login_require) != undefined && login_require != null && login_require=='true'){
			return;
		}

		prefetchTimer = setTimeout(function(){
			isCalling = true;
		    $.post("/get-sale-item.json",param,
			        function(response){
				        if(response.status_code != undefined && response.status_code == 1)
				        	saleItems[sid] = response.html;

				        isCalling = false;
        	}).always(function(){isCalling = false});

		},100)
	});
	$('.stream, #slideshow').on('mouseout','.figure-item .btn-cart, a.btn-cart',function(e){
		if(prefetchTimer) clearTimeout(prefetchTimer);
	});

	var dlg_detail = $.dialog('things-v3');
	function resetHotelResult(tab) {
		dlg_detail.$obj.find('.frm dd').removeClass('on');
		dlg_detail.$obj.find('.booking-result, .book-total-price').hide();
		dlg_detail.$obj.find('.booking-result').find("dd").remove();
		dlg_detail.$obj.find('dd.btn-check, dd.btn-check button.btns-green-embo').show();
		dlg_detail.$obj.find('.tab-container').removeClass('active');
		if(tab)
			tab.addClass('active');
		else
			dlg_detail.$obj.find('.tab-container:eq(0)').addClass('active');
		
	}
	dlg_detail.$obj
		.on('open', attachHotkey)
		.on('close', detachHotkey)		
		.on('mouseover', 'a.paging', function(){
			var $this = $(this);
			if($this.is(':visible')) $(this).addClass('hover');
		})
		.on('mouseout', 'a.paging', function(){
			$(this).removeClass('hover');
		})
		.on('click', 'a.paging', function(event){
			event.preventDefault();

			var $this = $(this), tid, $li, $btnNext, $btnPrev;
			if(!$this.is(':visible')) return;

			tid = dlg_detail.$obj.find('.add_to_cart').attr('tid');
			$li = $('a[rel=thing-'+tid+"]").closest('li');
			$li = $this.hasClass('btn-prev')? $li.prev('li') : $li.next('li');
			if($li.length) $li.find(".figure-item").trigger("mouseover").end().find('.btn-cart').click();

			$btnPrev = dlg_detail.$obj.find('.btn-prev');
			$btnNext = dlg_detail.$obj.find('.btn-next');

			$li.prev('li').length ? $btnPrev.show() : $btnPrev.hide().removeClass('hover');
			$li.next('li').length ? $btnNext.show() : $btnNext.hide().removeClass('hover');
		})
		.on('keypress', function(){
			if(event.keyCode == 27){ dlg_detail.close() }
		})
		.on('click','span.trick', function(event){
			var $this = $(this);
			resetHotelResult();
		})

    $('.stream, #slideshow').on('click','.figure-item .btn-cart, a.btn-cart',function(e){
    	e.preventDefault();

		if( $(this).hasClass("nopopup") ) return;

    	if ($.isFunction($(this).data('updateAttrs'))) {
			$(this).data('updateAttrs')();
		}

    	var login_require = $(this).attr('require_login');
		if (typeof(login_require) != undefined && login_require != null && login_require=='true'){
			require_login();
			return false;
		}

        var sid = $(this).attr('data-id'), thing_id = $(this).attr('data-thing-id'), param = {sale_item_id:sid, thing_id:thing_id, 'new':true, 'link_to_title':true};
        $popup = $('.popup.things-v3.detail')
        $container = $('#popup_container');
		$body = $('body');
        
		if(!$.dialog('things-v3').showing()){
        	$popup.find('.fill').empty().end().removeClass('no-slide');

        	if(!saleItems[sid]){
        		$popup.css({width:'',height:''});
        		$container.addClass('loading');
        		$.dialog('things-v3').open();
        	}
		}

		$popup.addClass("no-slide");

		var $li = $(this).closest('li');
		$btnPrev = dlg_detail.$obj.find('.btn-prev');
		$btnNext = dlg_detail.$obj.find('.btn-next');
		$li.prev('li').length ? $btnPrev.show() : $btnPrev.hide().removeClass('hover');
		$li.next('li').length ? $btnNext.show() : $btnNext.hide().removeClass('hover');

		if(saleItems[sid]){			
			setSaleItem(saleItems[sid], sid);
		}else if(isCalling){
			function waitResponse(){
				if(isCalling){
					setTimeout(waitResponse, 200);
					return;
				}
				setSaleItem(saleItems[sid], sid);
			}
			waitResponse()
		}else{
		    $.post("/get-sale-item.json",param,
			        function(response){
				        if(response.status_code != undefined && response.status_code == 1){
				        	
				        	saleItems[sid] = response.html;
				        	setSaleItem(response.html, sid);
							
				      }
				      if(response.status_code != undefined && response.status_code == 0){
					      if(response.message != undefined)
						      alert(response.message);
				      }
	        }, "json");
		}


		function setSaleItem(html, sid){
            try { track_event('View Sale Info', { 'sale id': sid.toString(), 'via': 'list' }); } catch(e) {}
			
        	$(".popup.delivery-popup").remove();
            var w = 911;
            var h = 610;

            var prevWidth = $popup.width();
            var prevHeight = $popup.height();
            
            var isLoading = $container.hasClass("loading");
            $container.removeClass('loading');
            $popup.removeClass('animated');
            $popup.find('.fill').css({opacity:0}).html(html).width(w);            
           	h = $popup.find('.fill').height();
            
			var mt = Math.max(Math.floor(($container.height()-h)/2-20),5);
			var ml = Math.max(Math.floor(($body.width()-w)/2-20),5);
            if(isLoading){            	
            	$popup.find('.fill').hide().css({opacity:1});
            	$popup.css({width:prevWidth+"px",height:prevHeight+"px",opacity:1});            	
				//setTimeout(function(){ $popup.addClass('animated') }, 1);
				//setTimeout(function(){ 
				//	$popup.css({marginTop:mt+'px',marginLeft:ml+'px',width:w+'px',height:h+'px'}) 
				//}, 10);
				$popup.css({marginTop:mt+'px',marginLeft:ml+'px',width:w+'px',height:h+'px'});
				setTimeout(function(){ $popup.find('.fill.after').fadeIn(400);}, 300);
			}else{
				$popup.find('.fill.after').css({opacity:1}).show();
				$popup.css({marginLeft:ml+'px',width:'auto',height:'auto',opacity:1});
				$.dialog('things-v3').open();
			}

            $popup.find(".popup.delivery-popup").insertBefore( $('.popup.things-v3.detail') );

			//image slide, #TODO : need to refatoring.

			$('.popup.things-v3.detail .tabs h4').click(function() {
			    $(this).closest('.tabs').find('.tab-container').removeClass('active');
			    $(this).closest('.tab-container').addClass('active');
			});
			$('.popup.things-v3.detail .photo-frame').data('idx', 0)
					.on('moveImageByIndex', function(event, idx, noani) {
						var $this = $(this);
						var $thumbnail = $this.find('.thumbnail-list');
						var $li = $thumbnail.find('li')
						var length = $li.length;
						$thumbnail.width(82*length);
						if (idx < 0 || idx > length - 1) {
							return;
						}

						var photoWidth = $this.width();
						var thumbnailWidth = $li.width();
						var $bigImages = $this.find('.big');

						$this.find('.move').removeClass('dimmed');

						if(noani) {
							$bigImages.addClass('noani');
						} else {
							$bigImages.removeClass('noani');
						}

						$bigImages.css('left', $bigImages.find('li').width() * -idx);

						var thumbnailLeft = parseInt($thumbnail.css('left'));
						if (!thumbnailLeft) thumbnailLeft = 0;

						var maskLeft = thumbnailWidth * idx + thumbnailLeft;
						var firstIdx = Math.abs(Math.floor(parseInt(thumbnailLeft) / thumbnailWidth));
						var itemPerPage = Math.floor(photoWidth / thumbnailWidth);

						if (idx == 0) {
							$this.find('.prev').addClass('dimmed');
							thumbnailLeft = 0;
							maskLeft = 0;
						} else if (idx == length - 1) {
							$this.find('.next').addClass('dimmed');
							if (length > itemPerPage) {
								thumbnailLeft = photoWidth - thumbnailWidth * (idx + 1);
								maskLeft = photoWidth - thumbnailWidth;
							}
						} else if (idx - firstIdx + 1 > itemPerPage) {
							thumbnailLeft = (photoWidth % thumbnailWidth)/2 - thumbnailWidth * (idx - itemPerPage + 1);
							maskLeft = photoWidth - thumbnailWidth - (photoWidth % thumbnailWidth)/2;
						} else if (idx == firstIdx - 1) {
							thumbnailLeft = (photoWidth % thumbnailWidth)/2 - thumbnailWidth * idx;
							maskLeft = (photoWidth % thumbnailWidth)/2
						}
						$this.find('.mask').css('left', maskLeft);
						$thumbnail.css('left', thumbnailLeft);
						$(this).data('idx', idx);
					})
					.on('DOMMouseScroll', function(event) { //Firefox
						if (event.originalEvent.detail > 0) {
							$(this).trigger('prev');
						} else {
							$(this).trigger('next');
						}
						return false;
					})
					.on('mousewheel', function(event) { //IE, Opera, Safari
						if (event.originalEvent.wheelDelta < 0) {
							$(this).trigger('prev');
						} else {
							$(this).trigger('next');
						}
						return false;
					})
					.on('prev', function() {
						$(this).trigger('moveImageByIndex', +($(this).data('idx'))-1);
					})
					.on('next', function() {
						$(this).trigger('moveImageByIndex', +($(this).data('idx'))+1);
					})
					.find('.move').click(function(){
						if($(this).hasClass('prev')) $(this).trigger('prev');
						else if($(this).hasClass('next')) $(this).trigger('next');
					}).end()
					.find('.mask').on('click mousemove', function(event){
						/*
						//simple throttle
						var last = $(this).data('last');
						if (last) {
							var passed = new Date() - last;
							if (passed < 500) return;
						}
						$(this).data('last', +new Date());
		                */
						var $wrapper = $(this).closest('.photo-frame');
						var $thumbnail = $wrapper.find('.thumbnail-list');
						var thumbnailWidth = $thumbnail.find('li').width();
						var idx = Math.floor((event.clientX - $thumbnail.offset().left) / thumbnailWidth);
						$wrapper.trigger('moveImageByIndex', idx);
					}).end()
					.on('full', function() {
						var $this = $(this);
						var $popup = $this.closest('.popup').addClass('fadeOut');
						var $wrapper = $this.closest('.photo-frame');
						var $container = $('#popup_container');
						var $body = $('body');
						var o = $wrapper.offset();
						$wrapper.data({
							'top': o.top,
							'left': o.left
						});
						setTimeout(function() {
							$wrapper.find('.big li a').css({
								'top': o.top,
								'left': o.left
							});
							$wrapper.find('.big li').css('width', $container.width());
							$container.addClass('full');
							$popup.css('height', $container.height());
							$.when( $this.trigger('moveImageByIndex', [+($this.data('idx')), true]) ).done(function(){
								setTimeout(function() {
									$wrapper.find('.big li a').addClass('ani').css({
										'height': $container.height(),
										'width': $container.width(),
										'top': 0,
										'left': 0
									});
								}, 200);
							});
						}, 200);
					})
					.on('normal', function() {
						var $this = $(this);
						var $popup = $this.closest('.popup');
						var $wrapper = $this.closest('.photo-frame');
						var $body = $('body');
						var $container = $('#popup_container');
						var o = $wrapper.data();
						$wrapper.find('.big li a').css({
							'height': '',
							'width': '',
							'top': o.top,
							'left': o.left
						});
						setTimeout(function() {
							$popup.removeClass('animated');
							$container.removeClass('full');
							$popup.css('height', '');
							$wrapper.find('.big li').css('width', '');
							$wrapper.find('.big li a').removeClass('ani').css({
								'top': 0,
								'left': 0
							});
							$('#popup_container .popup').css('margin-top', Number(($container.height() - 650)/2)-20);//sorry. fix dialog positioning bug
							$.when( $this.trigger('moveImageByIndex', [+($this.data('idx')), true]) ).done(function(){
								setTimeout(function() {
									$popup.removeClass('fadeOut');
								}, 500);
							});
						}, 500);
					})
					.find('.full').on('click', function(event){
						if (!$('#popup_container').hasClass('full')) $(this).trigger('full');
						else $(this).trigger('normal');
					}).end()
					.on('reposition', function() {
						if (!$('#popup_container').hasClass('full')) return;
						var $this = $(this);
						var $wrapper = $this.closest('.photo-frame');
						var $container = $('#popup_container');
						$wrapper.find('.big li').css('width', $container.width());
						$.when( $this.trigger('moveImageByIndex', [+($this.data('idx')), true]) ).done(function(){
							$wrapper.find('.big li a').addClass('ani').css({
								'height': $container.height(),
								'width': $container.width(),
								'top': 0,
								'left': 0
							});
						});
					})
					.find('.big').on('click', 'a' ,function(event) {
						if (!$('#popup_container').hasClass('full')) $(this).trigger('full');
						else $(this).trigger('normal');
					});
			$(window).resize(function() {
				$('.popup.things-v3.detail .photo-frame').trigger('reposition');
			});
			$('.popup.things-v3.detail input.number').inputNumber();
			$('.popup.things-v3.detail select.selectBox').selectBox();

			// reset autocomplete for searching user of giftcard
			if(typeof autocomplete == 'function') autocomplete();

			// Hotel Booking
			var roomlist = [], roomscache = {};
			
			$('.popup.things-v3.detail')
				.find('div.calendar')
					.datepicker({dateFormat : 'MM d, yy', showOtherMonths: true, selectOtherMonths: true})
					.eq(0)
						.datepicker('option', 'altField', '#check-in')
						.datepicker('option', 'minDate', 1)
						.datepicker('option', 'onSelect', function(dateText, inst){
							var nextDate = new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay);
							nextDate.setDate(nextDate.getDate()+1);

							$('dd.calendar .stit:eq(1)').click();
							$('.popup.things-v3.detail div.calendar:eq(1)').datepicker('option', 'minDate', nextDate)
							resetHotelResult();
						})
					.end()
					.eq(1)
						.datepicker('option', 'altField', '#check-out')
						.datepicker('option', 'minDate', 2)
						.datepicker('option', 'onSelect', function(){
							$('dd.people label').click();
							resetHotelResult();
						})
					.end()
				.end()
				.find('dd.calendar .stit').click(function() {
					var isOpened = $(this).closest('.calendar').hasClass("on");
					resetHotelResult();
					if( !isOpened )
						$(this)
							.closest('dl')
								.find('dd').removeClass('on').end()
							.end()
							.closest('dd').addClass('on').end()
				}).end()
				.find('dd.people')
					.on('click', '.stit', function(){
						var isOpened = $(this).closest('.people').hasClass("on");
						resetHotelResult();
						if( !isOpened )
							$(this)
								.closest('.hotel-form').find('dd').removeClass('on').end().end()
								.closest('dd').addClass('on');
					})
					.on('change', 'select', function(){
						var adult = $('#adult-people').val(), child = $('#child-people').val();
						var text = adult+' Adult'+(adult>1?'s':'')+', '+child+((child>1 || child == 0)?' Children':' Child');

						$('.popup.things-v3.detail dd.people label').text(text);

						//resetHotelResult();
					})
				.end()
				.find('dd.btn-check')
					.on('click', 'button', function(){
						if($(this).attr('require_login') != undefined) return require_login();

						$this = $(this);
						$(this)
							.hide()
							.nextAll('.loading').show().end()
							.closest('.hotel-form').find('dd').removeClass('on');

						$('.tab-container').removeClass('active');

						// check avail rooms
						var params = {
							hotelId       : $(this).attr('data-hotel-id'),
							arrivalDate   : $('#check-in').val(),
							departureDate : $('#check-out').val()
						};

						var adult = $('#adult-people').val();
						var child = '';

						for(var i=0;i<$('#child-people').val();i++) {
							child +=",10";
						}

						params.rooms = adult + child;

						$.ajax({
							type     : 'post',
							url      : '/ean/hotel/rooms/',
							data     : params,
							cache    : false,
							dataType : 'json',
							success  : function(json){
								var ean_error = json.EanWsError;
								var $result   = $('.booking-result');
								$result.find('dd').remove();

								if (ean_error == null) {
									var $template = $result.prev('script[type="fancy/template"]');
									var $dd, room;

									$('dd.btn-check').hide();
									$('div.book-total-price').show();
									roomlist = [];

									roomscache.arrivalDate = json.arrivalDate;
									roomscache.departureDate = json.departureDate;
									roomscache.rooms = params.rooms;

									var lowest = 99999999;
									for (var i=0,c=json.roomlist.length; i < c; i++) {
										room = json.roomlist[i];
										roomlist.push(room);
										var nightly_detail = "";
										var tax_detail = "";
										var price, description, long_description;

										if (room.supplierType == 'E') {
											if (parseFloat(room.chargeable.total) < lowest ) {
												lowest = parseFloat(room.chargeable.total);
											}

											var nightlyrates = room.nightlyrates;

											for (var j=0;j<nightlyrates.length;j++) {
												rate = nightlyrates[j];
											}

											var taxes  = room.surcharges;
											if (taxes) {
												for (var j=0;j<taxes.length;j++) {
													tax = taxes[j];
													tax_detail += "<br/><li><span>" + tax.html + "</span><b>$" + parseFloat(tax.amount).toFixed(2) + " <small>" + room.chargeable.currencyCode + "</small></b></li><br/>";
												}
											}
											price = room.chargeable.total;
											description = room.RoomType.description;
											long_description = room.RoomType.descriptionLong;
										} else {
											if (room.chargeable.maxNightlyRate < lowest ) {
												lowest = room.chargeable.maxNightlyRate;
											}
											price = room.chargeable.maxNightlyRate;
											description = room.roomTypeDescription;
											long_description = "";
										}

										$dd  = $template.template({
											ROOMTYPE : description + ((room.nonRefundable == true) ? "<br/>* Non Refundable" : "") ,
											PRICE    : "$" + parseFloat(price).toFixed(2),
											TAXES : tax_detail,
											DETAILS  : long_description,
											INDEX : i+1,
										});

										$dd.appendTo($result);
										$('#low_rate').html("<b>$" + parseFloat(lowest).toFixed(2) +"</b> / Total");
									}
								} else {
									$('dd.btn-check').hide();
									$dd = $("<dd>" + ean_error.presentationMessage +"</dd>");
									$dd.appendTo($result);
								}
								$result.show().find("dd:eq(0)").trigger("click");

							},
							error : function(jqXHR, status, error) {
								alert('An error occurred during request data.');
							},
							complete : function() {
								$('dd.btn-check')
									.find('>.loading').hide().end()
									.find('button').show().removeClass('disabled').end();
							}
						});

						return false;
					})
				.end()
				.find('dl.booking-result')
					.on('click', 'dd', function(){
						$(this).parent().find("dd.selected").removeClass('selected');
						$(this).addClass('selected');
						this.scrollIntoView();
						$('.popup.things-v3.detail div.book-total-price')
							.find('span.price b').text( $(this).attr('data-total') )
						$('.popup.things-v3.detail div.book-total-price')
							.find('button.btn-bookit').attr('data-index', $(this).attr('data-index'))
					})
				.end()
				.find('div.book-total-price')
					.on('click', 'button.btn-bookit', function(){
						var idx = $(this).data('index');
						var room = roomlist[idx-1];

						var params = {
							hotelId  : $(this).attr('data-hotel-id'),
							rateCode : room.rateCode,
						};

						for(var name in roomscache) {
							params[name] = roomscache[name];
						}

						var query = '';
						for(var name in params) {
							query += '&'+name+'='+params[name];
						}

						if(query) query = query.substr(1);
						location.href = 'https://'+location.host+'/ean/hotel/book/?'+query;
					})
				.end()
				.find('.tab-container').click(function(){
					resetHotelResult($(this));
				})
					


			// image list on right side of thing
			var str_currency = $('.things-v3.detail .currency_price').eq(0).text();
			function refresh_currency(){
				var $c_codes, $currency, dlg_currency;

		        dlg_currency = $.dialog('show_currency');
				$currency_list = $('.popup.show_currency .currency-list');
				$currency = $('.things-v3.detail .currency_price');
				
				$currency.eq(0).text(str_currency);

				function text_currency(money, code, symbol) {

					if(typeof(money) == 'number') {
						money = money.toFixed(2);
					}
					money = money.replace(/[ \.]00$/,'');

					var str = str_currency.replace('...', symbol+money+' <a class="code">'+code+'</a>');
					$currency.html(str);
		            $currency.attr('currency', code);
				};

				function show_currency(code, set_code){
					var p = $currency.eq(0).attr('price');

					if(window.numberType === 2) p = p.replace(/,/g, '.').replace(/ /g, '');
					p = p.replace(/,/g, '');

					if(set_code) {
						$.ajax({
							type : 'POST',
							url  : '/set_my_currency.json',
							data : {currency_code:code}
						});
					}

		 			if(code == 'USD') {
					    return $currency.hide().parent().find('.usd').show().html('<a class="code">USD</a>');
					}

					text_currency('...', code, '');
					$currency.css('display','block').parent().find('.usd').html('USD');
					$('.hotel .usd').hide();

					$.ajax({
						type : 'GET',
						url  : '/convert_currency.json?amount='+p+'&currency_code='+code,
						dataType : 'json',
						success  : function(json){
							if(!json || typeof(json.amount)=='undefined') return;
							var price = json.amount.toFixed(2) + '', regex = /(\d)(\d{3})([,\.]|$)/;
							while(regex.test(price)) price = price.replace(regex, '$1,$2$3');

							if(window.numberType === 2) price = price.replace(/,/g, ' ').replace(/\./g, ',');

							text_currency(price, json.currency.code, json.currency.symbol);
						}
					});
				};

				// get currency
				if($currency.eq(0).attr('price')){

					function load_all_currencies(currencies){
						var $left_continents = $currency_list.find('.left ul');					                        
                        $currency_list.find('.right-outer div[code!=all]').remove();
                        var $right_all_major = $currency_list.find('.right-outer .right[code="all"] ul.major');
                        $right_all_major.empty();

                        var $right_all = $currency_list.find('.right-outer .right[code="all"] ul').not('.major');
                            

                        $.each(currencies, function(i, currency) {
                            var continent_code = currency.continent.code;
                            if ($left_continents.find('li.continent[code="'+continent_code+'"]').length <= 0) {
                                $left_continents
                                    .append($('<li/>', {'class':'continent',code:continent_code})
                                        .append($('<a/>', {href:"#", text:currency.continent.name}))
                                    );
                                $currency_list.find('.right-outer')
                                    .append($('<div/>', {'class':'right',code:continent_code})
                                        .append($('<ul/>', {'class':'after'}))
                                    );
                            }
                            var $right_continent = $currency_list.find('.right-outer .right[code="'+continent_code+'"] ul');
                            var $item = $('<li/>', {'class':'currency',code:currency.code})
                                            .append($('<a/>', {href:"$"})
                                                .append($('<b/>', {text:currency.natural_name}))
                                                .append(' ')
                                                .append($('<small/>', {text:currency.code}))
                                                .append($('<span/>', {text:currency.country+" ("+currency.symbol+")"})
                                                    .append($('<b/>'))
                                                )
                                            );
                            $right_continent.append($item.clone());
                            $right_all.append($item.clone());
                            if (currency.is_major) 
                                $right_all_major.append($item.clone());
                        });

                        $currency_list
                            .on('click', 'li.continent a', function(event) {
                                event.preventDefault();
                                var continent_code = $(this).parent().attr('code');
                                $currency_list.find('li.continent a').removeClass("current");
                                $(this).addClass('current');
                                $currency_list.find('.right').each(function() {
                                    if($(this).attr('code') == continent_code) $(this).show();
                                    else $(this).hide();
                                });
                            })
                            .on('click', 'li.currency a', function(event) {
                                event.preventDefault();
                                var currency_code = $(this).parent().attr('code');
                                $currency_list.find('.right li').each(function() {
                                    if ($(this).attr('code') == currency_code) $(this).find('a').addClass('current');
                                    else $(this).find('a').removeClass('current');
                                });
                            })
                            .addClass('loaded');
					}

					if(currencies){
						load_all_currencies(currencies);
					}else{
						setTimeout(function(){
							$.ajax({
				                type: 'GET',
				                url: '/get_all_currencies.json',
				                dataType: 'json',
				                success: function(json) {
				                    if (json && json.currencies) {
				                        currencies = json.currencies;
				                        load_all_currencies(currencies);
				                    }
				                    else return;
				                }
				            });
						},100)
					}
		            

					if ($currency.eq(0).attr('currency')) {
		                show_currency($currency.eq(0).attr('currency'));
					} else {
						setTimeout(function(){
							$.ajax({
								type : 'GET',
								url  : '/get_my_currency.json',
								dataType : 'json',
								success  : function(json){
									if(json && json.currency_code) show_currency(json.currency_code);
								}
							});
						},100)
					}

					var dlg_currency = $.dialog('show_currency');
					dlg_currency.$obj
						.on('open', function(){
							$(this)
								.find('.right-outer .right[code="all"]').show().end()
								.find('.right-outer .right').not('[code="all"]').hide();
						})
						.on('click', 'button.cancel', close_currency)
						.on('click', 'button.save', function(event){
							event.preventDefault();
							var code = $currency_list.find('.right li a.current').parent().attr('code');
							show_currency(code, true);
							close_currency();
						});

					function close_currency() {
						var old_dialog = dlg_currency.$obj.data('old_dialog');
						
						if (old_dialog && old_dialog != 'show_currency') {
							$.dialog(old_dialog).open();
						} else {
							dlg_currency.close();
						}
					};

					$currency.parent().delegate('a.code', 'click', function(event){
						event.preventDefault();
		                if(!$currency_list.hasClass('loaded')) return;

		                var old_dialog_class= $('#popup_container').attr('class');
						dlg_currency.$obj.data('old_dialog', old_dialog_class);

		                var my_currency = $currency.eq(0).attr('currency');
		                if (my_currency) {
		                    var my_currency_selector = 'li.currency[code="'+my_currency+'"]'
		                    $currency_list.find(my_currency_selector).find('a').addClass('current');
		                    var $ul_major = $currency_list.find('.right[code="all"] ul.major');

		                    var $my_currency_item = $ul_major.find(my_currency_selector);
		                    if ($my_currency_item.length == 0) {
		                        var $ul_all = $currency_list.find('.right[code="all"] ul').not('.major');
		                        $my_currency_item = $ul_all.find(my_currency_selector).clone();
		                    }
		                    $ul_major.prepend($my_currency_item)
		                }

						dlg_currency.open();
					});
				}

			};

			refresh_currency();
			

			// "notify" button
			$popup.find('button.notify-available').click(function(event) {
				var $this = $(this), params, url, selected;
				event.stopPropagation();
				event.preventDefault();

				if($this.attr('require_login') === 'true') return require_login();

			        url = '/wait_for_product.json';
			        params = {sale_item_id : $this.attr('item_id')};
			        var option_id = $popup.find('select[name=option_id]').val();
			        if (typeof option_id !== "undefined" && option_id != null && option_id != '') {
				    	params['option_id'] = option_id;
			        }
			        var remove = 0;
				if($this.hasClass('subscribed')){
				    remove = 1;
				    params['remove'] = remove;
				}

			    var $notify = $popup.find('button.notify-available');

				$.ajax({
					type : 'post',
					url  : url,
					data : params,
					dataType : 'json',
					success  : function(json){
					    if(!json || json.status_code == undefined) return;
					    if(json.status_code == 1) {
							if (remove == 1) {
							    $notify.removeClass('subscribed').text(gettext("Notify me when available"));
							    if ("option_id" in params) {
									window.user_waiting_options[option_id] = 'False';
							    }
							} else {
							    $notify.addClass('subscribed').text(gettext("Subscribed"));
							    if ("option_id" in params) {
									window.user_waiting_options[option_id] = 'True';
							    }							    
							}
							if(json.message){
						    	alert(json.message);
						    }
					    } else if (json.status_code == 0 && json.message) {
							alert(json.message);
					    }
					}
				});
			});

			setTimeout(function() {
				var $saleItemInputContainer = $popup.find("fieldset.sale-item-input");

				var $quantitySelectTags = $saleItemInputContainer.find('select[name=quantity]');
				var $quantityTrickSelectContainers = $quantitySelectTags.closest('.trick-select');
				var $quantitySelectLabels = $quantityTrickSelectContainers.find(".selectBox-label");

				$('select[name=quantity]').on('change', function(event) {
					var val = $(this).val();
					var $selectedOption = $(this).children('option:selected');
					$quantitySelectTags.val(val);
					$quantitySelectLabels.text($selectedOption.text());
				}).trigger('change');

				var $optionSelectTags = $saleItemInputContainer.find('select[name=option_id]');
				var $trickSelectContainers = $optionSelectTags.closest('.trick-select');
				var $optionSelectLabels = $trickSelectContainers.find(".selectBox-label");

			 	$popup.find('select[name=option_id]').on('change', function(event) {
				    var val = $(this).val();
				    var $selectedOption = $(this).children('option:selected');
				    $optionSelectTags.val(val);
				    $optionSelectLabels.text($selectedOption.text());
				    var soldout = $selectedOption.attr('soldout') == 'True';
				    var $gift = $popup.find('.btn-create.group-gift'), $notify = $popup.find('button.notify-available');
				    var $btn_cart = $popup.find(".add_to_cart.btn-cart");
				    var is_waiting = window.user_waiting_options[val] == 'True';
				    if (soldout) {
							$btn_cart.removeClass('btns-green-embo')
						    .addClass('btns-blue-embo')
						    .addClass('disabled')
						    .attr("disabled", "disabled")
						    .text(gettext('Sold out'));
							$notify.show();
							$gift.hide();
							if (is_waiting) {
							    $notify.addClass('subscribed');
							    $notify.text(gettext("Subscribed"));
							} else {
							    $notify.removeClass('subscribed');
							    $notify.text(gettext("Notify me when available"));
							}
				    } else {
							$btn_cart.addClass('btns-green-embo')
							    .removeClass('btns-blue-embo')
							    .removeClass('disabled')
							    .removeAttr("disabled")
							    .text(gettext('Add to Cart'));
							$notify.hide();
							if ($gift.hasClass('for-gifting')) {
							    $gift.show();
							}
				    }

					var saleDetail = $popup.find('p.price big .sale-detail').html();
					if( saleDetail ){
						saleDetail = saleDetail.split("·")[0]+"·";
						var remainingQuantity = $(this).find("option:selected").attr("remaining-quantity");
						var soldout = $(this).find("option:selected").attr("soldout") == "True";
						if( soldout ){
							saleDetail = saleDetail + " Sold out";
						}else{
							saleDetail = saleDetail + " Only "+remainingQuantity+" Left";
						}
				        $popup.find('p.price big .sale-detail').html(saleDetail);

				        var $qtySelect = $popup.find("select[name=quantity]").empty();
				        if(remainingQuantity>0){
					        for(var i=1; i<= Math.min(10,remainingQuantity); i++){
					        	$("<option value="+i+">"+i+"</option>").appendTo($qtySelect);
					        }
					        $qtySelect.val(1).trigger('change');
					    }else{
					    	$("<option value=0>0</option>").appendTo($qtySelect);
					    	$qtySelect.val(0).trigger('change');
					    }
				        
					}  

					var findp = $selectedOption.attr('price');

					$('.popup').find('span.currency_price').attr('price',findp);

					if(/^(?:string|number)$/.test(typeof findp)){
						findp = numberFormat(findp);
						$('.popup').find('p.price big').each(function(){
							var firstChild = this.firstChild;
							if (firstChild.nodeType != 3) {
								this.insertBefore(document.createTextNode('$'+findp+' '), firstChild);
							} else {
								firstChild.nodeValue = '$'+findp+' ';
							}
						});
					}
					refresh_currency();

				}).trigger('change');

				// change price for fancybox
			 	$popup.find('select.subscription[name=sale_item_id]').on('change', function(event) {

				    var val = $(this).val();
				    var $selectedOption = $(this).children('option:selected');
				    var findp = $selectedOption.attr('price');

					$('.popup').find('span.currency_price').attr('price',findp);

					if(/^(?:string|number)$/.test(typeof findp)){
						findp = numberFormat(findp);
						$('.popup').find('p.price big').each(function(){
							var firstChild = this.firstChild;
							if (firstChild.nodeType != 3) {
								this.insertBefore(document.createTextNode('$'+findp+' '), firstChild);
							} else {
								firstChild.nodeValue = '$'+findp+' ';
							}
						});
					}
					refresh_currency();
			 	});

				$saleItemInputContainer.find('select#gift-value').on('change', function(event) {
					var $this = $(this);
					var $container = $this.closest('.trick-select');
					var $label = $container.find('.selectBox-label');
					$label.text($this.children('option:selected').text());
				}).trigger('change');
				var $quantityInputTags = $saleItemInputContainer.find("input[name=quantity]");
				$quantityInputTags.on("change keyup mouseup", function(event) {
					var $this = $(this);
					var val = $this.val();
					$quantityInputTags.val(val);
				}).trigger('change');

				// adjust height for description				
				if( dlg_detail.$obj.find(".tab-cont").length){
					var infoHeight = dlg_detail.$obj.offset().top + dlg_detail.$obj.height() - dlg_detail.$obj.find(".tab-cont").offset().top - 31 - (dlg_detail.$obj.find(".quick-shipping:visible").outerHeight()||0)
					dlg_detail.$obj.find(".tab-cont").height( Math.min( 330, infoHeight - 16) ) ;
				}
				
			},200);
			
		}

		return false;
    
    });
	function attachHotkey(){
		$(document).on('keydown.shop', function(event){
			var key = event.which, tid, $li;
			if( $("#popup_container").hasClass("full") || !dlg_detail.showing() || (key != 37 /* LEFT */ && key != 39 /* RIGHT */)) return;

			event.preventDefault();

			dlg_detail.$obj.find(key==37?'>.btn-prev':'>.btn-next').click();
		});
	};

	function detachHotkey(){
		$(document).off('keydown.shop');
	};
});
