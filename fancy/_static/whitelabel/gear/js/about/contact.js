;(function($){
	function shopContact() {
		var $form = this.find('form');

		$form.find('input[type="text"],textarea').each(function(){
				if( $(this).val() ) $(this).attr('data-init', $(this).val() );
			})

		$form
			.off('submit', formSubmit).on('submit', formSubmit)
			.off('keyup blur focus')
			.on('keyup blur focus', 'input[type="text"],textarea', function(){ validate(this.form,false) });
	};

	function reset($form){
		$form.find("[name=subject],[name=order_id],[name=message]").val('');
	}

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
			url  : '/contact_us.json',
			data : data,
			dataType : 'json',
			success  : function(json) {
				if (json.status_code) {
					alertify.alert("Message sent. We'll be in touch!");
					reset($form);
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
		alertify.alert('Sorry, something went wrong.\nPlease try again later.');
	};

	function validate(form,message) {
		var $form = $(form), data = serialize(form), ret = true;

        $form.find('label.error-msg').text('');
		$form.find('p.error').removeClass('error');

		// don't show error message when blur. https://app.asana.com/0/2447287358540/11897108387621			
		if (message && !data.from_name) ret = error(form.from_name);
		if (message && !data.from_email) ret = error(form.from_email);
		if (message && !data.subject) ret = error(form.subject);
		if (message && !/[\w\.%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,4}/i.test(data.from_email)) ret = error(form.from_email, 'INVALID EMAIL');
		if (message && !data.message) ret = error(form.message);

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
		var $field = $(field), $container = $field.closest('p').addClass('error'), $msg = $container.find('.error-msg');

		$msg.text( msg || $msg.attr('data-text') );

		return false;
	};
	
	$.fn.shopContact = shopContact;
	$(function(){
		$('[data-component="shop-contact"]').shopContact();	
	})	
})(jQuery);
