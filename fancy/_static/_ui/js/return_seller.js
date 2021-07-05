jQuery(function($) {
    /*
     * Merchant Return/Exchange Detail Page
     */

    var urlPathPrefix = '/merchant/orders/return-requests';
    var seller_id = $('#return').data('seller-id');
    var request_id = $('#return').data('request-id');

    // Common function for sending ajax request
    function send_ajax_with_json_response(url, params, success, method, onError) {
        if (method.toLowerCase() == 'get') func = $.get;
        else func = $.post;

        params['seller_id'] = seller_id;
        params['request_id'] = request_id;

        var promise = func(urlPathPrefix + url, params, function(response) {
            if (response.status_code == 1) {
                success(response);
            } else if (response.status_code == 0 && response.message) {
                alertify.alert(response.message);
            } else {
                alertify.alert('Please try again later.');
            }
        });
        if (onError != null) {
            promise.fail(onError);
        }
    }

    var $merchantNotePopup = $('.popup.add_return_note');
    var $approvePopup = $('.popup.return_process');
    var $arrivedPopup = $('.popup.mark-arrived');
    var $rejectPopup = $('.popup.request_deniedt');
    var $completePopup = $('.popup.complete_return');
    var $cardPopup = $('.popup.update_card');

    // Buttons on the main container
    $('#return')
        .delegate('.btn-note', 'click', function() {
            $.dialog('add_return_note').open();
            $merchantNotePopup.find('textarea.merchant_note').focus();
            return false;
        })
        .delegate('.btn-approve', 'click', function() {
            var label_available = $(this).data('label-available');
            if (label_available) {
                $approvePopup.find('.data-frm').removeClass('step1').addClass('step2');
            }
            $.dialog('return_process').open();
            return false;
        })
        .delegate('.btn-mark-arrived', 'click', function() {
            $.dialog('mark-arrived').open();
            return false;
        })
        .delegate('.btn-reject', 'click', function() {
            $.dialog('request_deniedt').open();
            return false;
        })
        .delegate('.btn-complete', 'click', function() {
            $.dialog('complete_return').open();
            return false;
        })

    // Merchant Note popup
    $merchantNotePopup
        .delegate('.btn-save', 'click', function() {
            var merchant_note = $.trim($merchantNotePopup.find('textarea.merchant-note').val());
            var params = {
                merchant_note: merchant_note
            };

            send_ajax_with_json_response('/update-merchant-note.json', params, function(response) {
                $.dialog('add_return_note').close();
                location.reload(false);
            }, 'post');
        })

    // Reject Request popup
    $rejectPopup
        .delegate('.btn-cancel', 'click', function() {
            $.dialog('request_deniedt').close();
            return false;
        })
        .delegate('.btn-save', 'click', function() {
            var note = $rejectPopup.find('.txt-note').val();
            send_ajax_with_json_response('/reject.json', {
                note: note
            }, function(response) {
                alertify.alert(gettext("Your message has been sent."));
                location.reload(false);
            }, 'post');
            return false;
        });

    // Approve Request popup (assign return address, create/upload return label)
    $approvePopup
        .on('close_popup', function() {
            var reload_on_close = $approvePopup.data('reload-on-close');
            $.dialog('return_process').close();
            if (reload_on_close)
                location.reload(false);
        })
        .find('.select_address')
        .delegate('.howto .warehouse', 'click', function() {
            $(this).closest('.data-frm').removeClass('other').addClass('warehouse');
            return false;
        })
        .delegate('.howto .other', 'click', function() {
            $(this).closest('.data-frm').removeClass('warehouse').addClass('other');
            return false;
        })
        .delegate('.btn-continue', 'click', function() {
            params = get_return_address_params();
            if (!params) return false;

            send_ajax_with_json_response('/assign-return-address.json', params, function(response) {
                $approvePopup.find('.data-frm').removeClass('step1').addClass('step2');
                $approvePopup.data('reload-on-close', true);
            }, 'post');
            return false;
        })
        .delegate('.btn-confirm', 'click', _.debounce(function() {
            var $this = $(this);
            $this.prop('disabled', true);
            params = get_return_address_params();
            if (!params) return false;
            params['approval_action'] = true;
            send_ajax_with_json_response('/assign-return-address.json', params, function(response) {
                $this.prop('disabled', false);
                $approvePopup.find('.data-frm').removeClass('step1').addClass('step3');
                $approvePopup.data('reload-on-close', true);
            }, 'post', function(e) {
                $this.prop('disabled', false);
                if (e.message) alertify.alert(e.message);
            });
            return false;
        }, 500))
        .delegate('.other select[name="country"]', 'change', function() {
            var $textState = $(this).parent().find('input[name="state"]');
            var $selectState = $(this).parent().find('select[name="state"]');
            if ($(this).val() == 'US') {
                $textState.hide();
                $selectState.show();
            } else {
                $selectState.hide();
                $textState.show();
            }
        })
        .end()
        .find('.select_shipping')
        .delegate('.howto .fedex', 'click', function() {
            $(this).closest('.data-frm').removeClass('other').removeClass('warehouse').addClass('fedex');
            $approvePopup.find('.btn-confirm').prop('disabled', false).text(gettext('Confirm and Upload Label'));
            return false;
        })
        .delegate('.howto .other', 'click', function() {
            $(this).closest('.data-frm').removeClass('fedex').removeClass('warehouse').addClass('other');
            $approvePopup.find('.btn-confirm').prop('disabled', false).text(gettext('Confirm and Upload Label'));
            return false;
        })
        .delegate('.fedex .btn-calculate', 'click', function() {
            var service = $(this).closest('.fedex').find('select.select-service').val();
            var weight = $(this).closest('.fedex').find('input.weight').val();
            var params = {
                service: service,
                weight: weight
            };

            send_ajax_with_json_response('/get-return-shipping-rate.json', params, function(response) {
                var shipping_cost = response.shipping_cost;
                $approvePopup.find('.select_shipping .fedex .cost').text('$' + shipping_cost);
            }, 'get');
            return false;
        })
        .delegate('.other input.label', 'change', function() {
            var filename = $(this).val().split('\\').pop();
            $(this).closest('.uploader').find('input.filename').val(filename);
        })
        .delegate('.btn-back', 'click', function() {
            $approvePopup.find('.data-frm').removeClass('step2').addClass('step1');
            return false;
        })
        .delegate('.btn-confirm', 'click', _.debounce(function() {
            var $this = $(this);
            var $data_frm = $(this).closest('.data-frm');
            if ($data_frm.hasClass('fedex')) {
                $this.prop('disabled', true);
                var fedexCostText = $approvePopup.find('.select_shipping .fedex .cost').text();
                // if not caculated
                if (fedexCostText.indexOf('$') === -1) {
                    $this.prop('disabled', false);
                    alertify.alert(gettext('Please calculate shipping cost first.'));
                    return;
                }
                var service = $(this).closest('.fedex').find('select.select-service').val();
                var weight = $(this).closest('.fedex').find('input.weight').val().trim();
                var params = {
                    service: service,
                    weight: weight,
                    approval_action: true
                };

                send_ajax_with_json_response('/create-return-shipping-label.json', params, function(response) {
                    $this.prop('disabled', false);
                    $approvePopup.find('.data-frm').removeClass('step2').addClass('step3');
                    $approvePopup.data('reload-on-close', true);
                }, 'post', function(e) {
                    $this.prop('disabled', false);
                    if (e.message) alertify.alert(e.message);
                });
            } else if ($data_frm.hasClass('other')) {
                $this.prop('disabled', true);
                var carrier = $(this).closest('.other').find('select.select-carrier').val().trim();
                var tracking = $(this).closest('.other').find('input.tracking').val().trim();
                var inputForm = $(this).closest('.other').find('input.label');
                var files = inputForm.get(0).files;

                if (!tracking) {
                    alertify.alert(gettext("Please enter a tracking number."));
                    $this.prop('disabled', false);
                    return false;
                }
                if (
                    files.length === 0 ||
                    (files == null && inputForm.val() === '') // IE9 and lower
                ) {
                    alertify.alert(gettext("Please select a label image file."));
                    $this.prop('disabled', false);
                    return false;
                }

                var label = files[0];
                var fileType = '';
                if (label.type.split('/')[0] === 'image') {
                    fileType = 'image';
                } else if (label.type === 'application/pdf') {
                    fileType = 'pdf';
                } else {
                    alertify.alert(gettext("Please select valid image file."));
                    $this.prop('disabled', false);
                    return false;
                }

                // FIXME: IE9 support?
                var formData = new FormData();
                formData.append('seller_id', seller_id);
                formData.append('request_id', request_id);
                formData.append('carrier', carrier);
                formData.append('tracking', tracking);
                formData.append('label', label);
                formData.append('file_type', fileType);
                formData.append('approval_action', true);

                $.ajax({
                    type: 'POST',
                    url: urlPathPrefix + '/upload-return-shipping-label.json',
                    data: formData,
                    processData: false,
                    contentType: false,
                    enctype: 'multipart/form-data',
                    success: function(response) {
                        $this.prop('disabled', false);
                        if (response.status_code == 1) {
                            $approvePopup.find('.data-frm').removeClass('step2').addClass('step3');
                            $approvePopup.data('reload-on-close', true);
                        } else if (response.status_code == 0 && response.message) {
                            alertify.alert(response.message);
                        } else {
                            alertify.alert('Please try again later.');
                        }
                    },
                    fail: function(e) {
                        $this.prop('disabled', false);
                        if (e.message) alertify.alert(e.message);
                    }
                });
            }
            return false;
        }, 500))
        .end()
        .delegate('.complete .btn-done, .ly-close', 'click', function() {
            $approvePopup.trigger('close_popup');
            return false;
        })

    // Mark Items Arrived popup
    $arrivedPopup
        .delegate('.btn-confirm', 'click', _.debounce(function() {
            var $this = $(this);
            $this.prop('disabled', true);
            var $data_cont = $arrivedPopup.find('.data-cont');
            var tracking_id = $data_cont.attr('data-tracking-id');
            var items_received = [];
            $data_cont.find('li.item').each(function() {
                var item_number = $(this).data('item-number').toString();
                var order_number = $(this).data('order-number').toString();
                var qty_received = parseInt($(this).find('input.qty-received').val());
                var item_status = $(this).find('.select-status').val();
                var note = $(this).find('input.note').val();
                if (!note) note = undefined;
                items_received.push([item_number, order_number, qty_received, item_status, note]);
            });
            for (var i = 0; i < items_received.length; i++) {
                if (!items_received[0][2]) {
                    alertify.alert("QTY Received must be an integer greater than 0.");
                    return false;
                }
            }
            var params = {
                items_received: JSON.stringify(items_received)
            };
            if (tracking_id) {
                params.tracking_id = tracking_id;
            }
            send_ajax_with_json_response('/mark-arrived.json', params, function(response) {
                $this.prop('disabled', false);
                location.reload(false);
            }, 'post', function(e) {
                $this.prop('disabled', false);
                if (e.message) alertify.alert(e.message);
            });

            return false;
        }, 500))
        .delegate('.qty-received', 'change', function() {
            var qty = parseInt($(this).val());
            var max_qty = parseInt($(this).data('max-value'));
            if (qty > max_qty) {
                if (!confirm("Are you sure? You have only " + max_qty + " of this item to be received.")) {
                    $(this).focus();
                }
            }
        });

    // Common function used for assigning return address.
    // Custom address fields are checked and necessary parameters are returned.
    function get_return_address_params() {
        var is_account_addr = $approvePopup.find('.data-frm').hasClass('warehouse');
        var address_id = $approvePopup.find('.other').data('address-id');

        var params = {
            is_account_addr: is_account_addr,
            address_id: address_id
        };

        if (!is_account_addr) {
            var form = $('#return_addr_form')[0],
                i, e, x;
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
                if (!params[x] || params[x].length == 0) {
                    alertify.alert(gettext(msg[x]));
                    return false;
                }
            }

            if (params.country == 'US' && !/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/.test(params.contact_phone)) {
                alertify.alert(gettext(msg.contact_phone));
                return false;
            }
        }
        return params;
    }

    $completePopup
        .delegate('.btn-edit-payment', 'click', function() {
            window.CardDialogOptions.title = 'Edit payment method';
            $.dialog('update_card').open();
            return false;
        })
        .delegate('.btn-add-payment', 'click', function() {
            window.CardDialogOptions.title = 'Add payment method';
            $.dialog('update_card').open();
            return false;
        })
        .delegate('.btn-save', 'click', _.debounce(function() {
            var payment_method_id = $(this).data('payment-method-id') || null;

            var max_amount = Number($(this).data('max-amount'));
            // var amount = Number($completePopup.find('input.amount').val());
            var amount = max_amount;
            // if (isNaN(max_amount)) {
            //     alertify.alert("There was an error. please try again.");
            //     return false;
            // }
            // if (isNaN(amount)) {
            //     alertify.alert("Amount is not a valid number.");
            //     return false;
            // }
            // if (amount <= 0) {
            //     alertify.alert("Please put amount bigger than 0.");
            //     return false;
            // }
            // if (amount > max_amount) {
            //     alertify.alert("Refund amount should not be larger than $" + max_amount);
            //     return false;
            // }
            send_ajax_with_json_response('/complete.json', {
                amount: amount,
                payment_method_id: payment_method_id,
                full_refund: true,
            }, function(response) {
                location.reload(false);
            }, 'post');
            return false;
        }, 500));

    $cardPopup
        .off('click', '.btn-cancel')
        .on('click', '.btn-cancel', function(){
            setTimeout(function() {
                $.dialog('complete_return').open();
            }, 100);
        });

    $('#close-return').on('click', function() {
        alertify.confirm('This will close return request (use when it needs to be closed without further refund)', function(yes) {
            if (yes) {
                send_ajax_with_json_response('/complete-without-process.json', { request_id: request_id }, function(response) {
                    console.log(response);
                    location.reload();
                }, 'post');
            }
        })
    });

    if ('approve' in location.args) {
        $('#return .btn-approve:visible').click();
    }
/*
    $('.btn-credit').click(function(){
        $.dialog('update_card').open();
        $('.update_card').find('.ltit').text('Add a new payment method').end().find('.saved').hide();
        $('.update_card').find('#make_this_primary_addr').parent('p').hide();
        $('.update_card').find('.btn-save').attr('data-uid','{{viewer.id}}');
        $('.update_card').addClass('merchant-page');
    });

    $('.btn-credit-remove').click(function() {
        if (confirm(gettext("Do you want to remove this payment method?"))) {
            $.ajax({
                type: "POST",
                url: "/merchant/settings/remove-credit-card.json",
                dataType: 'json'
            }).done(function(data) {
                if (data.status_code != undefined && data.status_code == 1) {
                    location.reload(true);
                } else {
                    if (data.message) {
                        $('div.upload-success').css('top','-100px');
                        $('div.upload-fail').find('p').html('<i class="icon">!</i> <b>Error!</b> '+data.message).css('top','45px');
                    }
                }
            });
        }
        return false;
    });
*/
});
