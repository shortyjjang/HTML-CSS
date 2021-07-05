jQuery(function ($) {


    if(typeof expand_url == 'undefined'){
        function expand_url(url) {
            return url;
        }
    }

    /*
     * Customer order detail page
     */
    var isSecureDomain = location.hostname === "secure.fancy.com" || location.href.indexOf('.fancy.com/secure') !== -1 || /fancystorefront.com$/.test(location.hostname);
    var hostPrefix = ''
    if (isSecureDomain) {
        if (location.hostname === "secure.fancy.com") {
            hostPrefix = 'https://fancy.com'
        } else if (location.href.indexOf('.fancy.com/secure') !== -1) {
            hostPrefix = 'https://bigbird.fancy.com'
        } else if (/fancystorefront.com$/.test(location.hostname)) {
            hostPrefix = location.hostname;
        }
    }
    function applySecureDomainOption(requestOption) {
        if (isSecureDomain) {
            requestOption.xhrFields = {
                withCredentials: true
            }
            requestOption.crossDomain = true
        }
        return requestOption
    }
    $('#exchange')
        .delegate('.step1 .sitem .select-qty', 'change', function() { // Select return item quantity 
            var no_item_selected = true;
            $('#exchange .step1 .sitem .select-qty').each(function(idx) {
                if ($(this).val() > 0) no_item_selected = false;
            });

            var $btn_continue = $('#exchange .step1 .btn-continue');
            if (no_item_selected) $btn_continue.hide();
            else $btn_continue.show();
        })
        .delegate('.step1 .order-list .tooltip', 'hover', function() { // Tooltip
            var $small = $(this).find('small');
            $small.css('margin-left',-($small.width()/2)-5+'px');
        })
        .delegate('.step1 .btn-continue', 'click', function() { // Click 'Continue' to step2
            $('#exchange .step1 .sitem').each(function(idx) {
                var soi_id = $(this).attr('soi-id');
                var selected_qty = $(this).find('.select-qty').val();
                var $step2_sitem = $('#exchange .step2 .sitem[soi-id="'+soi_id+'"]');

                // update quantity attribute
                $step2_sitem.attr('qty', selected_qty);

                // change option text
                $step2_sitem.find('.select-req option').each(function() {
                    var option_txt = (selected_qty > 1) ? $(this).attr('option-txt-plural') : $(this).attr('option-txt-singular');
                    $(this).text(option_txt.replace('{{qty}}', selected_qty));
                });
                $step2_sitem.find('.select-req').change();

                if (selected_qty > 0) $step2_sitem.show();
                else $step2_sitem.hide();
            });
            $('#exchange .step2 .select-reason').change();

            $('#exchange div.step1').hide();
            $('#exchange div.step2').show().closest('#exchange').css('margin-top',($(window).height()-$('#exchange').height())/2+'px');
        })
        .delegate('.step2 .select-req', 'change', function() { // Select exchange or return 
            var req_type = $(this).find('option:selected').attr('request-type');
            var $opt_new = $(this).parents('.step2 .sitem').find('.opt_new');
            // var $qty = $(this).parents('.step2 .sitem').find('.qty');
            if (req_type == "exchange") {
                $opt_new.show();
                // $qty.show();
            } else {
                $opt_new.hide();
                // $qty.hide();
            }
        })
    //    .delegate('.step2 .select-reason', 'change', function() { // Show reason text when 'other' is selected 
    //        var other_val = $(this).attr('other-val');
    //        var $reason_txt = $('#exchange .step2 .reason-text');
    //
    //        if ($(this).val() == other_val) $reason_txt.show();
    //        else $reason_txt.hide();
    //    })
        .delegate('.step2 .select-req, .step2 .select-new-option, .step2 .select-new-quantity, .step2 .select-addr, .step2 .select-soption, .step2 .select-reason', 'change', function() {
            // count # of 'exchange' selected
            var exchange_selected_cnt = 0;
            $('#exchange .step2 .select-req').each(function() {
                if ($(this).val() === "exchange") exchange_selected_cnt += 1;
            });

            var optionChosen;
            $('.step2 .select-new-option').each(function() {
                if ($(this).val() !== '') {
                    optionChosen = true;
                }
            });
            var $exchange_only = $('#exchange .step2 .exchange-only');
            if (exchange_selected_cnt > 0) {
                $exchange_only.show();
                var $price = $exchange_only.filter('.price');
                if (!optionChosen) {
                    $price.find('.total').text('0.00');
                    return;
                }

                var $calc = $('#exchange .step2 .price-calc');
                $price.hide(); $calc.show();

                var param = request_params_from_popup();
                $.get(expand_url('/preview-return-request.json'), param, function(response) {
                    if (response.status_code === 1) {
                        if (response.exchange) {
                            update_preview_prices(response.exchange);
                            update_shipping_options(response.exchange.shipping_options, response.exchange.shipping_selected);
                        }
                    }
                    else if (response.status_code === 0 && response.message) {
                        alert(response.message);
                    }
                    else {
                        alert('Please try again later.');
                    }
                    $price.show();
                    $calc.hide();
                });
            } else {
                $exchange_only.hide();
            }
            /*
            if (exchange_selected_cnt > 0) {
                $exchange_only.show();

                var $price = $('#exchange .step2 .price'); 
                var $calc = $('#exchange .step2 .price-calc');
                $price.hide(); $calc.show();

                var param = request_params_from_popup();
                var options = applySecureDomainOption({
                    url: hostPrefix + '/preview-return-request.json',
                    method: 'GET',
                    data: param,
                })
                $.ajax(options).then(function(response) {
                    if (response.status_code == 1) {
                        if (response.exchange) {
                            update_preview_prices(response.exchange);
                            update_shipping_options(response.exchange.shipping_options, response.exchange.shipping_selected);
                        }
                    } 
                    else if (response.status_code == 0 && response.message) {
                        alert(response.message);
                    }
                    else {
                        alert('Please try again later.');
                    }
                    $price.show();
                    $calc.hide();
                });
            }
            else {
                $exchange_only.hide();
            }*/
        })
        .delegate('.step2 .btn-send', 'click', function() { // Send return request
            var param = request_params_from_popup();
            var options = applySecureDomainOption({
                url: expand_url(hostPrefix + '/create-return-request.json'),
                method: 'POST',
                data: param,
            })
            $.ajax(options).then(function(response) {
                if (response.status_code == 1) {
                    // should fill in step3 from step2 data
                    if (isSecureDomain) {
                        var returnTable = $('#exchange div.step3 .return .tb-orders tbody')
                        var exchangeTable = $('#exchange div.step3 .exchange .tb-orders tbody')

                        $('#exchange .step2 .sitem').each(function(i, e) {
                            var $self = $(e)
                            var cell = $self.find('.title').clone()
                            var reason = $('.step2 .reason-text').val()
                            $('#exchange .step3 .reason p').append(reason)
                            // request is return
                            var isReturn = $self.find('.select-req option:selected').attr('request-type') === 'return'
                            var row, qty;
                            if (isReturn) {
                                row = $('<tr />')
                                qty = $('.step1 .sitem[soi-id="' + $self.attr('soi-id') + '"] .select-qty').val()
                                row.append($('<td />').append(cell))
                                row.append($('<td />').append(qty))
                                returnTable.append(row)
                            // request is exchange
                            } else {
                                row = $('<tr />')
                                row.append($('<td />').append(cell))
                                var exchangingItem = $self.find('.title').clone()
                                exchangingItem.find('span').text($('.step2 .select-new-option option:selected').text())
                                row.append($('<td />').append(exchangingItem))
                                exchangeTable.append(row)
                            }
                        });
                        if (returnTable.text().trim() === '') {
                            returnTable.closest('.return').hide()
                        }
                        if (exchangeTable.text().trim() === '') {
                            exchangeTable.closest('.exchange').hide()
                        }
                    }

                    $('#exchange div.step2').hide();
                    $('#exchange div.step3').show().closest('#exchange').css('margin-top',($(window).height()-$('#exchange').height())/2+'px');
                }
                else if (response.status_code == 0 && response.message) {
                    alert(response.message);
                }
                else {
                    alert('Please try again later.');
                }
            });
        })
        .delegate('.step2 .btn-back', 'click', function() { // Go back to step1
            $('#exchange div.step2').hide();
            $('#exchange div.step1').show().closest('#exchange').css('margin-top',($(window).height()-$('#exchange').height())/2+'px');
        })
        .delegate('.step3 .btn-done', 'click', function() { // Close popup
            $.dialog('exchange_return').close();
            location.reload(false);
        })

    function request_params_from_popup() {
        var req_items = [];
        var exchange_selected_cnt = 0;
        $('#exchange .step2 .sitem').each(function(idx) {
            if ($(this).is(':hidden')) return;
            var soi_id = $(this).attr('soi-id');
            var quantity = $(this).attr('qty');
            var req_type = $(this).find('.select-req option:selected').attr('request-type');
            var is_exchange = (req_type == "exchange");
            var new_option_id = (is_exchange) ? $(this).find('.select-new-option').val() : undefined;
            var new_quantity = (is_exchange) ? $(this).find('.select-new-quantity').val() : undefined;
            if (is_exchange) exchange_selected_cnt += 1;

            var req_item = {
                soi_id: soi_id,
                quantity: quantity,
                type: req_type,
                new_option_id: new_option_id,
                new_quantity: new_quantity
            };

            req_items.push(req_item);
        });
        var order_id = $('#exchange').attr('order-id');
        var order_code = $('#exchange').data('order-code');
        var reason = $('#exchange .step2 .select-reason').val();
        var reason_txt = $('#exchange .step2 .reason-text').val();
        var shipping_addr_id = $('#exchange .step2 .select-addr').val();
        var card_id = (exchange_selected_cnt > 0) ? $('#exchange .step2 .select-card').val() : undefined;
        var shipping_option = (exchange_selected_cnt > 0) ? $('#exchange .step2 .select-soption').val() : undefined;

        var param = {
            request_items: JSON.stringify(req_items),
            order_id: order_id,
            reason: reason,
            reason_txt: reason_txt,
            shipping_addr_id: shipping_addr_id,
            shipping_option: shipping_option,
            card_id: card_id,
            is_storefront: isSecureDomain,
        };
        if(order_code) {
            param.order_code = order_code;
        }
        return param;
    }

    function update_preview_prices(exchange_costs) {
        var $price = $('#exchange .step2 .price');
        $price
            .find('.subtotal').text(exchange_costs.subtotal_price).end()
            .find('.shipping').text(exchange_costs.shipping).end()
            .find('.tax').text(exchange_costs.tax).end()
            .find('.total').text(exchange_costs.total_price).end();
        if (parseFloat(exchange_costs.fancy_rebate)) $price.find('.credit').text("- " + exchange_costs.fancy_rebate).parent('li').show();
        else $price.find('.credit').parent('li').hide();
        if (parseFloat(exchange_costs.fancy_gift_card)) $price.find('.gift-card').text("- " + exchange_costs.fancy_gift_card).parent('li').show();
        else $price.find('.gift-card').parent('li').hide();
    }

    function update_shipping_options(shipping_options, selected) {
        var $select = $('#exchange .step2 .select-soption');
        $select.empty();
        $.each(shipping_options, function(idx, option) {
            $('<option/>').attr('value', option.id).data('amount', option.amount).data('detail', option.detail).text(option.label).appendTo($select);
        });
        $select.val(selected);
    }

    // function show_exchange_items(exchange_items) {
    //     var $div = $('#exchange .step3 .exchange');
    //     var $tbody = $div.find('.tb-orders tbody');

    //     $.each(exchange_items, function(idx, item) {
    //         var $td_original = $('<td/>').append(
    //             $('<div/>').addClass('item')
    //                 .append($('<img/>').attr('src', "/_ui/images/common/blank.gif").css('background-image', 'url('+item.sale_item.sale_item_images[0].thumb_image_url_310+')'))
    //                 .append($('<b/>').text(item.sale_item.title))
    //                 .append($('<span/>').addClass('option').text((item.sale_item_option) ? item.sale_item_option.option : ""))
    //                 .append($('<span/>').addClass('qty').text("Quantity: "+item.quantity))
    //         );
    //         var $td_new = $('<td/>').append(
    //             $('<div/>').addClass('item')
    //                 .append($('<img/>').attr('src', "/_ui/images/common/blank.gif").css('background-image', 'url('+item.new_item.sale_item_images[0].thumb_image_url_310+')'))
    //                 .append($('<b/>').text(item.new_item.title))
    //                 .append($('<span/>').addClass('option').text((item.new_item_option) ? item.new_item_option.option : ""))
    //                 .append($('<span/>').addClass('qty').text("Quantity: "+item.new_quantity))
    //         );
    //         $tbody.append($('<tr/>').append($td_original).append($td_new));
    //     });

    //     if (!exchange_items.length) $div.hide();
    // }

    // function show_return_items(return_items) {
    //     var $div = $('#exchange .step3 .return');
    //     var $tbody = $div.find('.tb-orders tbody');

    //     $.each(return_items, function(idx, item) {
    //         var $td_item = $('<td/>').append(
    //             $('<div/>').addClass('item')
    //                 .append($('<img/>').attr('src', "/_ui/images/common/blank.gif").css('background-image', 'url('+item.sale_item.sale_item_images[0].thumb_image_url_310+')'))
    //                 .append($('<b/>').text(item.sale_item.title))
    //                 .append($('<span/>').addClass('option').text((item.sale_item_option) ? item.sale_item_option.option : ""))
    //         );
    //         var $td_quantity = $('<td/>').text(item.quantity);
    //         $tbody.append($('<tr/>').append($td_item).append($td_quantity));
    //     });

    //     if (!return_items.length) $div.hide();
    // }

    // function show_reason(reason) {
    //     var $div = $('#exchange .step3 .reason');
    //     var reason_text = (reason.description.length > 0) ? (reason.title + " - " + reason.description) : (reason.title);
    //     $div.find('p').text(reason_text);
    // }

    function show_return_items_popup(request_id, rma_url, label_url, show_print_label, show_sent_button) {
        var $returnItemsPopup = $('.popup.return_item');
        $returnItemsPopup.data('request-id', request_id);
        $returnItemsPopup.data('show-print-label', show_print_label);
        if (show_print_label) {
            $returnItemsPopup
                .find('.print').show().end()
                .find('.tracking').hide().end()
                .find('.btn-print-label').data('label-url', label_url);
        }
        else {
            $returnItemsPopup
                .find('.print').hide().end()
                .find('.tracking').toggle(show_sent_button);
        }
        $returnItemsPopup.find('a.print-rma').attr('href', rma_url);
        
        $returnItemsPopup.find('.btn-done').toggle(show_sent_button);

        $.dialog('return_item').open();
    }

    $('.order-item.return')
        .delegate('.btn-send-popup', 'click', function() {
            var $request = $(this).closest('.order-item.return');
            var request_id = $request.data('request-id');
            var show_print_label = $request.data('show-print-label');
            var rma_url = $request.data('rma-url');
            var label_url = $request.data('label-url');

            show_return_items_popup(request_id, rma_url, label_url, show_print_label, true);

            return false;
        })
        .delegate('.btn-rma-popup', 'click', function() {
            var $request = $(this).closest('.order-item.return');
            var request_id = $request.data('request-id');
            var show_print_label = $request.data('show-print-label');
            var rma_url = $request.data('rma-url');
            var label_url = $request.data('label-url');

            show_return_items_popup(request_id, rma_url, label_url, show_print_label, false);
        })
        .delegate('.btn-cancel', 'click', function() {
            var request_id = $(this).closest('.order-item.return').data('request-id');
            if (confirm("Do you want to cancel this request?")) {
                var options = applySecureDomainOption({
                    url: expand_url(hostPrefix + '/return-requests/cancel-return-request.json'),
                    method: 'POST',
                    data: {request_id: request_id},
                })
                $.ajax(options).then(function(response) {
                    if (response.status_code == 1) {
                        location.reload(false);
                    }
                    else if (response.status_code == 0 && response.message) {
                        alert(response.message);
                    }
                    else {
                        alert('Please try again later.');
                    }
                });
            }
            return false;
        });

    $('.popup.return_item')
        .delegate('.btn-print-label', 'click', function() {
            var label_url = $(this).data('label-url');
            var win = window.open(label_url, '_blank');
            win.focus();
        })
        .delegate('.btn-done', 'click', function() {
            var $popup = $(this).closest('.return_item');
            var request_id = $popup.data('request-id');
            var show_print_label = $popup.data('show-print-label');
            var params = { request_id: request_id };
            if (!show_print_label) {
                var carrier = $popup.find('.select-carrier').val();
                var tracking = $popup.find('.input-tracking').val();
                params['carrier'] = carrier;
                params['tracking'] = tracking;
            }
            var options = applySecureDomainOption({
                url: expand_url(hostPrefix + '/return-requests/send-return-items.json'),
                method: 'POST',
                data: params,
            })
            $.ajax(options).then(function(response) {
                if (response.status_code == 1) {
                    $.dialog('return_item').close();
                    location.reload(false);
                }
                else if (response.status_code == 0 && response.message) {
                    alert(response.message);
                }
                else {
                    alert('Please try again later.');
                }
            });
        })

    /*
     * Merchant Return/Exchange Dashboard
     */
    var $assignPopup = $('.popup.assign_warehouse_return_address');
    var $textState = $assignPopup.find('.custom input[name="state"]');
    var $selectState = $assignPopup.find('.custom select[name="state"]');
    var urlPathPrefix = window.exchange_api_url_path_prefix || '/merchant/orders/return-requests';
    var $labelPopup = $('.popup.process_return');
    var $rejectPopup = $('.popup.reject-order');
    var $arrivedPopup = $('.popup.mark-arrived');

    $('.order-return')
        .delegate('.btn-edit.assign', 'click',  function() {
            var request_id = $(this).parents('.return-info').attr('request-id');
            $assignPopup.attr('request-id', request_id);
            $assignPopup.trigger('return_addr_reset');
            $.dialog('assign_warehouse_return_address').open();
            return false;
        })
        .delegate('.btn-label', 'click', function() {
            var request_id = $(this).parents('.return-info').attr('request-id');
            var estimated_weight = $(this).parents('.return-info').attr('estimated-weight');
            $labelPopup.attr('request-id', request_id);
            $labelPopup.find('.fedex input.weight').val(estimated_weight);
            $.dialog('process_return').open();
            return false;
        })
        .delegate('.btn-edit.arrived', 'click', function() {
            var request_id = $(this).parents('.return-info').attr('request-id');
            $.get(expand_url(urlPathPrefix + '/mark-arrived-popup.json'), {request_id: request_id}, function(response) {
                if (response.status_code == 1 && response.html) {
                    $arrivedPopup.html(response.html);
                    $.dialog('mark-arrived').open();
                }
                else if (response.status_code == 0 && response.message) {
                    alert(response.message);
                }
                else {
                    alert('Please try again later.');
                }
            });
            return false;
        })
        .delegate('.btn-edit.complete', 'click', function() {
            var request_id = $(this).parents('.return-info').attr('request-id');
            $.get(expand_url(urlPathPrefix + '/view-complete-popup.json'), {request_id: request_id}, function(response) {
                if (response.status_code == 1) {
                    $('.popup.request_end').html(response.html);
                    $.dialog('request_end').open();
                }
                else if (response.status_code == 0 && response.message) {
                    alert(response.message);
                }
                else {
                    alert('Please try again later.');
                }
            });

            return false;
        })
        .delegate('.btn-reject', 'click', function() {
            var request_id = $(this).parents('.return-info').attr('request-id');
            $('.popup.reject-order').attr('request-id', request_id);
            $.dialog('reject-order').open();
            return false;
        });

    $assignPopup.find('.custom select[name="country"]').change(function () {
        if ($(this).val() == 'US') {
            $textState.hide();
            $selectState.show();
        } else {
            $selectState.hide();
            $textState.show();
        }
    });

    $assignPopup.on('return_addr_reset', function () {
        $assignPopup.find('input[type="text"]').each(function () {
            $(this).val('');
        });

        $assignPopup.find('select option:selected').removeAttr('selected');
        $assignPopup.find('select[name="country"]').val('US');
        $assignPopup.find('.custom select[name="country"]').trigger('change');
    });

    $assignPopup.find('.btn-assign').click(function() {
        var request_id = $assignPopup.attr('request-id');
        var warehouse_checked = $assignPopup.find('input#return_1').is(':checked');
        var warehouse_id = warehouse_checked? $assignPopup.find('select#warehouse').val(): null;
        var address_id = $assignPopup.attr('address-id');

        var params = {request_id: request_id, warehouse_id: warehouse_id, address_id: address_id};

        if (!warehouse_checked) {
            var form = $('#return_addr_form')[0], i, e, x;
            for (i = 0; i < form.elements.length; i++) {
                e = form.elements[i];
                if (!e.name) continue;
                if (!$(e).is(':visible')) continue;

                if ($(e).attr('placeholder') != $(e).val()) {
                    params[e.name] = $.trim(e.value);
                } else {
                    params[e.name] = '';
                }
            }

            var msg = {
                full_name: 'Please enter the full name.',
                address1: 'Please enter a valid address.',
                city: 'Please enter the city.',
                zip: 'Please enter the zip code.',
                contact_phone: 'Please specify a valid phone number.'
            };

            if (params.contact_phone) params.contact_phone = params.contact_phone.replace(/\s+/g, '');
            if (params.zip) params.zip = params.zip.replace(/\s+/g, '');

            for (x in msg) {
                if (!params[x] || params[x].length == 0) return alertify.alert(gettext(msg[x]));
            }

            if (params.country == 'US' && !/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/.test(params.contact_phone)) {
                return alertify.alert(gettext(msg.contact_phone));
            }
        }

        $.post(expand_url(urlPathPrefix + '/assign-warehouse.json'), params, function(response) {
            if (response.status_code == 1) {
                $.dialog('assign_warehouse_return_address').close();
                location.reload(false);
            } else if (response.status_code == 0 && response.message) {
                alert(response.message);
            } else {
                alert('Please try again later.');
            }
        });
        return false;
    });

    $('.popup.assign_warehouse_return_address .btn-cancel').click(function () {
        $.dialog('assign_warehouse_return_address').close();
        return false;
    });

    $('.popup.request_end .btn-cancel').click(function () {
        $.dialog('request_end').close();
        return false;
    });

    $rejectPopup
        .delegate('.btn-reject', 'click', function() {
            var request_id = $rejectPopup.attr('request-id');
            var note = $rejectPopup.find('.txt-note').val();
            $.post(expand_url(urlPathPrefix + '/reject.json'), {request_id: request_id, note:note}, function(response) {
                if (response.status_code == 1) {
                    location.reload(false);
                }
                else if (response.status_code == 0 && response.message) {
                    alert(response.message);
                }
                else {
                    alert('Please try again later.');
                }
            });
            return false;
        });

    $labelPopup
        .delegate('.step1 a', 'click', function() {
            $(this)
                .closest('.step1').find('a')
                    .removeClass('selected')
                .end().end()
            .addClass('selected');
            return false;
        })
        .delegate('.step1 .btn-next', 'click', function() {
            var has_selected = $(this).closest('.step1').find('a.selected').length > 0;
            var selected_next = $(this).closest('.step1').find('a.selected').attr('next');
            if (has_selected) {
                $(this).closest('.popup')
                    .find('.step1').hide().end()
                    .find('div.'+selected_next).show();
            }
        })
        .delegate('.fedex .btn-back, .other .btn-back', 'click', function() {
            $('.fedex, .other').hide();
            $('.step1').show();
        })
        .delegate('.fedex .btn-calculate', 'click', function() {
            var request_id = $(this).closest('.process_return').attr('request-id');
            var service = $(this).closest('.fedex').find('select.select-service').val();
            var weight = $(this).closest('.fedex').find('input.weight').val();
            var params = {
                request_id: request_id, service: service, weight: weight
            }
            $.get(expand_url(urlPathPrefix + '/get-return-shipping-rate.json'), params, function(response) {
                if (response.status_code == 1) {
                    var shipping_cost = response.shipping_cost;
                    $labelPopup.find('.fedex .shipping').text('$'+shipping_cost);
                }
                else if (response.status_code == 0 && response.message) {
                    alert(response.message);
                }
                else {
                    alert('Please try again later.');
                }
            });
            return false;
        })
        .delegate('.fedex .btn-confirm', 'click', function() {
            var request_id = $(this).closest('.process_return').attr('request-id');
            var service = $(this).closest('.fedex').find('select.select-service').val();
            var weight = $(this).closest('.fedex').find('input.weight').val();
            var params = {
                request_id: request_id, service: service, weight: weight
            }
            $.post(expand_url(urlPathPrefix + '/create-return-shipping-label.json'), params, function(response) {
                if (response.status_code == 1) {
                    $.dialog('process_return').close();
                    location.reload(false);
                }
                else if (response.status_code == 0 && response.message) {
                    alert(response.message);
                }
                else {
                    alert('Please try again later.');
                }
            });
            return false;
        })
        .delegate('.other input.label', 'change', function() {
            var filename = $(this).val().split('\\').pop();
            $('.other input.filename').val(filename);
        })
        .delegate('.other .btn-confirm', 'click', function() {
            var request_id = $(this).closest('.process_return').attr('request-id');
            var carrier = $(this).closest('.other').find('select.select-carrier').val();
            var tracking = $(this).closest('.other').find('input.tracking').val();
            var files = $(this).closest('.other').find('input.label')[0].files;
            if (!files.length) {
                alert("Please select a label image file.");
                return false;
            }
            var label = files[0];

            var formData = new FormData();
            formData.append('request_id', request_id);
            formData.append('carrier', carrier);
            formData.append('tracking', tracking);
            formData.append('label', label);
            $.ajax({
                type: 'POST',
                url: expand_url(urlPathPrefix + '/upload-return-shipping-label.json'),
                data: formData, 
                processData: false, contentType: false, 
                enctype: 'multipart/form-data', 
                success: function(response) {
                    if (response.status_code == 1) {
                        $.dialog('process_return').close();
                        location.reload(false);
                    }
                    else if (response.status_code == 0 && response.message) {
                        alert(response.message);
                    }
                    else {
                        alert('Please try again later.');
                    }
                }
            });
            return false;
        })

    $arrivedPopup
        .delegate('.btn-save', 'click', function() {
            var $data_field = $arrivedPopup.find('.data-field');
            var request_id = $data_field.data('request-id');
            var tracking_id = $data_field.data('tracking-id');
            var items_received = [];
            $data_field.find('.item-data').each(function() {
                var item_number = $(this).data('item-number').toString();
                var order_number = $(this).data('order-number').toString();
                var qty_received = parseInt($(this).find('input.qty-received').val());
                var item_status = $(this).find('.select-status').val();
                var $note = $('#'+$(this).attr('note-id'));
                var note = ($note.is(':visible')) ? $note.find('input.note').val() : undefined;
                items_received.push([item_number, order_number, qty_received, item_status, note]);
            });
            for (var i=0; i<items_received.length; i++) {
                if(!items_received[0][2]) {
                    alert("QTY Received must be an integer greater than 0.");
                    return false;
                }
            }
            var params = {
                request_id: request_id, tracking_id: tracking_id, items_received: JSON.stringify(items_received)
            };
            $.post(expand_url(urlPathPrefix+'/mark-arrived.json'), params, function(response) {
                if (response.status_code == 1) {
                    location.reload(false);
                }
                else if (response.status_code == 0 && response.message) {
                    alert(response.message);
                }
                else {
                    alert('Please try again later.');
                }
            });
            return false;
        })
        .delegate('.item a', 'click', function() {
            return false;
        })
        .delegate('.btn-note', 'click', function() {
            $(this).closest('tr').next().toggle();
            return false;
        });
    function openEditPopup($button) {
        var request_id = $button.parents('.return-info').attr('request-id');
        $assignPopup.attr('request-id', request_id);
        $assignPopup.trigger('return_addr_reset');

        var $assigned_address_tbl = $button.parents('.return-info').find('table#assigned_address');
        var $assigned_warehouse_tbl = $button.parents('.return-info').find('table#assigned_warehouse');

        if ($assigned_address_tbl.length > 0) {
            var address_id = $assigned_address_tbl.attr('addr-id');
            var full_name = $assigned_address_tbl.attr('addr-full-name');
            var address1 = $assigned_address_tbl.attr('addr-address1');
            var address2 = $assigned_address_tbl.attr('addr-address2');
            var country = $assigned_address_tbl.attr('addr-country');
            var city = $assigned_address_tbl.attr('addr-city');
            var state = $assigned_address_tbl.attr('addr-state');
            var zip = $assigned_address_tbl.attr('addr-zip');
            var contact_phone = $assigned_address_tbl.attr('addr-contact-phone');

            $assignPopup.attr('address-id', address_id);
            $assignPopup.find('input[name="full_name"]').val(full_name);
            $assignPopup.find('input[name="address1"]').val(address1);
            $assignPopup.find('input[name="address2"]').val(address2);
            $assignPopup.find('select[name="country"]').val(country);
            $assignPopup.find('input[name="city"]').val(city);

            if (country == 'US') {
                $textState.val('');
                $selectState.val(state);
            } else {
                $selectState.val('');
                $textState.val(state);
            }
            $assignPopup.find('.custom select[name="country"]').trigger('change');

            $assignPopup.find('input[name="zip"]').val(zip);
            $assignPopup.find('input[name="contact_phone"]').val(contact_phone);
        }

        if ($assigned_warehouse_tbl.length > 0) {
            var warehouse_id = $assigned_warehouse_tbl.attr('warehouse-id');
            $assignPopup.find('select#warehouse').val(warehouse_id);
        }

        if ($assigned_address_tbl.length > 0 && $assigned_address_tbl.is(':visible')) {
            $assignPopup.find('input#return_2').prop('checked', true); // custom return address
            $assignPopup.find('input#return_1').prop('checked', false); // warehouse
        } else {
            $assignPopup.find('input#return_2').prop('checked', false); // custom return address
            $assignPopup.find('input#return_1').prop('checked', true); // warehouse
        }

        $.dialog('assign_warehouse_return_address').open();
    }

    $('a#change_adds').click(function () {
        openEditPopup($(this)); return false;
    });

    $('a#change_warehouse').click(function () {
        openEditPopup($(this)); return false;
    });

    // merchant note
    var $merchantNotePopup = $('.popup.merchant_note');
    $('a.btn-note').click(function () {
        var request_id = $(this).parents('.return-info').attr('request-id');
        var merchant_note = $(this).parents('.return-info').attr('merchant-note');

        $merchantNotePopup.attr('request-id', request_id);
        $merchantNotePopup.find('textarea#merchant_note').val(merchant_note);

        $.dialog('merchant_note').open();
        $merchantNotePopup.find('textarea#merchant_note').focus();
        return false;
    });

    $merchantNotePopup.find('.btn-save').click(function () {
        var merchant_note = $.trim($merchantNotePopup.find('textarea#merchant_note').val());
        var request_id = $merchantNotePopup.attr('request-id');
        var params = {request_id: request_id, merchant_note: merchant_note};

        $.post(expand_url(urlPathPrefix + '/update-merchant-note.json'), params, function(response) {
            if (response.status_code == 1) {
                $.dialog('merchant_note').close();
                location.reload(false);
            } else if (response.status_code == 0 && response.message) {
                alert(response.message);
            } else {
                alert('Please try again later.');
            }
        });
    });

    $(document.body)
        .on('click', '.btn-cancel-request', function(e) {
            e.preventDefault();
            if (confirm(gettext("Do you really want to cancel this exchange/return request?"))) {
                var request_id = $(this).data('request-id');
                var options = applySecureDomainOption({ url: expand_url(hostPrefix + '/return-requests/cancel-return-request.json'), method: 'POST', data: { request_id: request_id}})
                $.ajax(options).then(function(response) {
                    if (response.status_code == 1) {
                        location.reload(false);
                    } else if (response.status_code == 0 && response.message) {
                        alert(response.message);
                    } else {
                        alert(gettext('Please try again later.'));
                    }
                });
            }
        })
        .on('click', '.btn-approve-request', function(e) {
            e.preventDefault();
            var request_id = $(this).data('request-id');
            if (request_id) {
                window.open('/merchant/orders/return-requests/' + request_id + '?approve')
            }
        });
});
