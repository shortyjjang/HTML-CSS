$(function(){
	var currencies;
	window.user_waiting_options = {};
	
	var saleItems = {};
	var isCalling = false;
	var prefetchTimer;
	$(document).on('mouseover','.figure-item .btn-cart, a.btn-cart',function(e){
		var $this = $(this);

		if( $this.hasClass("nopopup") || $this.closest('.show_cart').find('em').length ) return;

    	if ($.isFunction($this.data('updateAttrs'))) {
			$this.data('updateAttrs')();
		}

		var sid = $this.attr('data-id'), thing_id = $this.attr('data-thing-id'), param = {sale_item_id:sid, thing_id:thing_id, 'new':true, 'small':true, 'via': $this.attr('data-via'), 'section': $this.attr('data-section')};
		if( saleItems.sid ) return;
		var login_require = $(this).attr('require_login');
		if (typeof(login_require) != undefined && login_require != null && login_require=='true'){
			return;
		}
		
		$this.nextAll('em').remove();
		if(saleItems[sid]){
			$(saleItems[sid]).insertAfter($this);
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
	$(document).on('mouseout','.figure-item .btn-cart, a.btn-cart',function(e){
		if(prefetchTimer) clearTimeout(prefetchTimer);		
	});

	$(document).on('mouseleave','.figure-item',function(e){
		var $this = $(this);
		$this.find('.show_cart em').find(".trick").click({ cleanup: true });
		if( $this.find(".show_cart .btn-cart").hasClass("nopopup") ) return;
		$this.find('.show_cart em').remove();
	});

    $(document).on('click','.figure-item .btn-cart, a.btn-cart',function(e){
		var $this = $(this);

    	if( $this.is(".giftcard") ) return;

    	e.preventDefault();
    	
		if( $(this).hasClass("nopopup") || $(this).closest('.show_cart').find('em').length ) return;

    	if ($.isFunction($(this).data('updateAttrs'))) {
			$(this).data('updateAttrs')();
		}

        var sid = $(this).attr('data-id'), thing_id = $(this).attr('data-thing-id'), param = {sale_item_id:sid, thing_id:thing_id, 'new':true, 'small':true, 'via': $this.attr('data-via'), 'section': $this.attr('data-section')};
        $body = $('body');
        
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
			$this.nextAll('em').remove();

			$(html).insertAfter($this);

			// click add_to_cart immediately
			var $show_cart = $this.closest('.show_cart');
			if( $show_cart.data('click') && $show_cart.find("select[name=option_id] option").length < 2 && !$show_cart.find("button.add_to_cart").attr('style') ){				
				$this.closest('.show_cart').find('.add_to_cart').click();
			}else{
				$this.closest('li').addClass('active').find('.opened').removeClass('opened').end().find('.show_cart').addClass('opened');				
			}
            if ($show_cart.data('click')) $show_cart.trigger('mixpanel');

			var header_top = $('#header').height() + 142;
			if ($('#header_summary').hasClass('show')) {header_top = header_top + $('#header_summary').height()}

			if ($this.offset().top-$(window).scrollTop() < header_top){
				$this.closest('li').find('.sale-item-input').addClass('bot');
			}
			else{
				$this.closest('li').find('.sale-item-input').removeClass('bot');
			}

		}

		return false;
    
    });

	$(document).on('change', 'span.show_cart select[name=option_id]', function(event) {
		var $this = $(this);
		var $selectedOption = $this.children('option:selected');
		var $quantitySelectTags = $this.siblings('select[name=quantity]');
		var remainingQuantity = parseInt($selectedOption.attr('remaining-quantity'));

		var currentlySelectedQuantity = parseInt($quantitySelectTags.val());
		if (currentlySelectedQuantity > remainingQuantity) {
			currentlySelectedQuantity = remainingQuantity;
		}
		$quantitySelectTags.empty();
		for (var i=1; i<=remainingQuantity && i<=10; i++) {
			$quantitySelectTags.append('<option value="' + i + '">' + i + '</option>');
		}
		$quantitySelectTags.val(currentlySelectedQuantity);
	});

	$('#content,#sidebar,#popup_container').delegate('.show_cart button.btn-notify','click',function(event){
		var $this = $(this);		
        var sid = $this.attr('item_id');
        delete saleItems[sid];
	});
	
});
