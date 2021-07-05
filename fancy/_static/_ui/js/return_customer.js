jQuery(function ($) {
    // From return_seller
    function send_ajax_with_json_response(url, params, success, method, onError) {
        var func;
        if (method.toLowerCase() == 'get') func = $.get;
        else func = $.post;

        var promise = func('/return-requests' + url, params, function(response) {
            if (response.status_code == 1) {
                success(response);
            } else {
                var msg;
                if (response.status_code == 0 && response.message) {
                    msg = response.message;
                } else {
                    msg = 'Please try again later.';
                }
                alertify.alert(msg);
                onError && onError();
            }
        });
        if (onError != null) {
            promise.fail(onError);
        }
    }

    /*
     * Create return request popup
     */
    $('#exchange')
        .delegate('.step1 .sitem .select-qty', 'change', function() {
            // Select return item quantity
            var no_item_selected = true;
            $('#exchange .step1 .sitem .select-qty').each(function(idx) {
                if ($(this).val() > 0) no_item_selected = false;
            });

            var $btn_continue = $('#exchange .step1 .btn-continue');
            if (no_item_selected) $btn_continue.hide();
            else $btn_continue.show();
        })
        .delegate('.step1 .order-list .tooltip', 'hover', function() {
            // Tooltip
            var $small = $(this).find('small');
            $small.css('margin-left',-($small.width()/2)-5+'px');
        })
        .delegate('.step1 .btn-continue', 'click', function() {
            // Click 'Continue' to step2
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
        .delegate('.step2 .select-req', 'change', function() {
            // Select exchange or return
            var $this = $(this);
            var req_type = $this.val();
            var $item = $this.parents('.step2 .sitem');
            var $notice = $this.parents('.step2').find('.approve-needed');
            var $opt_new = $item.find('.opt_new');
            var $charge_notice = $item.find('.charge-notice');

            if (req_type === "exchange") {
                $notice.show();
                $opt_new.show();
                $charge_notice.show();
            } else {
                $notice.hide();
                $opt_new.hide();
                $charge_notice.hide();
            }

        })
        .delegate('.step2 .new-addr', 'click', function(e) {
            e.preventDefault();
            show_new_address_popup();
        })
        .delegate('.step2 .select-req, .step2 .select-new-option, .step2 .select-addr, .step2 .select-soption, .step2 .select-reason',
                  'change', function(event) {
            // When exchange/return, item quantity, shipping option or return address is changed, get the preview of exchange order.
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
                $.get('/preview-return-request.json', param, function(response) {
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
        })
        .delegate('.step2 .btn-send', 'click', function() {
            // Validate if user needs to be sent back
            var $currentStep = $('#exchange .step2');
            // Did user fill out exchange options?
            var shouldAskExchangeOption = false;
            $currentStep.find('.select-new-option').each(function (i, e) {
                // If `shouldAskExchangeOption` is `true`, we don't need to do check anymore
                if (shouldAskExchangeOption === true) {
                    return;
                }
                
                var $el = $(e);
                var optionIsExchange = $el.parents('.step2 .sitem')
                                          .find('.select-req').val() === 'exchange';
                var valueIsEmpty = $el.val() === '';
                if (optionIsExchange && valueIsEmpty) {
                    shouldAskExchangeOption = true;
                }
            });
            if (shouldAskExchangeOption) {
                alertify.alert(gettext('Please choose an exchange option.'));
                return;
            }
            // Did user fill out reasons?
            var $reasonText = $currentStep.find('.reason-text');
            var shouldAskReason = $currentStep.find('.select-reason').val() === '5' &&
                                  $.trim($reasonText.val()) === '';
            if (shouldAskReason) {
                alertify.alert(gettext('Please fill out reason.'));
                $reasonText.focus();
                return;
            }

            // Send return request
            var param = request_params_from_popup();
            if ('test' in location.args) {
                console.log('test req');
                param.test = true;
            }
            $.post('/create-return-request.json', param, function(response) {
                if (response.status_code == 1) {
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
        .delegate('.step2 .btn-back', 'click', function() {
            // Go back to step1
            $('#exchange div.step2').hide();
            $('#exchange div.step1').show().closest('#exchange').css('margin-top',($(window).height()-$('#exchange').height())/2+'px');
        })
        .delegate('.step3 .btn-done', 'click', function() {
            // Close popup
            $.dialog('exchange_return').close();
            location.reload(false);
        })

    function request_params_from_popup() {
        // Common function for both preview and create return request
        var req_items = [];
        var exchange_selected_cnt = 0;
        $('#exchange .step2 .sitem').each(function(idx) {
            if ($(this).is(':hidden')) return;
            var soi_id = $(this).attr('soi-id');
            var quantity = $(this).attr('qty');
            var req_type = $(this).find('.select-req').val();
            var is_exchange = req_type === "exchange";
            var new_option_id = (is_exchange) ? $(this).find('.select-new-option').val() : undefined;
            if (is_exchange) exchange_selected_cnt += 1;

            var req_item = {
                soi_id: soi_id,
                quantity: quantity,
                type: req_type,
                new_option_id: new_option_id,
            };

            req_items.push(req_item);
        });
        var order_id = $('#exchange').attr('order-id');
        var order_code = $('#exchange').attr('order-code');
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
            card_id: card_id
        };
        if(order_code) {
            param.order_code = order_code;
        }
        return param;
    }

    function update_preview_prices(exchange_costs) {
        // called when preview ajax call succeeds
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
        // called when preview ajax call succeeds
        var $select = $('#exchange .step2 .select-soption');
        $select.empty();
        $.each(shipping_options, function(idx, option) {
            $('<option/>').attr('value', option.id).data('amount', option.amount).data('detail', option.detail).text(option.label).appendTo($select);
        });
        $select.val(selected);
    }

    /*
     * These functions are for showing return request summary in step3. For now step3 simply shows success message, so these functions are not used anywhere.
     *
    function show_exchange_items(exchange_items) {
        var $div = $('#exchange .step3 .exchange');
        var $tbody = $div.find('.tb-orders tbody');

        $.each(exchange_items, function(idx, item) {
            var $td_original = $('<td/>').append(
                $('<div/>').addClass('item')
                    .append($('<img/>').attr('src', "/_ui/images/common/blank.gif").css('background-image', 'url('+item.sale_item.sale_item_images[0].thumb_image_url_310+')'))
                    .append($('<b/>').text(item.sale_item.title))
                    .append($('<span/>').addClass('option').text((item.sale_item_option) ? item.sale_item_option.option : ""))
                    .append($('<span/>').addClass('qty').text("Quantity: "+item.quantity))
            );
            var $td_new = $('<td/>').append(
                $('<div/>').addClass('item')
                    .append($('<img/>').attr('src', "/_ui/images/common/blank.gif").css('background-image', 'url('+item.new_item.sale_item_images[0].thumb_image_url_310+')'))
                    .append($('<b/>').text(item.new_item.title))
                    .append($('<span/>').addClass('option').text((item.new_item_option) ? item.new_item_option.option : ""))
                    .append($('<span/>').addClass('qty').text("Quantity: "+item.new_quantity))
            );
            $tbody.append($('<tr/>').append($td_original).append($td_new));
        });

        if (!exchange_items.length) $div.hide();
    }

    function show_return_items(return_items) {
        var $div = $('#exchange .step3 .return');
        var $tbody = $div.find('.tb-orders tbody');

        $.each(return_items, function(idx, item) {
            var $td_item = $('<td/>').append(
                $('<div/>').addClass('item')
                    .append($('<img/>').attr('src', "/_ui/images/common/blank.gif").css('background-image', 'url('+item.sale_item.sale_item_images[0].thumb_image_url_310+')'))
                    .append($('<b/>').text(item.sale_item.title))
                    .append($('<span/>').addClass('option').text((item.sale_item_option) ? item.sale_item_option.option : ""))
            );
            var $td_quantity = $('<td/>').text(item.quantity);
            $tbody.append($('<tr/>').append($td_item).append($td_quantity));
        });

        if (!return_items.length) $div.hide();
    }

    function show_reason(reason) {
        var $div = $('#exchange .step3 .reason');
        var reason_text = (reason.description.length > 0) ? (reason.title + " - " + reason.description) : (reason.title);
        $div.find('p').text(reason_text);
    }
    */


    /*
     * Existing return request section
     */

    function show_return_items_popup(data, return_label_ready) {
        var request_id = data.request_id, 
            order_code = data.order_code,
            rma_url = data.rma_url, 
            label_page_url = data.label_page_url, 
            label_url = data.label_url, 
            label_type = data.label_type, 
            customer_pays_label = data.customer_pays_label, 
            trackingNum = data.trackingNum, 
            trackingCourier = data.trackingCourier,
            sendingAddr = data.sendingAddr;

        //var $returnItemsPopup = $('.popup.return_item');
        var $returnItemsPopup = $('.popup.request_return');
        $returnItemsPopup.data('request-id', request_id);
        $returnItemsPopup.data('order-code', order_code);
        $returnItemsPopup.data('customer-pays-label', customer_pays_label);
        $returnItemsPopup.find('.btn-print-label').data('label-page-url', label_page_url);
        $returnItemsPopup.find('.btn-print-label').data('label-url', label_url);
        $returnItemsPopup.find('.btn-print-label').data('label-type', label_type);

        var show_confirm_button;
        if (return_label_ready) {
            $returnItemsPopup
                .find('.select-type').hide().end()
                .find('.manual').hide().end()
                .find('.purchase').hide().end();
            show_confirm_button = false;
        } else {
            if (customer_pays_label) {
                show_confirm_button = false;
                $returnItemsPopup
                    .find('.purchase').show().end()
                    .find('.select-type').show().end()
                    .find('.seller-issued-label').hide().end()
                    .find('.manual').hide().end()
                    .find('.confirm-return').hide().end()
            } else {
                show_confirm_button = true;
                $returnItemsPopup
                    .find('.seller-issued-label').show().end()
                    .find('.purchase').hide().end()
                    .find('.select-type').hide().end()
                    .find('.manual').hide().end()
                    .find('.confirm-return').show().end()

                if (trackingNum !== '' && Number(trackingNum) >= 0) {
                    $returnItemsPopup.find('.input-tracking')
                        .val(trackingNum)
                        .prop('disabled', true);
                }
                if (trackingCourier !== '' && Number(trackingCourier) >= 0) {
                    $returnItemsPopup.find('.select-carrier')
                        .val(trackingCourier)
                        .prop('disabled', true);
                }
            }
        }
        
        $returnItemsPopup.find('a.btn-print').attr('href', rma_url);
        $returnItemsPopup.find('.sending-addr').text(sendingAddr);
        $returnItemsPopup.find('.btn-area.confirm-return').toggle(show_confirm_button);
        $returnItemsPopup.find('#shipping_purchase').click();
        $.dialog('request_return').open();
    }

    function serializeRequest($request) {
        var result = {
            request_id: $request.data('request-id'),
            customer_pays_label: $request.data('customer-pays-label'),
            rma_url: $request.data('rma-url'),
            label_page_url: $request.data('label-page-url'),
            label_url: $request.data('label-url'),
            label_type: $request.data('label-type'),
            trackingNum: $request.attr('data-tracking-num'),
            trackingCourier: $request.attr('data-tracking-courier'),
            sendingAddr: $request.attr('data-sending-addr'),
        };
        if($request.data('order-code')) {
            result['order_code'] = $request.data('order-code');
        }
        return result
    }

    $('.order-detail.return, .order-item.return')
        .delegate('.btn-send-popup', 'click', function() {
            // show 'Send return items' popup
            var $request = $(this).closest('.order-detail.return, .order-item.return');
            show_return_items_popup(serializeRequest($request), false);
            return false;
        })
        .delegate('.btn-rma-popup', 'click', function() {
            // show 'Send return items' popup (after the request is set to 'Return Items Sent' status)
            var $request = $(this).closest('.order-detail.return, .order-item.return');
            show_return_items_popup(serializeRequest($request), true);
            return false;
        })
        .delegate('.btn-cancel', 'click', function() {
            // Cancel the request
            var request_id = $(this).closest('.order-detail.return, .order-item.return').data('request-id');
            var order_code = $(this).closest('.order-detail.return, .order-item.return').data('order-code');
            if (confirm("Do you want to cancel this request?")) {
                var params = {request_id: request_id};
                if(order_code) {
                    params.order_code = order_code
                }
                $.post('/return-requests/cancel-return-request.json', params, function(response) {
                    if (response.status_code == 1) {
                        location.reload(false);
                    }
                    else if (response.status_code == 0 && response.message) {
                        alert(response.message);
                    }
                    else {
                        alert('Please try again later.');
                    }
                }).fail(function(xhr) {
                    alert('Please try again later.');
                });
            }
            return false;
        });

    /*
     * Send return items popup
     */
    function openPrintLabelPopup(label_url, label_type, label_page_url, showPurchaseSuccess) {
        var $popup = $('.popup.print-label');

        if (label_type !== 'image') {
            $popup
                .find('.label-img-pdf').show().end()
                .find('.label-img').hide();
            $popup
                .find('.label-img-pdf').attr('data', label_url);
        } else {
            $popup
                .find('.label-img-pdf').hide().end()
                .find('.label-img').show();
            $popup.find('.label-img').attr('src', label_url);
        }

        if (showPurchaseSuccess) {
            $popup.find('.alert-success').show();
        } else {
            $popup.find('.alert-success').hide();
        }
        $popup.find('.instructions .btn-print').data('label-page-url', label_page_url);
        $.dialog('print-label').open();
    }
    //$('.popup.return_item')

    var $calcCostPopup = $('.popup.calculate_cost');
    $calcCostPopup
        .on('click', '.btn-cancel, .ly-close', function() {
            $.dialog('calculate_cost').close(false, function () {
                setTimeout(function() {
                    $.dialog('request_return').open();
                }, 500);
            });
        })
        .on('click', '.btn-calculate-rate', function() {
            var $btn = $(this);
            if ($btn.prop('disabled')) {
                return;
            }
            $btn.prop('disabled', true);
            var service = $calcCostPopup.find('.fedex-service').val();
            var length = $calcCostPopup.find('.length input').val();
            var width = $calcCostPopup.find('.width input').val();
            var height = $calcCostPopup.find('.height input').val();
            var weight = $calcCostPopup.find('input.weight').val();
            var params = {
                service: service,
                weight: weight,
                length: length,
                width: width,
                height: height,
                request_id: $('.popup.request_return').data('request-id'),
                order_code: $('.popup.request_return').data('order-code'),
                seller_id: $btn.attr('data-seller-id')
            };

            send_ajax_with_json_response('/get-return-rate.json', params, function(response) {
                var shipping_cost = response.shipping_cost;
                $returnPopup.find('fieldset.cost .price span').text(shipping_cost);
                $returnPopup.find('fieldset.cost .ended').show();
                $.dialog('calculate_cost').close(false, function () {
                    setTimeout(function() {
                        $.dialog('request_return').open();
                    }, 500);
                });
                $btn.prop('disabled', false);
            }, 'get', function(){
                $btn.prop('disabled', false);
            });
        })
    
    var $returnPopup = $('.popup.request_return');
    $returnPopup
        .delegate('.btn-print-label', 'click', function(e) {
            e.preventDefault();
            var label_page_url = $(this).data('label-page-url');
            var label_url = $(this).data('label-url');
            var label_type = $(this).data('label-type');

            $.dialog('request_return').close(false, function () {
                // This needs to be carried on EL because dialog impl does 
                // not provide transitionend callback.
                setTimeout(function() {
                    openPrintLabelPopup(label_url, label_type, label_page_url, false);
                }, 500);
            });
        })
        .on('click', 'button.ly-close, button.btn-done', function() {
            $.dialog('request_return').close();
        })
        .delegate('.btn-done', 'click', function() {
            var $popup = $(this).closest('.request_return');
            var request_id = $popup.data('request-id');
            var order_code = $popup.data('order-code');
            var params = { request_id: request_id, order_code: order_code };
            var customer_pays_label = $popup.data('customer-pays-label');
            if (customer_pays_label && $('#shipping_manual').prop('checked')) {
                var carrier = $popup.find('.select-carrier').val();
                var tracking = $popup.find('.input-tracking').val();
                params['carrier'] = carrier;
                params['tracking'] = tracking;
            }
            $.post('/return-requests/send-return-items.json', params)
                .done(function(response) {
                    if (response.status_code == 1) {
                        //$.dialog('return_item').close();
                        $.dialog('request_return').close();
                        location.reload(false);
                    } else if (response.status_code == 0 && response.message) {
                        alert(response.message);
                    } else {
                        alert('Please try again later.');
                    }
                })
                .fail(function() {
                    alert('There was an error. Please try again later.');
                })
        })
        .on('click', '.open_calc_cost', function(e) {
            $.dialog('request_return').close(false, function () {
                setTimeout(function() {
                    $.dialog('calculate_cost').open();
                }, 500);
            });
            return false;
        })
        .on('change', '#shipping_purchase', function() {
            if (!$(this).prop('checked')) { return; }
            $(this)
                .closest('ul')
                    .find('li').removeClass('selected').end()
                .end()
                .closest('li').addClass('selected').closest('.popup')
                    .find('.data-frm').hide().end()
                    .find('.data-frm.purchase').show();
        })
        .on('change', '#shipping_manual', function() {
            if (!$(this).prop('checked')) { return; }
            $('.confirm-return').show();
            $(this)
                .closest('ul')
                    .find('li').removeClass('selected').end()
                .end()
                .closest('li').addClass('selected').closest('.popup')
                    .find('.data-frm').hide().end()
                    .find('.data-frm.manual').show();    
        })
        .on('click', '.cards-select', function() {
            $returnPopup.find('.select_card ul.cards-to-select').toggle();
        })
        .on('click', '.cards-to-select li', function() {
            var cid = $(this).attr('data-cid');
            var cardCandidate = $returnPopup.find('.card-' + cid);
            if (cardCandidate.length > 0) {
                $returnPopup.find('.card-candidate').hide();
                $returnPopup.find('.cards-select .selected').removeClass('selected');
                cardCandidate.addClass('selected').show();
                $returnPopup.find('.select_card ul.cards-to-select').hide();
            }
        })
        .on('click', '.btn-purchase', function() {
            var selectedCard = $returnPopup.find('.card-candidate.selected');
            // var cid = selectedCard.attr('data-cid');

            var $this = $(this);
            if ($this.prop('disabled')) {
                return;
            }
            $this.prop('disabled', true);

            var calcdCost = $returnPopup.find('fieldset.cost .price span').text();
            // if not caculated
            if (calcdCost === '') {
                $this.prop('disabled', false);
                alertify.alert(gettext('Please calculate shipping cost first.'));
                return;
            }
            var $calcCostPopup = $('.popup.calculate_cost');

            var service = $calcCostPopup.find('.fedex-service').val();
            var length = $calcCostPopup.find('.length input').val();
            var width = $calcCostPopup.find('.width input').val();
            var height = $calcCostPopup.find('.height input').val();
            var weight = $calcCostPopup.find('input.weight').val();
            var params = {
                service: service,
                weight: weight,
                length: length,
                width: width,
                height: height,
                request_id: $returnPopup.data('request-id'),
                order_code: $returnPopup.data('order-code'),
                seller_id: $this.attr('data-seller-id'),
                approval_action: true
            };
            
            send_ajax_with_json_response('/create-return-label-and-send.json', params, function(response) {
                $this.prop('disabled', false);
                location.reload();
            }, 'post', function(e) {
                $this.prop('disabled', false);
                alert('There was an error. Please try again.');
            });

        })

        $(document.body).on('click', '.cancel-order', function() {
            var $el = $(this)
            if ($el.hasClass('loading')) {
                return;
            }
            var alt = window.alertify;
            alt.set({ labels: { ok: 'Cancel Order', cancel: 'Go Back' }});
            alt.confirm('Are you sure you want to cancel this order?', function(confirmed){
                alt.set({ labels: { ok: 'Okay', cancel: 'Cancel' }})
                if (confirmed) {
                    var soid = $el.data('order_id');
                    $el.addClass('loading');
                    $.post('/purchases/' + soid + '/cancel').then(function(res) {
                        if (res.status_code === 0) {
                            alt.alert(res.message);
                        } else if (res.status_code === 1) {
                            alt.alert('Order cancelled.');
                            location.reload();
                        } else {
                            alt.alert('There was an error, please try again later.');
                        }
                    })
                    .fail(function() {
                        alt.alert('There was an error, please try again later.');
                    })
                    .always(function(){
                        $el.removeClass('loading');
                    });
                }
            })
            return false;
        })
    });

    $('.popup.print-label')
        .on('click', 'button.ly-close, button.btn-done', function() {
            $.dialog('print-label').close();
        })
        .on('click', '.instructions .btn-print', function() {
            var label_url = $(this).data('label-page-url');
            var win = window.open(label_url, '_blank');
            win.focus();
        });

    function show_new_address_popup() {
        var dlg_address = $.dialog('newadds-frm');
        dlg_address.$obj
            .on('click', 'button.ly-close, button.btn-cancel', function() {
                $.dialog('newadds-frm').close(false, function () {
                    // This needs to be carried on EL because dialog impl does 
                    // not provide transitionend callback.
                    setTimeout(function(){ $.dialog('exchange_return').open(); }, 500);
                });
            })
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
                    .find(':submit').prop('disabled', false);
            })
            .on('submit', 'form', function(event) {
                event.preventDefault();
                if ($(this).hasClass('disabled')) return;

                var $form = $(this), params = {},i,c,e,x;
                $form.addClass('disabled');

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
                    if(!params[x] || params[x].length == 0) {
                        $form.removeClass('disabled');
                        return alertify.alert(gettext(msg[x]));
                    }
                }

                if(params.country == 'US' && !/^(\+1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/.test(params.phone)) {
                    $form.removeClass('disabled');
                    return alertify.alert(gettext(msg.phone));
                }

                var $submit = $form.find(':submit').prop('disabled',true);
                function save() {
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
                                    for(x in json) if(e=$form[0].elements[x]) e.value = json[x];
                                    if(json.message) alertify.alert(json.message);
                                    break;
                                case 1:
                                    var addr_id = json.id, addr_name = json.nickname;
                                    var $select_addr = $('#exchange .step2 .select-addr');
                                    $select_addr.append(
                                        $('<option/>').val(addr_id).text(addr_name).prop('selected', true)
                                    ).val(addr_id);
                                    dlg_address.close();
                                    break;
                                case 2:
                                    if(!params.override && confirm(json.message)) {
                                        params.override = 'true';
                                        save();
                                    }
                                    break;
                            }
                        },
                        complete : function(){
                            $submit.prop('disabled', false);
                            $form.removeClass('disabled');
                        }
                    });
                }
                save();
            });
        dlg_address.close_old = dlg_address.close;
        dlg_address.close = function(keep_container, callback) {
            if (keep_container)
                dlg_address.close_old(keep_container, callback);
            else
                $.dialog('exchange_return').open();
        };
        dlg_address.$obj.trigger('reset');
        dlg_address.open();

        return false;
    }

