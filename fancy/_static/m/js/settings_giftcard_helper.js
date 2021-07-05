jQuery(function($){

	var $money   = $('#money_in_currency'),
	    cur_code = $money.attr('currency') || 'USD',
	    type2    = /,23/.test($money.attr('sample')),
	    balance  = $('#content .balance').text().match(/([\d, ]+(?:[\.,]\d+)?)/) ? RegExp.$1 : '0',
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

				$money.text(b+ " "+json.currency.code);
			}
		});
	};

	set_currency(cur_code);

});
