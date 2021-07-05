$(function(){
    var alertify = window.alertify;
    function getParam($form) {
        var arrParam = $form.serializeArray(), params = {}, i, c;

        for (i=0,c=arrParam.length; i < c; i++) {
            params[arrParam[i].name] = arrParam[i].value;
        }

        return params;
    }

    function checkoutPutRequest(params, successCallback, failureCallback) {
        if (location.args) {
            $.extend(params, location.args);
        }
        if(window.express_checkout) {
            params['express'] = true
        }
        $.ajax({
            type : 'PUT',
            url  : '/rest-api/v1/checkout',
            contentType: "application/json; charset=utf-8",
            data : JSON.stringify(params),
            processData : false,
            success  : successCallback
        }).fail(function(xhr) {
            if(xhr.status==404) {
                location.href='/cart'
            } else {
                var error = null;
                var res = xhr.responseJSON;
                error = res.error;
                alertify.alert(error || "We failed to process your order. Please try again or contact cs@fancy.com");
                if (failureCallback) failureCallback();
            }
        });
    }

    $("select[name=country], select[name=country_code]").change(function(){
        var $wrapper = $(this).closest("div");
        $wrapper.find("[name=state]").hide();
        if($(this).val()=='US' || $(this).val()=='USA'){
            $wrapper.find("select[name=state]").show();
        }else{
            $wrapper.find("input[name=state]").show();
        }
    })

    var Checkout = {};

    window.Checkout = Checkout;

    Checkout.is_guest = $(".wrapper.guest-checkout").length > 0;
    Checkout.is_gift_card = $(".checkout-submit.giftcard").length > 0;

    if (Checkout.is_guest && Checkout.is_gift_card) {
        location.href = "/";
        return;
    }

    Checkout.Shipping = {
        $el : $("#content > .checkout-shipping.wrapper"),
        open : function(){
            this.$el.removeClass("disabled").removeClass("confirm");
            this.$el.find("> div, > form").hide().end().find("> div.saved:not(.status_), >div.btn-area").show();
            if (Checkout.is_guest) {
                this.$el.find("h3.stit").text("Shipping address");
                this.$el.find("ul.select_shipping li:not(.add_addr)").remove();
            } else {
                this.$el.find("h3.stit").text("Choose a shipping address");
            }
            if (this.$el.find("ul.select_shipping li").length == 1) 
                this.$el.find("ul.select_shipping li input:radio").trigger("click");
            $(".btn-checkout").attr('disabled','disabled');
        },
        close : function(){
            var $addr = this.$el.find("ul.select_shipping li.selected");
            this.$el.find("h3.stit").html("<b>Shipping address</b> · <span></span> <a href='#' class='back'>Change</a>")
                .find("span").text($addr.data('nickname'));
            if (window.use_paypal_checkout || window.pay_with_google) this.$el.find("h3.stit").find("a.back").remove();

            if(this.$el.find(">div.status_").is(":visible")) return;
            this.$el.addClass("confirm").removeClass("disabled").find("> div, > form").hide().end().find("> div.status_").show();        
        },
        isOpened : function(){
            return this.$el.find("> div.status_").is(":hidden");
        },
        getCurrentAddress: function () {
            if (!Checkout.Shipping.current_address_id) {
                return null
            }
            var addressEl = $('.select_shipping').find('li[data-id="' + Checkout.Shipping.current_address_id+ '"]');
            return addressEl.data();
        },
        getCurrentAddressString: function () {
            if (!Checkout.Shipping.current_address_id) {
                return null
            }
            var addressEl = $('.select_shipping').find('li[data-id="' + Checkout.Shipping.current_address_id+ '"]');
            return addressEl.find('label small').text()
        },
        init: function(){
            this.$el
                .on('click', 'h3.stit a.back', function(e){
                    e.preventDefault();
                    Checkout.Payment.close();
                    Checkout.Shipping.open();
                })
                .on('click', 'li input:radio', function(event){
                    var $this = $(this), $li = $this.closest('li'), $wrapper = $this.closest('.checkout-shipping'), prev_id = $wrapper.data('addr_id');

                    $this.closest('ul').find('li').removeClass('selected').end().end().closest('li').addClass('selected');

                    if( $this.val()=="new"){
                        $wrapper.find(".new").show();
                        return;
                    }
                    
                    $wrapper.find(".new").hide();
                    $wrapper.data('addr_id', $this.val());
                    $wrapper.find('.saved.status_ p').html( $li.find('label small').html() );

                    if(!$wrapper.find(".new").is(":visible") && !Checkout.Shipping.$el.hasClass('confirm') && !prev_id && $this.val() ){
                        Checkout.Shipping.$el.find(".select_ship_addr_").trigger('click');
                    }
                })
                // edit shipping
                .on('click', 'li a.edit', function(event){
                    event.preventDefault();

                    var $this = $(this), $li = $this.closest("li"), dlg = $.dialog('edit_shipping_addr'), id = $li.find("input").val();

                    dlg.open();
                    dlg.$obj.find('p.ltit').html('Edit shipping address').end().find(".btn-continue");

                    dlg.$obj.find('input,select').each(function() {
                        var $this = $(this);
                        var name = $this.attr('name');
                        var value = $li.data(name);
                        if(name=="set_default"){
                            this.checked = (value=="True");
                        }else if(name=="prev_addr_id"){
                            $this.val( $li.data("id") );
                        }else{
                            $this.val(value);
                        }
                        if(name=='country'){
                            $this.change();
                        }
                    });
                    if( $li.data('set_default') == 'True' ){
                        dlg.$obj.find("button.btn-remove").hide();                        
                    }else{
                        dlg.$obj.find("button.btn-remove").show();
                    }
                })
                .on('click', '.select_ship_addr_', function(){
                    var $btn = $(this), $wrapper = $btn.closest(".checkout-shipping");
                    var onfail = function() { $btn.removeClass("loading").prop("disabled", false); }

                    if( $wrapper.find(".new").is(":visible")){
                        var $form = $wrapper.find(".new");
                        var params = getParam($form);
                        params.state = $form.find("[name=state]:visible").val();
                        params.country_name = $form.find("select[name=country] option:selected").html();
                        params.set_default = $form.find("input[name=set_default]")[0].checked;
                        $btn.addClass("loading").prop("disabled", true);
                        Checkout.Shipping.addShippingAddress(params, function(data){
                            var addressInfo = null;
                            if (Checkout.is_guest) {
                                var email = $('.wrapper.guest-checkout input.text[name="email"]').val();
                                addressInfo = { shipping_addr: data, email: email };
                            } else {
                                Checkout.Shipping.updateOrCreateAddress(data).find("input:radio").val( data.id ).click();
                                $wrapper.find(".btn-area a.new_shipping").show();
                                $wrapper.find("h3.stit").text('Choose a shipping address');
                                addressInfo = {address_id: data.id};
                            }
                            Checkout.Shipping.current_address_id = null;
                            checkoutPutRequest(addressInfo, function(res){
                                if (Checkout.is_guest) {
                                    Checkout.Shipping.updateOrCreateAddress(data).find("input:radio").val( data.id ).click();
                                }
                                Checkout.Shipping.close();
                                if(Checkout.Payment.isConfirmed())
                                    Checkout.Review.open();
                                else
                                    Checkout.Payment.open();
                                refreshCheckout(res);
                                onfail();
                            }, onfail);
                        }, onfail);
                    }else{
                        var address_id = $(".checkout-shipping").data('addr_id');
                        if(!address_id){
                            alertify.alert('Please select an address');
                            return;
                        }
                        if (address_id != Checkout.Shipping.current_address_id) {
                            $btn.addClass("loading").prop("disabled", true);
                            Checkout.Shipping.current_address_id = null;
                            checkoutPutRequest({address_id: address_id}, function(res){
                                Checkout.Shipping.close();
                                if(Checkout.Payment.isConfirmed()) Checkout.Review.open();
                                else Checkout.Payment.open();
                                refreshCheckout(res);
                                onfail();
                            }, onfail);
                        } else {
                            Checkout.Shipping.close();
                            if(Checkout.Payment.isConfirmed()) Checkout.Review.open();
                            else Checkout.Payment.open();
                        }
                    }
                })

            $(".popup.edit_shipping_addr")
                .on('click', '.btn-continue', function(){
                    var $this = $(this); var $form = $this.closest(".popup.edit_shipping_addr"); var params = getParam($form);
                    params.state = $form.find("[name=state]:visible").val();
                    params.country_name = $form.find("select[name=country] option:selected").html();
                    params.set_default = $form.find("input[name=set_default]")[0].checked;

                    Checkout.Shipping.addShippingAddress(params, function(data){
                        var $li = Checkout.Shipping.updateOrCreateAddress(data, params.prev_addr_id);
                        $li.find("input:radio").val( data.id ).click();
                        $.dialog('edit_shipping_addr').close();
                    });
                })            
                .on('click', '.btn-remove', function(){
                    var $this = $(this); var $form = $this.closest(".popup.edit_shipping_addr"); var params = getParam($form);
                    var addr_id = params.prev_addr_id;
                    $.ajax({
                        type : 'post',
                        url  : '/remove_shipping_addr.json',
                        data : {id:addr_id},
                        dataType : 'json',
                        success  : function(json){
                            if(json.status_code === 1){
                                $(".checkout-shipping li[data-id="+addr_id+"]").remove();
                                $(".checkout-shipping li[data-set_default=True] input:radio").click();
                                if( !$(".checkout-shipping li").length ){
                                    $(".checkout-shipping").find(">div.saved").hide().end().find(">form.new").show().end().find("a.new_shipping").hide();
                                }
                                $.dialog('edit_shipping_addr').close();
                            } else if (json.status_code === 0){
                                if(json.message) alertify.alert(json.message);
                            }
                        }
                    })
                })
                .on('focus', 'input:text', function(e){
                    $(this).closest("p").addClass("focus");
                })
                .on('blur', 'input:text', function(e){
                    $(this).closest("p").removeClass("focus");
                })    
                .on('keypress', 'input', function(e){
                    if( e.keyCode==13) e.preventDefault();
                })
                .on('submit', function(e){
                    e.preventDefault();
                })
        },
        addShippingAddress: function(params, callback, onfail){        
            function error(msg) {
                if (typeof gettext == 'function') msg = gettext(msg);
                alertify.alert(msg);
                if (onfail) onfail();
            }

            if (params.fullname.length < 1) return error('Please enter the full name.');
            if (!params.nickname || params.nickname.length < 1) params.nickname = params.fullname+"-"+params.zip;
            if (params.address1.length < 1) return error('Please enter a valid address.');
            if (params.city.length < 1) return error('Please enter the city.');
            if (params.zip.length < 1) return error('Please enter the zip code.');
            if (params.country == 'US') {
                var phone = params.phone.replace(/\s+/g, ''); 
                if (phone.length < 10 || !phone.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/)) return error('Please specify a valid phone number.');
            }else if(params.phone.length < 1){
                return error('Please enter the phone number.');
            }    

            if (Checkout.is_guest) {
                if (window.localStorage) {
                    params.timestamp = (new Date()).getTime();
                    localStorage.setItem("last_address", JSON.stringify(params));
                    delete params.timestamp;
                }
                params.full_name = params.fullname;
                params.alias = params.nickname;
                callback(params);
            } else {
                $.ajax({
                    type : 'POST',
                    url  : '/add_new_shipping_addr.json',
                    data : params,
                    dataType : 'json',
                    success  : function(json) {
                        var $op, html='';
                        switch (json.status_code) {
                            case 0:
                            case 2:
                                if (json.message) alertify.alert(json.message);
                                if (onfail) onfail();
                                break;
                            case 1:
                                callback(json);
                                break;
                        }
                    },
                    complete : function() {
                        
                    }
                });
            }
            
        }, 
        updateOrCreateAddress : function(data) {
            var $li = $(".checkout-shipping li[data-id=" + data.id + "]");
            if ($li.length == 0) {
                var $wrapper = $(".checkout-shipping")
                $li = $( $wrapper.find("ul.select_shipping > script").html() );
                $li.insertBefore($wrapper.find('ul > li:last'));
            }

            // checkout.shipping_info.addresses
            if (data.alias) data.nickname = data.alias; 
            if (data.full_name) data.fullname = data.full_name;

            for(k in data){
                if( $li.data(k) != undefined){
                    $li.data(k, data[k]);
                    $li.attr('data-'+k, data[k]);
                }                    
            }
            $li.data('set_default', data.is_default?"True":"False").data('id', data.id);;
            $li.find("b.title").html( data.nickname );
            $li.find("label small").html( data.fullname+", "+data.address1+(data.address2?(" "+data.address2):"")+", "+data.city+", "+(data.state?(data.state+", "):"")+data.country_name );
            $li.find("input:radio").val( data.id );
            return $li;
        }
    }

    Checkout.Payment = {
        $el : $("#content > .checkout-payment.wrapper"),
        isConfirmed: function(){
            return this.$el.hasClass("confirm") || this.$el.is(":hidden");
        },
        hide : function(){
            if(this.$el.is(":visible")){
                Checkout.Payment.close();
                Checkout.Review.open();
            }
            this.$el.hide();
        },
        show : function(){
            if(this.$el.is(":hidden")){
                Checkout.Payment.open();
            }
            this.$el.show();
        },
        open : function(){
                    this.$el.removeClass("disabled").find("> div, >form").hide().filter(".saved:not(.status_)").show().end().end().find(".btn-area").show();
            if(!this.$el.find("ul.select_payment > li:visible").not(".add_card").length) {
                // there is no saved payment method.
                this.$el.find("ul.select_payment > li.add_card input:radio").click();
            }
            // copy shipping addresses to billing address
            var billings = $(".checkout-payment dl.billing");
            if(Checkout.Shipping.$el.find("ul.select_shipping").length>0) {
                function SAFE1(str) {
                    return str || '';
                }
                function SAFE2(str) {
                    if(!str) return '';
                    return (''+str).replace(/>/g,'&gt;').replace(/</g,'&lt;')
                }
                billings.each(function(i,billing) {
                    $billing = $(billing);
                    $billing.find('dd:not(.billing_new)').remove();
                    template = $billing.find('>script').html();
                    if(!template) return true;
                    var addrs = $(Checkout.Shipping.$el.find("ul.select_shipping li[data-id]"));
                    addrs.each(function(j,addr) {
                        $addr = $(addr);
                        var _id = $addr.data('id');
                        var _address1 = SAFE1($addr.data('address1'));
                        var _address2 = SAFE1($addr.data('address2'));
                        var _city = SAFE1($addr.data('city'));
                        var _country = SAFE1($addr.data('country'));
                        var _state = SAFE1($addr.data('state'));
                        var _zip = SAFE1($addr.data('zip'));
                        var _country_name = SAFE1($addr.data('country_name'));
                        var selected = $addr.hasClass('selected');

                        billing_address = template.replace(/##id##/g, _id);
                        billing_address = billing_address.replace(/##address_text##/g, SAFE2(_address1)+'<br>'+(_address2?(SAFE2(_address2)+'<br>'):'')+SAFE2(_city+', '+_state+' '+_zip)+'<br>'+SAFE2(_country_name));
                        billing_address = billing_address.replace(/##checked##/g, selected?'checked':'');
                        billing_address = billing_address.replace(/##selected##/g, selected?'selected':'');

                        $billing_address = $(billing_address).prependTo($billing);

                        $billing_address.find('[name=street_address]').val(_address1);
                        $billing_address.find('[name=street_address2]').val(_address2);
                        $billing_address.find('[name=country_code]').val(_country);
                        $billing_address.find('[name=city]').val(_city);
                        $billing_address.find('[name=state]').val(_state);
                        $billing_address.find('[name=postal_code]').val(_zip);

                        if(selected) {
                            $billing.find('dd.billing_new').removeClass('selected');
                        }
                    });
                    $billing.prepend($billing.find('dt'));
                });
            }

            if (window.use_paypal_checkout || window.pay_with_google) return;

            if( !this.$el.hasClass("confirm") &&  this.$el.find("ul.select_payment li.selected").length){
                var $selected = this.$el.find("ul.select_payment li.selected input:radio");
                if(!this.$el.data('payment_id')) $selected.trigger("click");
                if ($selected.val() != "new") this.$el.find(".select_payment_").trigger('click');
            } else if( $('.checkout-submit.giftcard').length!=0 ) {
                this.$el.find("ul.select_payment li.selected input:radio").trigger("click");
            } else {
                this.$el.removeClass("confirm").find("h3.stit").html("Payment method");
                $(".btn-checkout").attr('disabled','disabled');
            }
        },
        close : function(){
            if(this.$el.find(">div.status_").is(":visible")) return;
            this.$el.find("> div, > form").hide().end().find("> div.status_").show();
            if(window.use_paypal_checkout){
                this.$el.addClass('confirm');
                this.$el.find("h3.stit").html("<b>Payment method</b> · Paypal");
            } else if (window.pay_with_google){
                this.$el.addClass('confirm');
                this.$el.find("h3.stit").html("<b>Payment method</b> ·  Google Pay");
            }else if(this.$el.data('payment_id')){
                this.$el.addClass('confirm');                
                var $card = this.$el.find("ul.select_payment li.selected");
                if($card.length){
                    this.$el.find("h3.stit").html("<b>Payment method</b> · <span class='card "+($card.data('type')||'').toLowerCase()+"'></span> "+$card.data('type')+" - Ending in "+$card.attr('data-last_digits')+" <a href='#' class='back'>Change</a>");
                }
            }else if (window.use_amex_express) {
                this.$el.addClass('confirm')
                    .find(">div.status_ > p").hide().end()
                    .find("h3.stit").html("<b>Payment method</b> · AMEX Express").end();
            }else{
                this.$el.addClass('disabled').find("> div.status_").hide().end().find("h3.stit").html("Payment method");
            }
        },
        isOpened : function(){
            return this.$el.find("> div.status_").is(":hidden") && this.$el.is(":visible");
        },
        showCreditNotify: function(isshow){
            if(isshow && !this.$el.hasClass('disabled')){
                 this.$el.find(".giftcard_notify").show();
            }else{
                this.$el.find(".giftcard_notify").hide();
            }
        },
        init : function(){
            var stripe = null, elements = null, cardElement = null, $btn = this.$el.find(".select_payment_");
            if (Stripe.version == 3) {
                this.stripe = stripe = Stripe(window.stripePublishableKey);
                this.elements = elements = stripe.elements();
                var $name = this.$el.find(".new input[name=name]"), $err = this.$el.find(".new .element .error-msg");
                this.cardElement = cardElement = elements.create('card', { hidePostalCode: true, iconStyle: 'solid' });
                cardElement.mount('#card-element');
                cardElement.on('change', function(event) {
                    if(event.complete) {
                        $name.focus();
                        $btn.prop('disabled', false);
                    } else {
                        $btn.prop('disabled', true);
                    }
                    if (event.error) {
                        $err.show().text(event.error.message);
                    } else {
                        $err.hide().text('');
                    }
                });
            }
            function selectPayment($li){
                    var $wrapper = $li.closest('.checkout-payment'), prev_id = $wrapper.data('payment_id');

                    var payment_id = $li.find("input:radio").val();
                    
                    $li.closest('ul').find('li').removeClass('selected').end().end().addClass('selected');
                    $wrapper.data('payment_id', payment_id);
                    $wrapper.find(".status_").find("p").html('<b>Billing Address:</b> <span class="billing_address_"></span>').find(".billing_address_").html($li.data('billing_address'));
            }

            this.$el
                .on('click', 'h3.stit a.back', function(e){
                    e.preventDefault();
                    if (Checkout.Shipping.isOpened()) {
                        //Checkout.Shipping.close();
                        Checkout.Shipping.$el.find(".select_ship_addr_").trigger('click');
                    }
                    
                    Checkout.Payment.open();
                })
                .on('click', '.saved ul.select_payment li input:radio', function(event){
                    var $this = $(this), $wrapper = $this.closest(".checkout-payment");
                    $btn.prop('disabled', false);
                    if($this.val()=='new'){
                        $wrapper.data('payment_id', null);
                        $wrapper.find(".new").show();
                        if (cardElement) {
                            if (!$("#card-element").hasClass("StripeElement--complete")) {
                                cardElement.focus();
                                $btn.prop('disabled', true);
                            }
                        }
                        return;
                    }
                    $wrapper.find(".new").hide();
                    selectPayment( $this.closest('li') );
                })
                .on('click', '.select_payment_', function() {
                    if (window.use_amex_express) {
                        Checkout.Payment.close();
                        Checkout.Review.open();
                        $(".btn-checkout").removeAttr('disabled');
                        return;
                    }
                    var $this = $(this), $wrapper = $this.closest(".checkout-payment");
                    if( $wrapper.find(".new").is(":visible")){
                        var params = getParam($wrapper.find('form'));

                        $this.addClass('loading').attr('disabled','disabled');

                        var $selected = $wrapper.find(".new dd.selected");
                        if(!$selected.hasClass("billing_new")){
                            $selected.find("input[type='hidden']").each(function(i,input) {
                                params[$(input).attr('name')] = $(input).val();
                            });
                        }else{
                            $selected.find("input[type='text']:visible").each(function(i,input) {
                                params[$(input).attr('name')] = $(input).val();
                            });
                            params.country_code = $selected.find('[name=country_code]').find('option[value='+params.country_code+']').attr('data-code2');
                            params.state = $selected.find("[name=state]:visible").val();
                            params.set_default = $selected.find("input[name=set_default]")[0].checked;
                        }

                        Checkout.Payment.addNewCard(params, function(data){
                            $this.removeClass('loading').removeAttr('disabled');

                            if(!data.card_id){
                                alertify.alert(data.message||"Please input valid credit card info");
                                return;
                            }

                            var $li = $( $wrapper.find("ul.select_payment > script").html() );
                            $wrapper.find("ul.select_payment .add_card").before($li);
                            $li.data('holder_name', data.card_holder_name).attr('data-last_digits', data.card_last_digits).data('type', data.card_type).data('billing_address', data.card_holder_name+", "+data.billing_address.address1+", "+data.billing_address.city+", "+data.billing_address.state+", "+data.billing_address.postal_code+", "+data.billing_address.country);
                            $li.data('billing_address_obj', data.billing_address);
                            $li.find("label").addClass( (data.card_type||'').toLowerCase() );
                            $li.find("b.title").html( (data.card_type||'') + " <small>Ending in "+data.card_last_digits+"</small>");
                            $li.find("small.name").html( data.card_holder_name );                    
                            $li.find("small.exp").html( data.card_expiration );                    
                            $li.find("input:radio").val( data.card_id );
                            selectPayment( $li );

                            $wrapper.find("form.new input[type=text]").val('');
                            $wrapper.find("form.new select").prop('selectedIndex', 0);

                            Checkout.Payment.close();
                            if($('.checkout-submit.giftcard').length!=0) {
                                // gift checkout
                                $(".btn-checkout").removeAttr('disabled');
                            } else {
                                // normal checkout
                                Checkout.Review.open();
                            }
                        }, function(){
                            $this.removeClass('loading').removeAttr('disabled');
                        });
                    }else{
                        if(!$wrapper.data('payment_id')){
                            alertify.alert("Please select a payment method");
                            return;
                        }

                        Checkout.Payment.close();
                        if($('.checkout-submit.giftcard').length!=0) {
                            // gift checkout
                            $(".btn-checkout").removeAttr('disabled');
                        } else {
                            // normal checkout
                            Checkout.Review.open();
                        }
                    }

                });

            $('.checkout-submit')
                .on('click', ".payment-coupon dt > a", function(e){
                    e.preventDefault();
                    $(this).toggleClass('opened').parent().next().toggle();
                })
                .on('click', ".payment-coupon button.btn-apply", function(){
                    var $this = $(this);
                    var code = $(this).prev().val();
                    if (!code) return;

                    var couponInfo = {"apply_coupon":true, "coupon_code":code};
                    if (Checkout.is_guest) {
                        var email = $('.wrapper.guest-checkout input.text[name="email"]').val();
                        if (!email || !emailRegEx.test(email)) {
                            alertify.alert("Please sign in or enter your email address first.");
                            return;
                        }
                        couponInfo['email'] = email;
                    }

                    checkoutPutRequest(couponInfo, function(res){
                        if(res.error){
                            if( res.error.match(/^Invalid coupon code/) ) res.error = "Invalid coupon code";
                            $this.next().show().html(res.error).show();
                        }else{
                            refreshCheckout(res);
                        }
                    });
                })
                .on('click', ".payment-coupon a.remove-coupon_", function(e){
                    e.preventDefault();
                    var code = $(this).attr('code');
                    var couponInfo = {"apply_coupon":false, "coupon_code":code};

                    checkoutPutRequest(couponInfo, function(res){
                        refreshCheckout(res);
                    });
                })
        },
        addNewCardElements: function(params, callback, callback_error) {
            function error(msg) {
                callback_error();
                alertify.alert(msg);
            }
            
            var stripe = this.stripe, cardElement = this.cardElement;

            // check required fields
            if (!params.name)return error('Please enter the name on card.');
            if (!params.street_address) return error('Please enter a valid address.');
            if (!params.city) return error('Please enter the city.');
            if (!params.postal_code) return error('Please enter the zip code.');
        
            function submit(recaptcha_token) {
                stripe.createToken(cardElement, {
                    name: params.name,
                    address_line1: params.street_address,
                    address_line2: params.street_address2,
                    address_city: params.city,
                    address_state: params.state,
                    address_zip: params.postal_code,
                    address_country: params.country_code,
                    currency: 'usd'
                }).then(function(result) {
                    if (result.error) {
                        callback_error();
                        if ('message' in result.error) {
                            alertify.alert(result.error.message);
                        } else {
                            alertify.alert("Failed to add a credit card. Please try again later.");
                        }
                    } else {
                        var token = result.token;
                        if (Checkout.is_guest) {
                            var brand = token.card.brand;
                            if (brand == "American Express") brand = "Amex";

                            if (dataLayer) {
                                dataLayer.push({'event': 'Save_Payment', 'product_id': undefined, 'products': undefined, 'products_info': undefined, 'revenue': undefined, 'option_id': undefined });
                            }
                            callback({ 'card_id': token.id, 'card_token': token.id, 'card_holder_name': token.card.name, 
                                'card_last_digits': token.card.last4, 'card_type': brand,
                                'card_expiration': token.card.exp_month + '/'+token.card.exp_year,
                                'billing_address': { 
                                    'address1': params.street_address, 'address2': params.street_address2,
                                    'city': params.city, 'state': params.state, 'country': params.country_code,
                                    'postal_code': params.postal_code 
                                }
                            });
                            return;
                        }
                        var endpoint, payload;
                        endpoint = '/settings/cards/stripe/add-card.json';
                        payload = { 'card_token': token.id,
                            'address1': params.street_address, 'address2': params.street_address2,
                            'city': params.city, 'state': params.state, 'country': params.country_code,
                            'postal_code': params.postal_code, 'set_default': params.set_default };
                        if (recaptcha_token) payload['recaptcha_token'] = recaptcha_token;
                        if (window.payment_params && window.payment_params.usesandbox) payload['usesandbox'] = window.payment_params.usesandbox;
                        $.ajax({
                            type: 'post', url: endpoint, data: payload,
                            success : function(response) {
                                callback(response);
                                if (dataLayer) {
                                    dataLayer.push({'event': 'Save_Payment', 'product_id': undefined, 'products': undefined, 'products_info': undefined, 'revenue': undefined, 'option_id': undefined });
                                }
                            },
                            complete : function() {
                                
                            },
                            error : function(res) {
                                var message = "Failed to add a credit card. Please try again later.";
                                if (res.responseText) {
                                    try {
                                        var json = JSON.parse(res.responseText)
                                        if (json.message) message = json.message;
                                    } catch(e) {}
                                }
                                callback_error();
                                alertify.alert(message);
                            }
                        });
                    }
                });
            }
            
            if (window.execute_recaptcha) {
                window.execute_recaptcha(function(success, token) {
                    if (success) {
                        if (window.clear_recaptcha) clear_recaptcha();
                        submit(token);
                    }
                    else {
                        error('Please complete RECAPTCHA to continue')
                    }
                });
            } else {
                submit();
            }
        },
        addNewCard: function(params, callback, callback_error){
            if (this.stripe) {
                return Checkout.Payment.addNewCardElements(params, callback, callback_error);
            }

            function error(msg) {
                if (typeof gettext == 'function') msg = gettext(msg);
                callback_error();
                alertify.alert(msg);
            }
            
            // check required fields
            if (!params.name)return error('Please enter the name on card.');
            if (!params.street_address) return error('Please enter a valid address.');
            if (!params.city) return error('Please enter the city.');
            if (!params.postal_code) return error('Please enter the zip code.');
        
            if (!Stripe.card.validateCardNumber(params.card_number)) return error('Please enter a valid card number.');
            if (!Stripe.card.validateCVC(params.security_code)) return error('Please enter a valid security code.');
            if (!Stripe.card.validateExpiry(params.expiration_month, params.expiration_year)) return error('Please enter a valid expiration date.');
            
            function submit(recaptcha_token) {
                Stripe.card.createToken({
                    number: params.card_number,
                    exp_month: params.expiration_month,
                    exp_year: params.expiration_year,
                    cvc: params.security_code,
                    name: params.name,
                    address_line1: params.street_address,
                    address_line2: params.street_address2,
                    address_city: params.city,
                    address_state: params.state,
                    address_zip: params.postal_code,
                    address_country: params.country_code
                }, function (status, response) {
                    if (response.error) {
                        // we did something unexpected - check response.error for details
                        callback_error();
                        if ('message' in response.error) {
                            alertify.alert(response.error.message);
                        }else{
                            alertify.alert("Failed to add a credit card. Please try again later.");
                        }
                    } else {
                        if (Checkout.is_guest) {
                            var brand = response.card.brand;
                            if (brand == "American Express") brand = "Amex";

                            if (dataLayer) {
                                dataLayer.push({'event': 'Save_Payment', 'product_id': undefined, 'products': undefined, 'products_info': undefined, 'revenue': undefined, 'option_id': undefined });
                            }
                            callback({ 'card_id': response.id, 'card_token': response.id, 'card_holder_name': response.card.name, 
                                'card_last_digits': response.card.last4, 'card_type': brand,
                                'card_expiration': response.card.exp_month + '/'+response.card.exp_year,
                                'billing_address': { 
                                    'address1': params.street_address, 'address2': params.street_address2,
                                    'city': params.city, 'state': params.state, 'country': params.country_code,
                                    'postal_code': params.postal_code 
                                }
                            });
                            return;
                        }
                        var endpoint, payload;
                        endpoint = '/settings/cards/stripe/add-card.json';
                        payload = { 'card_token': response['id'], 
                            'address1': params.street_address, 'address2': params.street_address2,
                            'city': params.city, 'state': params.state, 'country': params.country_code,
                            'postal_code': params.postal_code, 'set_default': params.set_default };
                        if (recaptcha_token) payload['recaptcha_token'] = recaptcha_token;
                        $.ajax({
                            type: 'post', url: endpoint, data: payload,
                            success : function(response) {
                                callback(response);
                                if (dataLayer) {
                                    dataLayer.push({'event': 'Save_Payment', 'product_id': undefined, 'products': undefined, 'products_info': undefined, 'revenue': undefined, 'option_id': undefined });
                                }
                            },
                            complete : function() {
                                
                            },
                            error : function(res) {
                                var message = "Failed to add a credit card. Please try again later.";
                                if (res.responseText) {
                                    try {
                                        var json = JSON.parse(res.responseText)
                                        if (json.message) message = json.message;
                                    } catch(e) {}
                                }
                                callback_error();
                                alertify.alert(message);
                            }
                        });
                    }
                });
            }
            
            if (window.execute_recaptcha) {
                window.execute_recaptcha(function(success, token) {
                    if (success) {
                        if (window.clear_recaptcha) clear_recaptcha();
                        submit(token);
                    }
                    else {
                        error('Please complete RECAPTCHA to continue')
                    }
                });
            } else {
                submit();
            }
        }
    }

    function getSellerIds() {
        return $('.cart-item-detail').map(function(i, e){ return $(e).attr('seller_id') }).toArray();
    }

    Checkout.Review = {
        open : function(){
            $(".checkout-review").removeClass("disabled").find(".review > .cart-item-detail").show().find("> *:not(.sdd_option)").show();
            $(".checkout-summary").show();
            refreshCheckout();
        },
        close : function(){
            $(".checkout-summary, .checkout-review .review > .cart-item-detail").hide();
        },
        init: function(){
            $('#content')
                .on('change', '.checkout-review .delivery-option input:radio', function(event){
                    var seller_id = $(this).closest('[seller_id]').attr('seller_id');
                    var deliveryOption = $(this).val();
                    var info = {"shipping_option":{}};
                    info['shipping_option'][seller_id] = parseInt(deliveryOption);

                    checkoutPutRequest(info, function(res) {
                        refreshCheckout(res);
                    });
                })
                .on('change', '.checkout-review .sdd_option select', function(event){
                    var $this = $(this);
                    var seller_id = $(this).closest('[seller_id]').attr('seller_id');
                    var delivery_on = $this.closest("fieldset").find("select.date").val();
                    var delivery_at_start = $this.closest("fieldset").find("select[name=delivery_at_start]").val();
                    var delivery_at_end = $this.closest("fieldset").find("select[name=delivery_at_end]").val();
                    if(delivery_at_end<delivery_at_start){
                        if( $this.is('[name=delivery_at_start]')){
                            delivery_at_end = delivery_at_start;
                            $this.closest("fieldset").find("select[name=delivery_at_end]").val(delivery_at_start);
                        }else{
                            delivery_at_start = delivery_at_end;
                            $this.closest("fieldset").find("select[name=delivery_at_start]").val(delivery_at_end);
                        }
                    }

                    var info = {"sameday_delivery":{}};
                    info['sameday_delivery'][seller_id] = {"delivery_on":delivery_on, "delivery_at":delivery_at_start+"-"+delivery_at_end};

                    checkoutPutRequest(info, function(res) {
                        refreshCheckout(res);
                    });
                })
                .on('blur', '.checkout-review .sdd_option textarea[name=sameday_message]', function(event){
                    var $this = $(this);
                    var seller_id = $(this).closest('[seller_id]').attr('seller_id');
                    var samedayMessage = $this.val();
                    
                    var info = {"sameday_message":{}};
                    info['sameday_message'][seller_id] = samedayMessage||"";

                    checkoutPutRequest(info, function(res) {
                        refreshCheckout(res);
                    });
                })
                .on('click', '.checkout-review .optional a.note', function(event){
                    event.preventDefault();
                    var seller_id = $(this).closest('[seller_id]').attr('seller_id');
                    if (window.__Config.nostore) {
                        var note = $(this).data('note')||'';
                        var dlg = $.dialog('edit_seller_note');
                        var title = dlg.$obj.find(".note-container p.ltit").html();
                        if( $(this).closest('.optional').hasClass('add')) title = title.replace(/Edit/i,"Add");
                        else title = title.replace(/Add/i,"Edit");
                        dlg.$obj.find("textarea.note").val(note).end().find(".note-container p.ltit").html( title );
                        dlg.open().$obj.find("textarea.note").focus();
                    } else {
                        var note = $(this).data('note')||'';
                        var dlg = $.dialog('edit_seller_note');
                        var title = dlg.$obj.find("p.ltit").html();
                        if( $(this).closest('.optional').hasClass('add')) title = title.replace(/Edit/i,"Add");
                        else title = title.replace(/Add/i,"Edit");
                        dlg.$obj.data('seller_id',seller_id).find("textarea.text").val(note).end().find("p.ltit").html( title );
                        dlg.open().$obj.find("textarea.text").focus();
                    }
                })
                .on('click', '.checkout-review .optional .note a.remove', function(event){
                    event.preventDefault();
                    var noteInfo = {'note_info':{}};

                    if (window.__Config.nostore) {
                        getSellerIds().forEach(function(seller_id){
                            noteInfo.note_info[seller_id] = '';
                        })
                    } else {
                        var seller_id = $(this).closest('[seller_id]').attr('seller_id');
                        noteInfo.note_info[seller_id] = '';
                    }

                    checkoutPutRequest(noteInfo, refreshCheckout);
                })
                .on('click', '.checkout-review .optional a.gift', function(event){
                    event.preventDefault();
                    var seller_id = $(this).closest('[seller_id]').attr('seller_id');
                    var is_gift = true;// $(this).data('is_gift')||false;
                    var gift_message = $(this).data('gift_message')||'';
                    if (window.__Config.nostore) {
                        var dlg = $.dialog('add_gift_msg');
                        var title = dlg.$obj.find(".gift-container p.ltit").html();
                        if( $(this).closest('.optional').hasClass('add') ) title = title.replace(/Edit/i,"Add");
                        else title = title.replace(/Add/i,"Edit");
    
                        dlg.$obj.find("textarea.gift").val(gift_message).end().find(".gift-container p.ltit").html( title );
                        dlg.$obj.find("input:checkbox")[0].checked = is_gift;
                        if(is_gift){
                            dlg.$obj.find("textarea.gift").removeAttr('disabled');
                        }else{
                            dlg.$obj.find("textarea.gift").attr('disabled','disabled');
                        }
                        
                        dlg.open().$obj.find("textarea.gift").focus();
                    } else {
                        var dlg = $.dialog('add_gift_msg');
                        var title = dlg.$obj.find("p.ltit").html();
                        if( $(this).closest('.optional').hasClass('add') ) title = title.replace(/Edit/i,"Add");
                        else title = title.replace(/Add/i,"Edit");
    
                        dlg.$obj.data('seller_id',seller_id).find("textarea.text").val(gift_message).end().find("p.ltit").html( title );
                        dlg.$obj.find("input:checkbox")[0].checked = is_gift;
                        if(is_gift){
                            dlg.$obj.find("textarea").removeAttr('disabled');    
                        }else{
                            dlg.$obj.find("textarea").attr('disabled','disabled');    
                        }
                        
                        dlg.open().$obj.find("textarea").focus();    
                    }
                })
                .on('click', '.checkout-review .optional .gift a.remove', function(event){
                    event.preventDefault();
                    var giftInfo = {'gift_info':{}};

                    if (window.__Config.nostore) {
                        getSellerIds().forEach(function(seller_id){
                            giftInfo.gift_info[seller_id] = {"is_gift": false, "gift_message": ''};
                        })
                    } else {
                        var seller_id = $(this).closest('[seller_id]').attr('seller_id');
                        giftInfo.gift_info[seller_id] = {"is_gift": false, "gift_message": ''};
                    }

                    checkoutPutRequest(giftInfo, refreshCheckout);
                })
                .on('click', '.checkout-review a.save_for_later', function(e){
                    e.preventDefault();
                    var $this = $(this);
                    $this.addClass('disabled');
                    var item_id = $this.data('item_id');
                    var option_id = $this.data('option_id');

                    var url = "/rest-api/v1/checkout/item/"+item_id+(option_id?"/option/"+option_id:"")+"/later";

                    $.ajax({
                        type : 'POST',
                        url  : url,
                        data : {},
                        dataType : 'json',
                        success  : function(res){
                            refreshCheckout();
                        },
                        complete : function(){
                            $this.removeClass('disabled');
                        }
                    });
                })
                .on('click', '.checkout-review .cart-item-detail li a.remove', function(e){
                    e.preventDefault();
                    var $this = $(this);
                    $this.addClass('disabled');

                    params = {
                        item_id : $this.data('item_id'),
                        option_id : $this.data('option_id')
                    };

                    removeItem($this, params, function(){ 
                        refreshCheckout();
                    });
                })
                .on('click', '.checkout-review .sdd_option fieldset > a', function(event){
                    event.preventDefault();
                    $(this).hide().next().show();
                });

            if (window.__Config.nostore) {
                $(".popup.edit_seller_note")
                    .on('click', 'button.btn-continue', function(){
                        var note = $(".popup.edit_seller_note").find("textarea.note").val().trim();
                        var payload = {};

                        if (note) {
                            payload.note_info = {};
                            getSellerIds().forEach(function(seller_id){
                                payload.note_info[seller_id] = note;
                            })
                        }

                        if (payload.note_info) {
                            checkoutPutRequest(payload, refreshCheckout);
                        }

                        $.dialog('edit_seller_note').close();
                    });
                $(".popup.add_gift_msg")
                    .on('click', 'button.btn-continue', function(){
                        var is_gift = $(".popup.add_gift_msg").find("input:checkbox")[0].checked;
                        var gift_message = $(".popup.add_gift_msg").find("textarea.gift").val().trim();

                        var payload = {};
                        if (gift_message) {
                            payload.gift_info = {};
                            getSellerIds().forEach(function(seller_id){
                                payload.gift_info[seller_id] = {"is_gift": is_gift, "gift_message": gift_message};
                            })
                        }

                        if (payload.gift_info) {
                            checkoutPutRequest(payload, refreshCheckout);
                        }

                        $.dialog('add_gift_msg').close();
                    })
                    .on('click', 'input:checkbox', function(){
                        if(this.checked){
                            $(".popup.add_gift_msg textarea.gift").removeAttr('disabled');
                        }else{
                            $(".popup.add_gift_msg textarea.gift").attr('disabled','disabled');
                        }
                    });
            } else {
                $(".popup.edit_seller_note")
                    .on('click', 'button.btn-continue', function(){
                        var seller_id = $(".popup.edit_seller_note").data('seller_id');
                        var note = $(".popup.edit_seller_note").find("textarea").val();

                        var noteInfo = {'note_info':{}};
                        noteInfo.note_info[seller_id] = note;

                        checkoutPutRequest(noteInfo, function(res) {
                            refreshCheckout(res);
                        });
                        $.dialog('edit_seller_note').close();
                    });
                $(".popup.add_gift_msg")
                    .on('click', 'input:checkbox', function(){
                        if( this.checked ){
                            $(".popup.add_gift_msg textarea").removeAttr('disabled');    
                        }else{
                            $(".popup.add_gift_msg textarea").attr('disabled','disabled');    
                        }
                    })
                    .on('click', 'button.btn-continue', function(){
                        var seller_id = $(".popup.add_gift_msg").data('seller_id');
                        var is_gift = $(".popup.add_gift_msg").find("input:checkbox")[0].checked;
                        var gift_message = $(".popup.add_gift_msg").find("textarea").val();

                        var giftInfo = {'gift_info':{}};
                        giftInfo.gift_info[seller_id] = {"is_gift": is_gift, "gift_message": gift_message};

                        checkoutPutRequest(giftInfo, function(res) {
                            refreshCheckout(res);
                        });

                        $.dialog('add_gift_msg').close();
                    });
            }
        }
    }


    function removeItem($btn, data, callback){
        
        $btn.addClass('disabled').attr('disabled', true);
        var url = '/rest-api/v1/checkout/item/'+data.item_id;
        if(data.option_id) url += "/option/"+data.option_id;

        $.ajax({
            type : 'DELETE',
            url  : url,
            data : {},
            dataType : 'json',
            success  : callback || $.noop,
            complete : function(){                
                $btn.removeClass('disabled').removeAttr('disabled');
            }
        });
    };

    function renderSummary(data){
        var $frm = $(".checkout-submit:not(.giftcard)");
        var total_in_cent = Math.round(parseFloat(data.total_prices) * 100);
        $("body").data("total_prices_in_cent", total_in_cent);

        if(total_in_cent > 0){
            Checkout.Payment.show();
        }else{
            Checkout.Payment.hide();
        }

        if( parseFloat(data.fancy_money_amount) > 0 || parseFloat(data.credit_amount) > 0){
            Checkout.Payment.showCreditNotify(true);
        }else{
            Checkout.Payment.showCreditNotify(false);
        }

        $(".checkout-summary:not(.giftcard) p b span").html("$"+addCommas(data.total_prices));
        $frm.find("li.total .price").html("$"+addCommas(data.total_prices));
        $frm.find("li.subtotal_ .price").html("$"+addCommas(data.subtotal_prices));

        var shipping_promotion_amount = (data.extra_info.free_shipping_promotion && parseFloat(data.extra_info.free_shipping_promotion.total)) || 0;
        var checkout_shipping_coupon = (data.extra_info.checkout_shipping_coupon && parseFloat(data.extra_info.checkout_shipping_coupon)) || 0;
        var shipping_discount_amount = parseFloat(data.shipping_discount_amount) || 0
        var shipping_cost = parseFloat(data.shipping_costs) || 0
        $frm.find("li.shipping_ .price.before-discount").hide()
        $frm.find("li.shipping_ .price").html("$"+addCommas(data.shipping_costs));
        if(shipping_discount_amount > 0 || shipping_promotion_amount > 0 || checkout_shipping_coupon > 0) {
            if (checkout_shipping_coupon > 0) $frm.find("li.shipping_ .price").html("$"+addCommas((shipping_cost + checkout_shipping_coupon).toFixed(2)));
            $frm.find("li.shipping_ .price:not(.before-discount)").html("$"+addCommas((shipping_cost-shipping_discount_amount-shipping_promotion_amount).toFixed(2)))
            $frm.find("li.shipping_ .price.before-discount").show()
        }

        $frm.find("li.tax_ .price").html("$"+addCommas(data.sales_taxes));

        if(data.extra_info && data.extra_info.is_vanity) {
            var vanity;
            for(k in data.sale_items_freeze) {
                vanity = data.sale_items_freeze[k].items[0];
                break;
            }
            $frm.find("li.vanity_num .price").html(vanity.option);
            $frm.find("li.vanity_price .price").html("$"+addCommas(vanity.item_price));
        }

        var coupon_amount = parseFloat(data.coupon_amount)||0;
        if(shipping_discount_amount>0) {
            coupon_amount = Math.max(coupon_amount - shipping_discount_amount,0)
        }
        var fancyRebate = 0;
        for(k in data.sale_items_freeze){
            var item = data.sale_items_freeze[k];
            if(item.fancy_rebate) fancyRebate+= item.fancy_rebate;
        }
        if(coupon_amount > 0)
            $frm.find("li.coupon_").show().find(".price").html("- $"+addCommas(coupon_amount.toFixed(2)));
        else
            $frm.find("li.coupon_").hide();

        if(fancyRebate > 0)
            $frm.find("li.rebate_").show().find(".price").html("- $"+addCommas(fancyRebate.toFixed(2)));
        if(data.fancy_money_amount > 0)
            $frm.find("li.giftcard_").show().find(".price").html("- $"+addCommas(data.fancy_money_amount));

        $frm.find(".currency_price").attr('price', data.total_prices);
        refresh_currency();

        var addr = Checkout.Shipping.getCurrentAddress();
        $(".taxes-info").css('display', (addr && addr.country != "US") ? "block" : "none");
    }

    function renderSaleItems(data){
        var sellerTemplate = $("script#seller_template").html();
        var itemTemplate = $("script#cart_item_template").html();
        var payment_method = 'stripe';

        if(Object.keys(data.sale_items_freeze).length==0) {
            location.href = "/cart";
            return;
        }

        if(data.payment_gateway == 5) {
            payment_method = 'coinbase';
        } else if(data.payment_gateway == 21) {
            payment_method = 'bitpay';
        } else if(data.payment_gateway == 23) {
            payment_method = 'crypto';
        }
        var $couponArea = $(".checkout-submit .payment-coupon dd");
        var couponInfo = [];
        for(var key in data.sale_items_freeze) {
            coupons = data.sale_items_freeze[key].coupons;
            if(coupons) {
                couponInfo = couponInfo.concat(coupons);
            }
        }
        couponInfo = couponInfo && couponInfo[0];
        if( couponInfo ){
            $couponArea.find('.error, input, .btn-apply').hide().end().find(".list").show().find("li").html("<a href='#' class='remove-coupon_' code='"+couponInfo.code+"'>Remove</a> <b>"+couponInfo.code+ "</b> <small>"+couponInfo.description+"</small>");
        }else{
            $couponArea.find('input, .btn-apply').show().end().find('.error').hide().end().find(".list").hide().find('li').html('');
        }

        var isAvailable = true;
        $(".checkout-review [seller_id]").attr("mark-delete",true);
        for(k in data.sale_items_freeze){
            var seller = data.sale_items_freeze[k];
            var $sellerEl = $(".checkout-review [seller_id="+k+"]");
            if(!$sellerEl.length) $sellerEl = $(sellerTemplate);
            $sellerEl.attr('seller_id', k);
            $sellerEl.find('> h4').html(seller.items[0].brand_name);

            if(!seller.checkout_available) isAvailable = false;
            $sellerEl.find(".sdd_option").hide();
            
            $sellerEl.find("[item_id]").attr("mark-delete", true);

            var contains_shippable_item = false;
            $(seller.items).each(function(){
                var item = this;
                
                var $el = $sellerEl.find("[item_id="+item.id+"]");
                if(!$el.length) $el = $(itemTemplate);
                $el.attr('item_id', item.id)
                    .find(".item").attr("href", this.item_url)
                        .find("img").css("background-image","url('"+this.image_url+"')").end()
                        .find(".title").html(this.title).end()
                    .end()
                    .find(".price").html("Price: $"+addCommas(this.item_price.replace(".00",""))).end()
                    .find(".qty").html('Quantity: '+this.quantity).end();
                if(parseInt(this.item_retail_price) && this.item_price!=this.item_retail_price){
                    $el.find(".price").addClass("sales").html('Price: <small class="before">'+ "$"+addCommas(this.item_retail_price.replace(".00",""))+'</small>'+" <b>$"+addCommas(this.item_price.replace(".00",""))+"</b>")
                }
                if(this.option_id){
                    $el.find("._option").show().html("Option: "+this.option);
                }
                
                if(item.error_message){
                    $el.find(".error").find('b').html(item.error_message).end().show();
                    //$el.find(".action").show().end().removeClass('hide-action');
                    $el.find(".delivery-option").hide();
                    $el.find("a.save_for_later, a.remove").data('cid', item.id).data('sicid', item.id).data('item_id', item.sale_id).data('option_id', item.option_id);
                }else{
                    $el.find(".error, .action").hide().end().addClass('hide-action');
                    $el.find(".delivery-option").show();
                    contains_shippable_item = true;
                }
                if(item.personalizable){
                    $el.find(".personalization").show().find("em").text(item.personalization);
                }else{
                    $el.find(".personalization").hide();
                }

                $el.removeAttr('mark-delete');
                $el.appendTo( $sellerEl.find("ul") );
            })
            // var shipping_option = null;
            $sellerEl.find(".delivery-option ul").empty();
            if (seller.items[0].item_type != 'VANITY') {
                var shipping_options_length = $(seller.shipping_options).length;
                $(seller.shipping_options).each(function(){
                    var amount = "$"+this.amount.toFixed(2);
                    if(this.amount==0){
                        amount = "Free";
                    }
                    var html = "";
                    // var shipped_from = seller.ships_from_name;
                    if(shipping_options_length==1){
                        this.label = 'Shipping';
                        $sellerEl.find(".delivery-option").addClass('disabled').find("b.tit").hide();
                        //html = "<li><label for='seller_shipping_"+k+"_"+this.id+"'><b>"+this.label+" - "+amount+"</b> "+(shipped_from?('<span title="' + seller.ships_from_name + '">Ships from ' + seller.ships_from_name + "</span>"):"")+"<small>"+this.detail+"</small></label></li>";
                        html = "<li><label for='seller_shipping_"+k+"_"+this.id+"'><b>"+this.label+" - "+amount+"</b> <small>"+this.detail+"</small></label></li>";
                    }else{
                        $sellerEl.find(".delivery-option").removeClass('disabled').find("b.tit").show();
                        //html = "<li><input type='radio' id='seller_shipping_"+k+"_"+this.id+"' name='seller_shipping_"+k+"' value='"+this.id+"' "+(this.id==seller.shipping_selected?'checked':'')+"> <label for='seller_shipping_"+k+"_"+this.id+"'><b>"+this.label+" - "+amount+"</b>" +(shipped_from?('<span title="' + seller.ships_from_name + '">Ships from ' + seller.ships_from_name + "</span>"):"")+"<small>"+this.detail+"</small></label></li>";
                        html = "<li><input type='radio' id='seller_shipping_"+k+"_"+this.id+"' name='seller_shipping_"+k+"' value='"+this.id+"' "+(this.id==seller.shipping_selected?'checked':'')+"> <label for='seller_shipping_"+k+"_"+this.id+"'><b>"+this.label+" - "+amount+"</b> <small>"+this.detail+"</small></label></li>";
                    }
                    $html = $(html);
                    if (this.flat) {
                        $html.find('b').remove();
                    }
                    $sellerEl.find(".delivery-option ul").append($html);
                })
                if( !seller.shipping ){
                    $sellerEl.find('.delivery-option').addClass('free');
                }else{
                    $sellerEl.find('.delivery-option').removeClass('free');
                }
            }
            if(seller.shipping_selected == "3"){
                $sellerEl.find(".sdd_option").show();
                if(seller.sameday_is_today){
                    $sellerEl.find(".sdd_option option[value=today]").show();
                }else{
                    $sellerEl.find(".sdd_option option[value=today]").hide();
                    $sellerEl.find(".sdd_option select.date").val('tomorrow');
                }
                if(seller.sameday_order_by_delivery_by){
                    var range = seller.sameday_order_by_delivery_by.split('-');
                    $sellerEl.find('.sdd_option .time select').empty();
                    for(var i=range[0]; i<=range[1]; i++){
                        var time = i>=12?( (i>12?(i-12):i)+'PM'):(i+'AM');
                        if( i!=range[1] ){
                            $sellerEl.find('.sdd_option .time select[name=delivery_at_start]').append('<option value="'+i+'" '+(i==range[0]?'selected':'')+'>'+time+'</option');
                        }
                        if( i!=range[0] ){
                            $sellerEl.find('.sdd_option .time select[name=delivery_at_end]').append('<option value="'+i+'" '+(i==range[1]?'selected':'')+'>'+time+'</option');
                        }
                    }
                }

                if(seller.sameday_delivery){
                    if(seller.sameday_delivery.delivery_at){
                        var range = seller.sameday_delivery.delivery_at.split('-');
                        $sellerEl.find('.sdd_option .time select[name=delivery_at_start]').val(range[0]);
                        $sellerEl.find('.sdd_option .time select[name=delivery_at_end]').val(range[1]);
                    }
                    if(seller.sameday_delivery.delivery_on){
                        $sellerEl.find(".sdd_option select.date").val(seller.sameday_delivery.delivery_on);
                        if(!seller.sameday_is_today && seller.sameday_delivery.delivery_on=='today'){
                            seller.sameday_delivery.delivery_on = 'tomorrow';
                            $sellerEl.find(".sdd_option select.date").val(seller.sameday_delivery.delivery_on).change();
                        }                            
                    }
                }
                if(seller.sameday_message){
                    $sellerEl.find('.sdd_option textarea').val(seller.sameday_message).show().prev().hide();
                }

            }                

            $sellerEl.find("[item_id][mark-delete]").remove();

            var note = data.note_info[ k ];
            var giftInfo = data.gift_info[ k ];
            
            var $container = window.__Config.nostore ? $sellerEl.closest('.checkout-review') : $sellerEl;

            if(note || (giftInfo && giftInfo.is_gift)){
                $container.find(".optional.edit").show();
            }else{
                $container.find(".optional.edit").hide();
            }
            if(note)
                $container.find("a.note").data('note',note||'').end().find("div.note > span").html(note).end().find(".optional.add a.note").hide().end().find(".optional.edit > div.note").show();
            else
                $container.find("a.note").data('note','').end().find("div.note > span").html('').end().find(".optional.add a.note").show().end().find(".optional.edit > div.note").hide();
            if(giftInfo && giftInfo.is_gift) {
                $container.find("a.gift").data('is_gift',true).data('gift_message',giftInfo.gift_message||'').end().find("div.gift > span").removeClass('empty').html(giftInfo.gift_message).end().find(".optional.add a.gift").hide().end().find(".optional.edit > div.gift").show();
                if (!giftInfo.gift_message) {
                    $container.find("div.gift > span").addClass('empty').html('No gift message');
                }
            }
            else {
                $container.find("a.gift").data('is_gift',false).data('gift_message','').end().find("div.gift > span").html('').end().find(".optional.add a.gift").show().end().find(".optional.edit > div.gift").hide();
            }

            if( note || (giftInfo && giftInfo.is_gift) ){
                $container.find(".optional.add span").hide();
            }else{
                $container.find(".optional.add span").show();
            }

            if(contains_shippable_item) {
                $container.find(".optional.add").show();
                $container.find('.delivery-option').show();
            } else {
                $container.find(".optional.add, .optional.edit").hide();
                $container.find('.delivery-option').hide();
            }

            //if(samedayMessage)
            //    $(".cart-list ._sameday").show().find(".text").html(samedayMessage);

            $sellerEl.removeAttr('mark-delete');
            $sellerEl.appendTo($(".checkout-review .review"));
            try {
                if (!window.begin_checkout_sent) {
                    track_event('Begin Checkout', { 'payment method': payment_method, 'type': 'saleitem', 'seller id': k});
                    window.begin_checkout_sent = true;
                }
            }catch(e) {}
        }
        $(".checkout-review [seller_id][mark-delete]").remove();

        if(isAvailable && !Checkout.Shipping.isOpened() && !Checkout.Payment.isOpened()){
            $(".btn-checkout").removeAttr('disabled');
        }else{
            if (!window.use_amex_express) {
                $(".btn-checkout").attr('disabled', 'disabled');
            }
        }
        if ($('.checkout-giftoption').length) {
            for(var k in data.sale_items_freeze){
                $('.checkout-giftoption').attr('seller_id', k);
            }
            var giftInfo = data.gift_info[ k ];
            if (giftInfo && giftInfo.is_gift) {
                $('.checkout-giftoption').find('li').removeClass('selected');
                $('.checkout-giftoption').find('li > input#giftopt_t').attr('checked', true).closest('li').addClass('selected');
                $('.checkout-giftoption').find('li.selected > textarea').val(giftInfo.gift_message);
            }
        }
    }
    
    var initialRender = true;
    function render(data){
        $("[name=checkout_id]").val(data.id);
        renderSummary(data);
        renderSaleItems(data);

        var shipping_addr_id;
        for(var k in data.sale_items_freeze){
            shipping_addr_id = data.sale_items_freeze[k].shipping_addr_id;
            if(shipping_addr_id) break;
        }
        Checkout.Shipping.current_address_id = shipping_addr_id;

        if (initialRender) {
            Checkout.Shipping.init();
            Checkout.Payment.init();
            Checkout.Review.init();

            if ((window.use_paypal_checkout || window.pay_with_google)) {
                $.each(data.shipping_info.addresses, function(idx, address) {
                    if (address.id == shipping_addr_id) {
                        Checkout.Shipping.updateOrCreateAddress(address);
                    }
                });
                Checkout.Shipping.$el.find("ul.select_shipping > li[data-id="+shipping_addr_id+"] input:radio").trigger('click');
                Checkout.Shipping.close();
                Checkout.Payment.open(); // open and close to enable the payment layer
                Checkout.Payment.close();
                Checkout.Review.open();
            } else if (Checkout.is_guest) {
                if (window.localStorage) {
                    var addr = localStorage.getItem("last_address");
                    if (addr) {
                        try {
                            addr = JSON.parse(addr);
                            var now = (new Date()).getTime();
                            if (now - addr.timestamp <= 1000 * 3600 * 24) {
                                Checkout.Shipping.$el.find('form.new input,select').each(function(idx, elem) {
                                    var $elem = $(elem), name = $elem.attr('name');
                                    if (addr.hasOwnProperty(name)) {
                                        $elem.val(addr[name]);
                                        if (name == 'country') $elem.change();
                                    }
                                });
                            } else {
                                localStorage.removeItem("last_address");
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    }
                }
            } else if( Checkout.Shipping.$el.find("ul.select_shipping li").length ) {
                var $cur = Checkout.Shipping.$el.find("ul.select_shipping li[data-id=" + Checkout.Shipping.current_address_id + "]");
                if ($cur.length > 0) {
                    $cur.find('input:radio').trigger('click');
                } else {
                    Checkout.Shipping.open();
                }
            }
            initialRender = false;
        }

        $(".wrapper-content").removeClass('loading');
    }

    var isBegin = true;
    function refreshCheckout(json){
        if(json){
            render(json);
        }else{
            var method = "GET", params = location.args;
            if (isBegin && window.checkout_post_param) {
                method = "POST";
                params = window.checkout_post_param;
            }
            if(window.express_checkout) {
                params['express'] = true
            }
            $.ajax({
                type : method,
                url  : '/rest-api/v1/checkout',
                data : params, dataType: "json",
                success  : function(json){
                    if(isBegin){
                        var param = {'payment method':'stripe', type:'saleitem'}
                        if( json.payment_gateway == 5){
                            param['payment method'] = 'coinbase';
                        }else if( json.payment_gateway == 21){
                            param['payment method'] = 'bitpay';
                        }else if( json.payment_gateway == 23){
                            param['payment method'] = 'globee';
                        }else if (json.payment_gateway == 16){
                            param['payment method'] = 'amex checkout';
                        }
                        if( $(".checkout-submit").hasClass("giftcard") ){
                            param['type'] = 'giftcard';
                        }else{
                            param['seller id'] = Object.keys( json.sale_items_freeze).join(", ");                        
                        }

                        if (!window.pay_with_google) { // Begin Payment is tracked on Cart page for google payment
                            track_event('Begin Payment', param ); 
                        }
                        isBegin = false;
                    }
                    render(json);
                }
            }).fail(function(xhr) {
                var message = "Error occured. please try again.\n"+xhr.status + ' ' + xhr.statusText;
                try {
                    var res = xhr.responseJSON;
                    if (res && res.error) message = res.error;
                } catch (e) {
                }
                alert(message);
                location.href='/cart';
            });
        }
    }

    if($('.checkout-submit.giftcard').length==0) {
        // do not call GET/POST /rest-api/v1/checkout for gift-card checkout.
        refreshCheckout();
        // Shipping/Payment/Review.init will be called after refreshCheckout Finished.
        //Checkout.Shipping.init();
        //Checkout.Payment.init();
        //Checkout.Review.init();
    } else {
        Checkout.Shipping.init();
        Checkout.Payment.init();
        Checkout.Review.init();
    }
    
    // currency approximately
    var str_currency = $('.checkout-submit .currency_price').eq(0).text();
    var dlg_currency = $.dialog('show_currency');
    var $currency_list = $('.popup.show_currency .currency-list');

    var $currency = $('.checkout-submit .currency_price');
        
    function refresh_currency(){
        $currency.text(str_currency);

        // get currency
        $currency.each(function(i,v){
            var $this = $(v);
            if($this.attr('price') && parseFloat($this.attr('price'))>0){    
                if ($this.attr('currency')) {
                    show_currency(v, $this.attr('currency'));
                } else {
                    setTimeout(function(){
                        $.ajax({
                            type : 'GET',
                            url  : '/get_my_currency.json',
                            dataType : 'json',
                            success  : function(json){
                                if(json && json.currency_code) show_currency(v, json.currency_code);
                            }
                        });
                    },100)
                }
            }else{
                $this.closest(".currency").hide();
            }
        })    
    };

    function text_currency(el, money, code, symbol, natural_name) {

        if(typeof(money) == 'number') {
            money = money.toFixed(2);
        }
        money = money.replace(/[ \.]00$/,'');

        var str = str_currency.replace('...', symbol+" "+money+' <small>'+code+'</small>');
        $(el).html(str);
        $(el).attr('currency', code);
        $(el).closest(".wrapper").find(".currency .country > a").html(natural_name);
    };

    function show_currency(el, code, set_code){
        var p = $(el).attr('price');

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
            $(el).attr('currency', code);
            return $(el).closest(".wrapper").find(".change_currency").show().end().find(".currency .country, .currency .currency_price").hide();
        }else{            
            $(el).closest(".wrapper").find(".currency .country, .currency .currency_price").show().end().find(".change_currency").hide();
        }

        text_currency(el, '...', code, '');
        
        $.ajax({
            type : 'GET',
            url  : '/convert_currency.json?amount='+p+'&currency_code='+code,
            dataType : 'json',
            success  : function(json){
                if(!json || typeof(json.amount)=='undefined') return;
                var price = json.amount.toFixed(2) + '', regex = /(\d)(\d{3})([,\.]|$)/;
                while(regex.test(price)) price = price.replace(regex, '$1,$2$3');

                if(window.numberType === 2) price = price.replace(/,/g, ' ').replace(/\./g, ',');

                text_currency(el, price, json.currency.code, json.currency.symbol, json.currency.natural_name);
            }
        });
    };
    
    $currency.closest(".wrapper").delegate('a.change_currency, a.code', 'click', function(event){
        var $this = $(this);
        event.preventDefault();
        if(!$currency_list.hasClass('loaded')) return;

        var old_dlg_class= $('#popup_container').attr('class');
        function close_currency() {
            if (old_dlg_class) $.dialog(old_dlg_class).open();
            else dlg_currency.close();
        }

        var my_currency = $currency.filter(":visible").eq(0).attr('currency');
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
        dlg_currency.open().$obj
            .find('.right-outer .right[code="all"]').show().end()
            .find('.right-outer .right').not('[code="all"]').hide().end().end()
            .off('click', 'button.cancel')
            .on('click', 'button.cancel', function() {
                close_currency();
            })
            .off('click', 'button.save')
            .on('click', 'button.save', function(event) {
                event.preventDefault();
                var code = $currency_list.find('.right li a.current').parent().attr('code');
                show_currency( $this.closest('.wrapper').find('.currency').find('.currency_price'), code, true);
                close_currency();
            });
    });

    $('.wrapper.guest-checkout input.text[name="email"]').keydown(function(e) {
        if (e.keyCode == 13)
            $(".wrapper.guest-checkout .btn-proceed").click();
    }).focus();

    $(".wrapper.guest-checkout button.btn-proceed").click(function() {
        var $wrapper = $(".wrapper.guest-checkout"), $email = $wrapper.find("input[name=email]");
        var email = $email.val();
        if(!email){
            $email.focus();
            $(window).scrollTop(0);
            alertify.alert("Please enter your email address to continue.");
            return;
        }
        if(!emailRegEx.test(email)){
            $email.focus();
            $(window).scrollTop(0);
            alertify.alert("Please enter a valid email address.");
            return;
        }
        $email.prop('readonly', true);
        $wrapper.addClass("confirm");
        Checkout.Shipping.open();
    });

    var $requiredPhoneDialog = $.dialog('required_phone').$obj
    $('button.btn-checkout').click(function(event){
        var addr = Checkout.Shipping.getCurrentAddress();
        if (Checkout.is_guest || Checkout.is_gift_card || (addr && addr.phone)) {
            $('form.payment_').submit();
            return
        }

        var str = Checkout.Shipping.getCurrentAddressString();
        $requiredPhoneDialog.find('address').text(str);
        $.dialog('required_phone').open();
    });

    $requiredPhoneDialog.on('click', '.btn-area .btn-checkout', function(){
        var addr = Checkout.Shipping.getCurrentAddress();
        var phone = $requiredPhoneDialog.find('input[type="tel"]').val();

        phone = phone.replace(/\s+/g, ''); 
        if (addr.country == 'US') {
            if (phone.length < 10 || !phone.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/)) {
                alertify.alert('Please specify a valid phone number.')
                return false;
            }
        } else if (phone.length < 1){
            alertify.alert('Please enter the phone number.')
            return false;
        }

        window.override_shipping_phone = phone;
        $('form.payment_').submit();
    });

    $(".payment_").submit(function(e){
        var $btn = $("button.btn-checkout");

        function saveCheckoutPayment() {
            var checkoutId = $("[name=checkout_id]").val();
            var total_in_cent = $("body").data("total_prices_in_cent");
            var $selectedPayment = $("#content > .checkout-payment.wrapper ul.select_payment li.selected");

            var paymentId = $selectedPayment.find("input:radio").val();
            if (!paymentId) {
                if (total_in_cent > 0) {
                    alertify.alert("Please select your payment method");
                    $btn.removeClass('loading').prop('disabled', false);
                    return;
                } else {
                    paymentId = 0;
                }
            }
            var params = { "payment_id": paymentId };

            if (window.override_shipping_phone) {
                params.override_shipping_phone = window.override_shipping_phone;
                delete window.override_shipping_phone;
            }

            if (Checkout.is_guest) {
                params = { "card_token": paymentId, "email": $('.wrapper.guest-checkout input.text[name="email"]').val() }
                var billingAddress = $selectedPayment.data('billing_address_obj');
                params['billing_addr'] = JSON.stringify(billingAddress);
            }
            params = $.extend(params, window.payment_params);

            $.ajax({
                type : 'POST',
                url  : '/rest-api/v1/checkout/payment/'+checkoutId,
                contentType: "application/json; charset=utf-8",
                data : JSON.stringify(params),
                processData : false,
                success  : function(res){
                    if(res.error){
                        alert(res.error);
                        document.location.href="/cart";
                        return;
                    } 
                    confirmMessengerOptin(checkoutId);
                    $(".payment_").attr('paid','true')
                        .find("input[name=checkout_id]").val(checkoutId).end()
                        .find("input[name=checkout_code]").val(res.checkout_code);
                    if (window.localStorage) localStorage.removeItem("last_address");
                    if (res.cartbuster) {
                        var $sponsored = $.dialog('sponsored'), $obj = $sponsored.$obj;
                        $obj.find('img.brand_cover_img')
                            .css('background-image', "url('" + res.cartbuster.cover_image.resized_url+ "')");
                            //.load(function() { $sponsored.center(); });
                        if(res.cartbuster.sponsor_logo) {
                            $obj.find('img.brand_logo').show();
                            $obj.find('img.brand_logo').attr('src' , res.cartbuster.sponsor_logo.resized_url );
                        } else {
                            $obj.find('img.brand_logo').hide();
                        }
                        $obj.find('p.brand_name b').text(res.cartbuster.sponsor_name);
                        $obj.find('p.tit').text(res.cartbuster.checkout_title);
                        $obj.find('p.tagline').text(res.cartbuster.message);
                        $obj.find('.byline').html(res.cartbuster.byline);
                        if(res.cartbuster.button_text) $obj.find('.btn-cancel').html(res.cartbuster.button_text);
                        $obj.on('close', function() {
                            $(".payment_").submit();
                        });
                        $sponsored.open();
                    } else{
                        $(".payment_").submit();
                    }
                },
                error: function(res){
                    if (res && res.responseJSON && res.responseJSON.error) {
                        alert(res.responseJSON.error);
                        if (res.responseJSON.recoverable) {
                            $btn.removeClass('loading').prop('disabled', false);
                            return;
                        }
                    } else alert("We failed to process your order. Please try again or contact cs@fancy.com");
                    document.location.href="/cart";
                }
            });
        }

        function preProcess() {
            if ($('.wrapper-content.vanity').length > 0) {
                var giftOption = $('.checkout-giftoption').find('li.selected > input').attr('value');
                var seller_id = $('.checkout-giftoption').attr('seller_id');
                var giftInfo = {'gift_info':{}};
                var giftMessage = '';
                if (giftOption == 'true') {
                    giftOption = true;
                    giftMessage = $('.checkout-giftoption').find('li.selected > textarea').val();
                } else {
                    giftOption = false;
                }
                giftInfo.gift_info[seller_id] = {"is_gift": giftOption, "gift_message": giftMessage};
                if (location.args) {
                    $.extend(giftInfo, location.args);
                }
                $.ajax({
                    type : 'PUT',
                    url  : '/rest-api/v1/checkout',
                    contentType: "application/json; charset=utf-8",
                    data : JSON.stringify(giftInfo),
                    processData : false,
                    success  : function(e) {
                        saveCheckoutPayment();
                    }
                });
            } else if ($('.checkout-submit.giftcard').length > 0) {
                if ($('.checkout-payment .new').is(":visible")) {
                    var $form = $('.checkout-payment .new');
                    var params = getParam($form);
                    
                    params.country_code = $form.find('[name=country_code]').find('option[value='+params.country_code+']').attr('data-code2');
                    params.state = $form.find("[name=state]:visible").val();
                    params.set_default = $form.find("input[name=set_default]")[0].checked;

                    Checkout.Payment.addNewCard(params, function(data){
                        if(!data.card_id){
                            $btn.removeClass('loading').prop('disabled', false);
                            alertify.alert(data.message||"Please input valid credit card info");
                            return;
                        }
                        $("input[type='hidden'][name='card_id']").val(data.card_id);
                        $("input[type='hidden'][name='card_last_digits']").val(data.card_last_digits);
                        $(".payment_").attr('paid','true').submit();
                    }, function() {
                        $btn.removeClass('loading').prop('disabled', false);
                    });
                } else {
                    var cardId = $("input[name='card_payment']:checked").val();
                    if (!cardId) {
                        $btn.removeClass('loading').prop('disabled', false);
                        alert("Please enter payment information. ");
                        return;    
                    } else {
                        var lastDigits = $("input[name='card_payment']:checked").closest('li').attr('data-last_digits');
                        $("input[type='hidden'][name='card_id']").val(cardId);
                        $("input[type='hidden'][name='card_last_digits']").val(lastDigits);
                        $(".payment_").attr('paid','true').submit();    
                    }    
                }
            } else {
                saveCheckoutPayment();
            }
        }

        if(!$(this).attr('paid') && !$btn.hasClass("loading")){
            $btn.addClass('loading').prop('disabled', true);
            e.preventDefault();
            preProcess();
        }
        
    })  

})
