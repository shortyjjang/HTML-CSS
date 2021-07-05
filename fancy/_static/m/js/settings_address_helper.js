jQuery(function($){
	var $newAddress = $('#new-adds'),$address_tpl=$("#address_tmpl");

	$newAddress		
		.on('show', function(){
			$(this).show();
			$(this).trigger('reset');
			$('.setting').hide();
		})
		.on('hide', function(){
			$(this).hide();
			$(this).trigger('reset');
			$('.setting').show();
		})
		.on('click', 'button.btn-cancel', function(e){e.preventDefault();$newAddress.trigger('hide')})
		.on('reset', function(){
			$newAddress
				.data('address_id', '')
				.find(':text').val('').end()
				.find('select')
					.prop('selectedIndex',0)
					.filter('[name="country"]')
						.val('US')
						.on('change', function(){
							var $txt_state = $newAddress.find('input.state');
							if(this.value == 'US') {
								$txt_state.removeAttr('name').hide().prev('select').attr('name','state').show();
							} else {
								$txt_state.attr('name','state').show().prev('select').removeAttr('name').hide();
							}
						})
						.trigger('change')
					.end()
				.end()
				.find('.btn-remove').hide().end()
				.find('input:checkbox').prop('checked',false).end()
				.find(':submit').attr('disabled',false);
		})
		.on('click', 'button.btn-remove', function(e){

			event.preventDefault();
			var aid = $newAddress.data('address_id');
			var $row = $("ul.address-list li[aid="+aid+"]");

			if($row.attr('aisdefault')) return alert(gettext('You cannot remove your default address.'));
			if(!confirm(gettext('Do you really want to remove this shipping address?'))) return;
			
			$.ajax({
				type : 'post',
				url  : '/remove_shipping_addr.json',
				data : {id:aid},
				dataType : 'json',
				success  : function(json){
					if(json.status_code === 1){
						$newAddress.trigger('hide');
						$row.fadeOut('fast', function(){$row.remove()});
					} else if (json.status_code === 0){
						if(json.message) alert(json.message);
					}
				}
			})
		})
		.on('submit', 'form', function(event){
			event.preventDefault();

			var $form = $(this), params = {},i,c,e,x;
			for(i=0,c=this.elements.length; i < c; i++){
				e = this.elements[i];
				if(!e.name) continue;
				if(e.type != 'checkbox' || e.checked) params[e.name] = $.trim(e.value);
			}

			var msg = {
				fullname : 'Please enter the full name.',
				nickname : 'Please enter the shipping nickname.',
				address1 : 'Please enter a valid address.',
				city     : 'Please enter the city.',
				zip      : 'Please enter the zip code.',
				phone    : 'Please specify a valid phone number.'
			};

			if(params.phone) params.phone = params.phone.replace(/\s+/g,'');
			if(params.zip)   params.zip   = params.zip.replace(/\s+/g,'');

			for(x in msg){
				if(!params[x] || params[x].length == 0) return alert(gettext(msg[x]));
			}

			if(params.country == 'US' && !/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/.test(params.phone)) return alert(gettext(msg.phone));

			if($newAddress.data('address_id')) {
				params.id = $newAddress.data('address_id');
			}

			var $submit = $form.find(':submit').attr('disabled',true);
			function save(){
				$.ajax({
					type : 'post',
					url  : '/add_new_shipping_addr.json',
					data : params,
					dataType : 'json',
					success  : function(json){
						var x,e;

						if(typeof json.status_code == 'undefined') return;
						switch(json.status_code){
							case 0:
								for(x in json) if(e=form.elements[x]) e.value = json[x];
								if(json.message) alert(json.message);
								break;
							case 1:
								for(x in json) json[x.toUpperCase()] = json[x];
								if(params.set_default == 'true') json['IS_DEFAULT'] = 'true';
								var $row = $address_tpl.template(json), $prev = $('#address-'+params.id);
								$newAddress.trigger('hide');

                                if($('ul.address-list').length == 0) {
                                    location.reload(false);
                                    break;
                                }

								if(json['IS_DEFAULT'] == 'true') {
									$('ul.address-list li[aisdefault]').removeAttr('aisdefault').removeClass('current').find('span.default').remove().end().find('.btn-primary').attr('disabled','disabled');
								} else {
									$row.removeAttr('aisdefault').removeClass('current').find('span.default').remove().end().find('.btn-primary').attr('disabled','disabled');
								}

								$prev.length ? $prev.before($row).remove() : $('ul.address-list').append($row);
								break;
							case 2:
								if(!params.override && confirm(response.messages)) {
									params.override = 'true';
									save();
								}
								break;
						}
					},
					complete : function(){
						$submit.attr('disabled',false);
					}
				});
			};

			// remove an addresss then add new one to mimic editing - Need to API for modifying an address
			if(params.id){
				$.ajax({
					type : 'post',
					url  : '/remove_shipping_addr.json',
					data : {id:params.id},
					dataType : 'json',
					success  : function(json){
						if(json.status_code === 1){
							save();
						} else if (json.status_code === 0){
							$submit.attr('disabled',false);
						}
					},
					error : function(){
						$submit.attr('disabled',false);
					}
				})
			} else {
				save();
			}
		});

	$('#content .setting')
		.delegate('.btn-add-addr', 'click', function(event){
			event.preventDefault();

			$newAddress.find('.tit').text(gettext('Add Shipping Address'));
			$newAddress.trigger('show');

			setTimeout(function(){$newAddress.find(':text:first').focus()},10);
		})
		.delegate('.btn-edit', 'click', function(event){
			var $row = $(this).closest('li');

			event.preventDefault();

			$newAddress.trigger('show');
			$newAddress.data('address_id',$row.attr('aid')).find('.tit').text(gettext('Edit Shipping Address')).end().find('.btn-remove').show();

			setTimeout(function(){$newAddress.find(':text:first').focus()},10);

			// set current values
			var $form = $newAddress.find('form'), fields = 'nickname,fullname,address1,address2,city,country,state,phone,zip'.split(','),i,c;
			for(i=0,c=fields.length; i < c; i++){
				if($row.attr('a'+fields[i])) {
					$form.find('[name="'+fields[i]+'"]').val($row.attr('a'+fields[i]));
					if(fields[i] == 'country') $form.find('[name="country"]').trigger('change');
				}
			}
			if($row.attr('aisdefault') === 'true') $form.find('input:checkbox[name="set_default"]').prop('checked',true);
		})
		.delegate('.btn-primary', 'click', function(event){
			event.preventDefault();
			var $row = $(this).closest('li');
            var uaid = $row.attr('aid');
            $.ajax({
				type : 'post',
				url  : '/update_shipping_addr.json',
				data : {uaid:uaid,set_default:'true'},
				dataType : 'json',
				success  : function(json){
					if(json.status_code === 1){
                        location.reload(false);
					} else if (json.status_code === 0){
						if(json.message) alertify.alert(json.message);
					}
				}
			}   )
		})
		.delegate('.btn-remove', 'click', function(event){
			var $row = $(this).closest('li');

			event.preventDefault();

			if($row.attr('aisdefault')) return alert(gettext('You cannot remove your default address.'));
			if(!confirm(gettext('Do you really want to remove this shipping address?'))) return;

			$.ajax({
				type : 'post',
				url  : '/remove_shipping_addr.json',
				data : {id:$row.attr('aid')},
				dataType : 'json',
				success  : function(json){
					if(json.status_code === 1){
						$row.fadeOut('fast', function(){$row.remove()});
					} else if (json.status_code === 0){
						if(json.message) alert(json.message);
					}
				}
			})
		});

});
