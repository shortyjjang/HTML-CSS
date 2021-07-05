jQuery(function($) {
    $('.input-number > a.minus').click(function(event) {
        event.preventDefault();
        var $input = $(this).parent().find('input[type="text"]');
        var val = $input.val();
        try {
            val = parseInt(val);
            val = val - 1;
            var min = parseInt($input.data('min-value')||1);
            if(val<min) val = min;
        } catch(e) {
            val = 1;
        }
        $input.val(val);
    });
    $('.input-number > a.plus').click(function(event) {
        event.preventDefault();
        var $input = $(this).parent().find('input[type="text"]');
        var val = $input.val();
        try {
            val = parseInt(val);
            val = val + 1;
            var max = parseInt($input.data('max-value')||10);
            if(val>max) val = max;
        } catch(e) {
            val = 1;
        }
        $input.val(val);
    });
})
