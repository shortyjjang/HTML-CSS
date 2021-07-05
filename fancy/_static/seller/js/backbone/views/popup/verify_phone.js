FancyBackbone.Views.Popup = FancyBackbone.Views.Popup || {};
FancyBackbone.Views.Popup.VerifyPhonePopup = FancyBackbone.Views.Base.TemplateView.extend({
    template: 'popup_verify_phone',
    events: {
        'click .to_voice': 'onToVoiceClick',
        'click .to_sms': 'onToSmsClick',
        'click .start .sms .btn-send': 'onSendSmsCodeClick',
        'click .verify.sms a.resend': 'onResendSmsCodeClick',
        'click .verify.sms .btn-confirm': 'onConfirmSmsCodeClick',
        'click .start .voice .btn-send': 'onSendVoiceClick',
        'click .success .close': 'onCloseClick',
        'click .btn-back': 'onBackClick',
        'click .cancel': 'onCancelClick',
    },
    templateData: function () {
        return {
            phoneNumber: this.phoneNumber
        };
    },
    open: function () {
        $.dialog("confirm-phone").open();
    },
    validateData: function () {
        return true;
    },
    syncModel: function () {
        
    },
    onToVoiceClick: function (e) {
        e.preventDefault();
        var phoneNumber = this.$el.find(".start .sms .phone input:text").val()
        this.$el
            .find(".start .sms").hide().end()
            .find(".start .voice").show().find("input:text").val(phoneNumber);
    },
    onToSmsClick: function (e) {
        e.preventDefault();
        var phoneNumber = this.$el.find(".start .voice .phone input:text").val()
        this.$el
            .find(".start .voice").hide().end()
            .find(".start .sms").show().find("input:text").val(phoneNumber);
    },
    onBackClick: function (e) {
        e.preventDefault();
        this.$el.find("> div").hide().end().find(".start").show();
    },
    onCancelClick: function (e) {
        e.preventDefault();
        $.dialog("confirm-phone").close();
    },
    onCloseClick: function (e) {
        e.preventDefault();
        $.dialog("confirm-phone").close();
        if(this.success){
            this.success( this.phoneNumber );
        }else{
            document.location.reload();
        }
    },
    onSendSmsCodeClick: function (e) {
        var that = this;
        var phoneNumber = this.$el.find(".start .sms .phone input:text").val()
        this.phoneNumber = phoneNumber;
        var param = { 'phone_number': phoneNumber };
        if(!window.seller){
            param.user_id = window.user.id;
        } else if(window.user && window.user.get('is_admin_senior')){
            param.seller_id = window.seller.get('id_str');
        }
        var $button = $(e.target)
        $button.prop('disabled',true)
        $button.addClass('loading')
        $.post(
            "/merchant/send_verify_phone_sms.json",
            param,
            function(json){
                if (json.status_code == 1) {
                    that.$el.find(".start").hide().end().find(".verify.sms").show().find("input:text").val('');
                    if(json.phone_number){
                        that.$el.find(".start .sms .phone input:text").val(json.phone_number);
                        that.phoneNumber = phoneNumber;
                    }
                }
                else {
                    var msg = json.message;
                    if (msg && msg !== '') {
                        alertify.alert(msg);
                    }
                }
            }, "json")
        .always(function() {
            $button.prop('disabled',false)
            $button.removeClass('loading')
        })
        .fail(function(xhr) {
            var msg = "Error! Please try again later.";
            try{
                var err = JSON.parse(xhr.responseText);
                msg = err.message || msg;
                } catch (e) {}
            alert(msg);
        });
    },
    onResendSmsCodeClick: function (e) {
        e.preventDefault();
        var that = this;
        var phoneNumber = this.$el.find(".start .sms .phone input:text").val()
        this.phoneNumber = phoneNumber;
        var param = { 'phone_number': phoneNumber };
        if(!window.seller){
            param.user_id = window.user.id;
        }else if(window.user && window.user.get('is_admin_senior')){
            param.seller_id = window.seller.get('id_str');
        }
        var $button = $(e.target)
        $button.prop('disabled',true)
        $button.addClass('loading')
        $.post(
            "/merchant/send_verify_phone_sms.json",
            param,
            function(json){
                if (json.status_code == 1) {
                    alertify.alert('Re-sent!')
                }
                else {
                    var msg = json.message;
                    if (msg && msg !== '') {
                        alertify.alert(msg);
                    }
                }
            }, "json")
        .always(function() {
            $button.prop('disabled',false)
            $button.removeClass('loading')
        })
        .fail(function(xhr) {
            var msg = "Error! Please try again later.";
            try{
                var err = JSON.parse(xhr.responseText);
                msg = err.message || msg;
                } catch (e) {}
            alert(msg);
        });
    },
    onConfirmSmsCodeClick: function (e) {
        var that = this;
        var phoneNumber = this.$el.find(".start .sms .phone input:text").val()
        this.phoneNumber = phoneNumber;
        var code = this.$el.find(".verify.sms input:text").val();
        var param = { 'pin': code, 'phone_number': phoneNumber};
        if(!window.seller){
            param.user_id = window.user.id;
        }else if(window.user && window.user.get('is_admin_senior')){
            param.seller_id = window.seller.get('id_str');
        }
        $.post(
            "/merchant/check_verify_phone_code.json",
            param,
            function(json){
                if (json.status_code == 1) {
                    that.$el.find(".verify.sms").hide().end().find(".success").show();
                }
                else {
                    that.$el.find(".verify.sms").hide().end().find(".failed").show();
                }
            }, "json");
    },
    onSendVoiceClick: function (e) {
        var that = this;
        var phoneNumber = this.$el.find(".start .voice .phone input:text").val()
        this.phoneNumber = phoneNumber;
        var param = { 'phone_number': phoneNumber };
        if(!window.seller){
            param.user_id = window.user.id;
        }else if(window.user && window.user.get('is_admin_senior')){
            param.seller_id = window.seller.get('id_str');
        }
        var $button = $(e.target)
        $button.prop('disabled',true)
        $button.addClass('loading')
        $.post(
            "/merchant/send_verify_phone_voice.json",
            param,
            function(json){
                if (json.status_code == 1 && json.pin) {
                    json.pin = json.pin+"";
                    that.voice_pin = json.pin;
                    that.$el
                        .find(".start").hide().end()
                        .find(".verify.voice").show()
                            .find("span.digits:eq(0)").html( json.pin.charAt(0) ).end()
                            .find("span.digits:eq(1)").html( json.pin.charAt(1) ).end()
                    if(json.phone_number){
                        that.$el.find(".start .voice .phone input:text").val(json.phone_number);
                        that.phoneNumber = phoneNumber;
                    }

                    setTimeout( $.proxy(that.checkVoiceVerifyStatus, that), 2000);
                }
                else {
                    var msg = json.message;
                    if (msg && msg !== '') {
                        alertify.alert(msg);
                    }
                }
            }, "json")
        .always(function() {
            $button.prop('disabled',false)
            $button.removeClass('loading')
        })
        .fail(function(xhr) {
            var msg = "Error! Please try again later.";
            try{
                var err = JSON.parse(xhr.responseText);
                msg = err.message || msg;
                } catch (e) {}
            alert(msg);
        });
    },
    checkVoiceVerifyStatus: function () {
        var that = this;
        that.tryCount = (that.tryCount||0)+1;
        var param = { 'pin': this.voice_pin};
        if(!window.seller){
            param.user_id = window.user.id;
        }else if(window.user && window.user.get('is_admin_senior')){
            param.seller_id = window.seller.get('id_str');
        }
        $.post(
            "/merchant/check_verify_phone_status.json",
            param,
            function(json){
                if (json.status_code == 1) {
                    that.$el.find(".verify.voice").hide().end().find(".success").show();
                }
                else if(!json.status_code || that.tryCount > 20){
                    that.$el.find(".verify.voice").hide().end().find(".failed").show();
                }else{
                    setTimeout( $.proxy(that.checkVoiceVerifyStatus, that), 3000);
                }
            }, "json");
    },
    render: function (phoneNumber, success) {       

        this.phoneNumber = phoneNumber || (window.seller && window.seller.get('contact_phone')) || '';
        this.success = success
        var that = this;
        var superFn = this._super;
        superFn.apply(that);
        that.open();

        return this;
    }
});
