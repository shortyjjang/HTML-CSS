;(function($){
    var sn = 1;

    function subscribeEmail() {
        var $form = this.find('form'), $popup, key;

        if (key = $form.data('subscribe-key')) return;
        key = 'subscribe' + sn++;

        $form.find('input[type="text"],textarea').each(function(){
            if( $(this).val() ) $(this).attr('data-init', $(this).val() );
        })

        $popup = this.closest('.popup, .subscribe-container_');
        $popup.off('open.'+key).on('open.'+key, function(){
            $form.show()
                .find('input[type="text"],textarea').not('[readonly]').val('').end().end()
                .find('button:submit').prop('disabled', true).end()
                .find('p.error').removeClass('error');
            $form.find('input[type="text"][data-init],textarea[data-init]').each(function(){
                this.value = this.getAttribute('data-init') || '';
            })
            $popup.find('.complete').hide();
        });

        $form
            .off('submit', formSubmit).on('submit', formSubmit)
            .off('keyup.'+key+' blur.'+key+' focus.'+key)
            .on('keyup.'+key+' blur.'+key+' focus.'+key, 'input[type="text"],input[type="email"],textarea', function(){ validate(this.form,false) });
    };

    function formSubmit(event) {
        var $form = $(this), data = serialize(this), $submit;

        event.preventDefault();
        if (!validate(this,true)){
            $form.find('button:submit').prop('disabled', false);
            return;
        }

        $submit = $form.find('button:submit').prop('disabled', true);

        $.ajax({
            type : 'POST',
            url  : '/subscribe_email.json',
            headers : {'X-CSRFToken': csrftoken},
            data : data,
            dataType : 'json',
            success  : function(json) {
                if (json.status_code) {
                    alert("Email Subscribed");
                } else {
                    wentWrong();
                }
            },
            error : function() {
                wentWrong();
            },
            complete : function() {
                $submit.prop('disabled', false);
            }
        });
    };

    function wentWrong() {
        alert('Sorry, something went wrong.\nPlease try again later.');
    };

    function validate(form,message) {
        var $form = $(form), data = serialize(form), ret = true;

        $form.find('label.error-msg').text('');
        $form.find('p.error').removeClass('error');

        // don't show error message when blur. https://app.asana.com/0/2447287358540/11897108387621         
        if (message && !data.email) ret = error(form.email);
        if (message && !/[\w\.%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,4}/i.test(data.email)) ret = error(form.email, 'INVALID EMAIL');

        $form.find('button:submit').prop('disabled', !ret);

        return ret;
    };

    function serialize(form) {
        var arr = $(form).serializeArray(), data = {}, i = 0, pair;

        while (pair = arr[i++]) {
            data[pair.name] = $.trim(pair.value);
        }

        return data;
    };

    function error(field, msg) {
        var $field = $(field), $container = $field.closest('.container_').addClass('error'), $msg = $container.find('.error-msg'), val;

        if ($field.is('input[type="text"],textarea')) {
            val = $.trim($field.val());
            if (!val) $field.prop('readOnly', false);
        }

        $msg.text( msg || $msg.attr('data-text') );

        return false;
    };
    
    $.fn.subscribeEmail = subscribeEmail;
    $(function(){
        $('[data-component="subscribe-email"]').subscribeEmail(); 
    })  
})(jQuery);
