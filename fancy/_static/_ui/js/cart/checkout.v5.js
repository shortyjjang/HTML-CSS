$(function(){
    var $wrapper = $("#checkout-wrapper");
    var Checkout = window.Checkout = {
        is_guest_checkout: $wrapper.hasClass("guest-checkout"),
        is_gift_card: $wrapper.hasClass("giftcard"),
        express_checkout: false,
        pay_with_google: false,
        data: null
    };

    if (Checkout.is_guest_checkout && Checkout.is_gift_card) {
        location.href = "/gift-card";
        return;
    }

    function initializeCheckout() {
        Checkout.Shipping.initialize();

        if (Checkout.is_gift_card) {
            track_event('Begin Payment', {
                'payment method':'stripe', type: 'giftcard'
            } ); 
            return;
        }

        loadCheckout(null, function(json) {
            var param = { 
                'payment method': 'stripe', 
                'type': 'saleitem', 
                'seller id': Object.keys( json.sale_items_freeze).join(", ") 
            };
            if (!Checkout.pay_with_google) { // Begin Payment is tracked on Cart page for google payment
                track_event('Begin Payment', param ); 
            }
            renderCheckout(json);
            showStep('shipping');
        }, function() {
            location = '/cart';
        });
    }

    function loadCheckout(payload, successCallback, failureCallback) {
        var req;
        if (payload) {
            if (Checkout.express_checkout) payload['express'] = True
            req = $.ajax({
                type : 'PUT',
                url  : '/rest-api/v1/checkout',
                contentType: "application/json; charset=utf-8",
                data : JSON.stringify(params),
                dataType: "json",
                processData : false,
            });
        } else {
            var params = {};
            if (Checkout.express_checkout) {
                params['express'] = true;
            }
            req = $.ajax({
                type : 'GET',
                url  : '/rest-api/v1/checkout',
                dataType: "json",
                data: params
            });
        }
        return req.then(function(json) {
            Checkout.data = json;
            if (successCallback) successCallback(json);
        }).fail(function(xhr) {
            if(xhr.status==404) {
                location.href='/cart'
                return;
            }
            var error = null;
            var res = xhr.responseJSON;
            error = res.error;
            alertify.alert(error || "We failed to process your request. Please try again or contact cs@fancy.com");
            if (failureCallback) failureCallback();
        });
    }

    function showStep(step) {
        $("#content .step").children(".current").removeClass("current").end().children(".step-" + step).addClass("current");
        $("#content > div[class^='checkout-'").hide().filter(".checkout-" + step).show();
    }

    function renderCheckout(data) {
        Checkout.Shipping.render(data);
    }

    Checkout.Shipping = {
        $el : $("#content > .checkout-shipping"),
        initialize: function() {
            this.$saved = this.$el.find("div.saved");
            this.$new = this.$el.find(".new");
            this.$ul = this.$saved.find("ul.select_shipping");

            this.$new.find(".new p.primary").toggle(!Checkout.is_guest_checkout);
            
            this.$el.on("click", "ul.select_shipping label", function() {
                Checkout.Shipping.selectAddress($(this).closest("li"));
            }).on("change", "input[name=shipping_address]", function() {
                Checkout.Shipping.selectAddress($(this).closest("li"));
            });
        },
        render: function(data) {
            var $saved = this.$saved, $new = this.$new, $ul = this.$ul;
            var addresses = data['shipping_info']['addresses'];
            var shipping_addr_id = null;
            for(var k in data.sale_items_freeze){
                shipping_addr_id = data.sale_items_freeze[k].shipping_addr_id;
                if(shipping_addr_id) break;
            }
            // TODO: Pay flows
            $ul.children("li.addr").remove();
            if (Checkout.is_guest_checkout) {
                $saved.hide(); $new.show();
                $.each(addresses, function(idx, addr) {
                    if (shipping_addr_id == addr.id) {
                        for (k in addr) {
                            $new.find('[name="' + k + '"]').val(addr[k]);
                        }
                        $new.find("select[name=country]").trigger('change');
                    }
                });
            } else {
                if (addresses.length > 0) {
                    $saved.show(); $new.hide();
                    $.each(addresses, function(idx, addr) {
                        Checkout.Shipping.renderAddress(addr);
                    });
                    Checkout.Shipping.selectAddress($ul.children("li.addr").eq(0));
                } else {
                    $saved.hide(); $new.show();
                }
            }
        },
        selectAddress: function($li) {
            var $r = $li.find("input[name=shipping_address]"), val = $r.val();
            $r.prop("checked", true);
            if (val == "new") {
                this.$new.show();
            } else {
                this.$new.hide();
            }
        },
        renderAddress: function(addr) {
            var $ul = this.$el.find("ul.select_shipping"), $li = $ul.children("li[data-id=" + addr.id + "]");
            if ($li.length == 0) {
                $li = $( $ul.children("script").html() );
                $li.insertBefore($ul.children("li.add_addr"));
            }
            // checkout (alias, full_name) vs old api (nickname, fullname)
            for(k in addr){
                if( $li.data(k) != undefined){
                    $li.data(k, addr[k]);
                    $li.attr('data-'+k, addr[k]);
                }                    
            }
            $li.find("b.title").text( addr.alias );
            var $t = $li.find("label small");
            $t.text(
                addr.full_name + "\n" + 
                addr.address1 + (addr.address2 ? (" "+addr.address2) : "") + "\n" + 
                addr.city + (addr.state ? (", " + addr.state) : "") + (addr.zip ? (", " + addr.zip): "") + "\n" +
                addr.country_name);
            $t.html($t.html().replace(/\n/g, '<br/>'));

            $li.find("input:radio").val( addr.id );
            return $li;
        }
    }

    $("select[name=country]").on("change", function(){
        var $wrapper = $(this).closest("fieldset");
        $wrapper.find("[name=state]").hide();
        if ($(this).val()=='US') {
            $wrapper.find("select[name=state]").show();
        } else {
            $wrapper.find("input[name=state]").show();
        }
    }).trigger("change");

    function getParam($form) {
        var arrParam = $form.serializeArray(), params = {}, i, c;

        for (i=0,c=arrParam.length; i < c; i++) {
            params[arrParam[i].name] = arrParam[i].value;
        }

        return params;
    }

    initializeCheckout();
})
