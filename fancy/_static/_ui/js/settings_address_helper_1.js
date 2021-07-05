jQuery(function($){
    var dlg_address = $.dialog('newadds-frm'), $address_tpl = $('#address_tmpl').remove();

    dlg_address.$obj
        .on('click', 'button.ly-close', function(){dlg_address.close()})
        .on('reset', function(){
            dlg_address.$obj
                .data('address_id', '')
                .find(':text').val('').end()
                .find('select')
                    .prop('selectedIndex',0)
                    .filter('[name="country"]')
                        .val('US')
                        .on('change', function(){
                            var $txt_state = dlg_address.$obj.find('input.state');
                            if(this.value == 'US') {
                                $txt_state.removeAttr('name').hide().prev('select').attr('name','state').show();
                            } else {
                                $txt_state.attr('name','state').show().prev('select').removeAttr('name').hide();
                            }
                        })
                        .trigger('change')
                    .end()
                .end()
                .find('input:checkbox').prop('checked',false).end()
                .find(':submit').disable(false);
        })
        .delegate('.btn-delete', 'click', function(event){
            var addr_id = dlg_address.$obj.data('address_id');
            var isdefault = dlg_address.$obj.data('isdefault');
            event.preventDefault();
            if(isdefault == 'true') return alertify.alert(gettext('You cannot remove your default address.'));
            if(!confirm(gettext('Do you really want to remove this shipping address?'))) return;
            var payload = { id: addr_id };
            if (window.is_admin) payload['user_id'] = window.owner_id;
            $.ajax({
                type : 'post',
                url  : '/remove_shipping_addr.json',
                data : payload, 
                dataType : 'json',
                success  : function(json){
                    if(json.status_code === 1){
                        location.reload(false);
                    } else if (json.status_code === 0){
                        if(json.message) alertify.alert(json.message);
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
                fullname : 'Please enter your full name.',
                nickname : 'Please enter a shipping nickname.',
                address1 : 'Please enter the street address.',
                city     : 'Please enter the city.',
                zip      : 'Please enter zip code.',
                phone    : 'Please enter a valid phone number.'
            };

            if(params.phone) params.phone = params.phone.replace(/\s+/g,'');
            if(params.zip)   params.zip   = params.zip.replace(/\s+/g,'');

            for(x in msg){
                if(!params[x] || params[x].length == 0) return alertify.alert(gettext(msg[x]));
            }

            if(params.country == 'US' && !/^(\+1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/.test(params.phone)) return alertify.alert(gettext(msg.phone));

            if(dlg_address.$obj.data('address_id')) {
                params.prev_addr_id = dlg_address.$obj.data('address_id');
            }

            if (window.is_admin) params['user_id'] = window.owner_id;

            var $submit = $form.find(':submit').disable();
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
                            if(json.message) alertify.alert(json.message);
                            break;
                        case 1:
                            for(x in json) json[x.toUpperCase()] = json[x];
                            if(params.set_default == 'true') json['IS_DEFAULT'] = 'true';
                            var $row = $address_tpl.template(json), $prev = $('#address-'+params.id);
                            dlg_address.close();

                            if($('table.chart-address').length == 0) {
                                location.reload(false);
                                break;
                            }

                            if(json['IS_DEFAULT'] == 'true') {
                                $('table.chart-address tr[aisdefault]').removeAttr('aisdefault').find('i.ic-check').remove();
                            } else {
                                $row.removeAttr('aisdefault').find('td>i.ic-check').remove();
                            }

                            $prev.length ? $prev.before($row).remove() : $('table.chart-address').append($row);
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
                    $submit.disable(false);
                }
            });
        });

    $('#content')
        .delegate('.btn-shipping.add_', 'click', function(event){
            event.preventDefault();

            dlg_address.$obj.trigger('reset').find('.ltit').text(gettext('Add shipping address')).end().find('.ltxt dt').html('<b>'+gettext('New shipping address')+'</b><small>'+gettext('Fancy ships worldwide with global delivery services.')+'</small>');
            dlg_address.$obj.find('.btn-delete').hide();
            dlg_address.open();

            setTimeout(function(){dlg_address.$obj.find(':text:first').focus()},10);
        })
        .delegate('.btn-primary.primary_', 'click', function(event){
            event.preventDefault();
            var $row = $(this).closest('div');
            var uaid = $row.attr('aid');
            var payload = {uaid:uaid,set_default:'true'};
            if (window.is_admin) payload['user_id'] = window.owner_id;
            $.ajax({
                type : 'post',
                url  : '/update_shipping_addr.json',
                data : payload,
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

        .delegate('.edit_', 'click', function(event){
            var $row = $(this).closest('div');

            event.preventDefault();

            dlg_address.$obj.trigger('reset').data('address_id',$row.attr('aid')).data('isdefault',$row.attr('isdefault')).find('.ltit').text(gettext('Edit shipping address')).end().find('.ltxt dt').html(gettext('<b>Edit your current shipping address</b><small>Fancy ships worldwide with global delivery services.</small>'));
            dlg_address.$obj.find('.btn-delete').show();
            dlg_address.open();

            setTimeout(function(){dlg_address.$obj.find(':text:first').focus()},10);

            // set current values
            var $form = dlg_address.$obj.find('form'), fields = 'nickname,fullname,address1,address2,city,country,state,phone,zip'.split(','),i,c;
            for(i=0,c=fields.length; i < c; i++){
                if($row.attr('a'+fields[i])) {
                    $form.find('[name="'+fields[i]+'"]').val($row.attr('a'+fields[i])).removeClass('placeholder');
                    if(fields[i] == 'country') $form.find('[name="country"]').trigger('change');
                }
            }
            if($row.attr('aisdefault') === 'true') $form.find('input:checkbox[name="set_default"]').prop('checked',true);
        });
});
