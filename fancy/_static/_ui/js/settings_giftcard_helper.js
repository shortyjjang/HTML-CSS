jQuery(function($){

	var $link    = $('#currency_code'),
	    $c_layer = $('ul.currency_codes'),
	    $money   = $('#money_in_currency'),
	    cur_code = $.cookie.get('currency') || 'USD',
	    type2    = /,23/.test($money.attr('sample')),
	    balance  = $('#content .status b').text().match(/([\d, ]+(?:[\.,]\d+)?)/) ? RegExp.$1 : '0',
       	b_value  = $.trim(balance);

	if(type2) b_value = b_value.replace(/,/g, '.').replace(/ /g, '');
	b_value = parseFloat(b_value.replace(/,/g, ''));

	function set_currency(code){
		var b = b_value;

		if (code == 'USD') return $money.text(balance);

		$money.text('...');
		$.ajax({
			type : 'GET',
			url  : '/convert_currency.json?amount='+b+'&currency_code='+code,
			dataType : 'json',
			success  : function(json){
				if(!json || typeof(json.amount)=='undefined') return;

				var b = (json.amount.toFixed(2) + '').replace(/(\d)(?=(\d{3})+\.)/g,'$1,');
				if(type2) b = b.replace(/,/g, ' ').replace(/\./g, ',');

				$money.text(b);
			}
		});
	};

	set_currency(cur_code);

	$link.text(cur_code).attr('href', '#').click(function(event){
		var $this = $(this);

		event.preventDefault();

		$c_layer.toggle();
		if($c_layer.is(':visible')){
			var offset = $this.offset();
			offset.top += this.offsetHeight + 1;
			offset.left -= 5;
			$c_layer.offset(offset);
		}
	});

	$c_layer.delegate('a', 'click', function(event){
		event.preventDefault();

		var $this = $(this), code = $this.text().match(/\(([A-Z]+)\)/);
		if(code && code[1] != cur_code) {
			set_currency(cur_code = code[1]);
			$link.text(cur_code);

			// and set currency setting
			$.ajax({
				type : 'POST',
				url  : '/set_my_currency.json',
				data : {currency_code:cur_code}
			});
		}

		$c_layer.hide();
	});

	$(document).mousedown(function(event){
		if (!$c_layer.is(event.target) && !$c_layer.has(event.target).length && !$link.is(event.target)) $c_layer.hide();
	});

});
