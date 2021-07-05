jQuery(function($) {
    $('.only-number').change(function(event) {
        var oldvalue = $(this).val();
        var newvalue = $(this).val().replace(/[^0-9]+/g,'');
        var zpad = parseInt($(this).data('zero-pad')) || 0;
        while(newvalue.length<zpad) {
            newvalue = '0'+newvalue;
        }

        if(newvalue!=oldvalue) {
            $(this).val(newvalue);
        }
    });
    $('.only-number').keydown(function(event) {
        var key = event.key.toLowerCase();

        if(key in {'arrowup':true,'arrowdown':true}) {
            var oldvalue = $(this).val();
            var oldnumber = parseInt(oldvalue);

            var newvalue = oldnumber + ((key=='arrowup')?1:-1);
            var maxvalue = parseInt($(this).data('max-value'));
            var minvalue = parseInt($(this).data('min-value'));
            var zpad = parseInt($(this).data('zero-pad')) || 0;

            if(newvalue!='') {
                var newvalue_int = parseInt(newvalue) || 0;
                if(newvalue_int>maxvalue) {
                    newvalue_int = maxvalue;
                }
                if(newvalue_int<minvalue) {
                    newvalue_int = minvalue;
                }
                newvalue = '' + newvalue_int;
            }

            var newvalue_pad = newvalue;
            while(newvalue_pad.length<zpad) {
                newvalue_pad = '0'+newvalue_pad;
            }

            if(newvalue!=oldvalue && newvalue_pad!=oldvalue) {
                $(this).val(newvalue_pad);
            }
            event.preventDefault();
            return false;
        }

        if(/^[0-9]$/.test(key) || key in {'backspace':true,'delete':true,'arrowleft':true,'arrowright':true,'tab':true} || !!event.metaKey) {
            return true;
        }
        event.preventDefault();
    });
    $('.only-number').keyup(function(event) {
        var oldvalue = $(this).val();
        var newvalue = $(this).val().replace(/[^0-9]+/g,'');
        var maxvalue = parseInt($(this).data('max-value'));
        var minvalue = parseInt($(this).data('min-value'));
        var zpad = parseInt($(this).data('zero-pad')) || 0;

        if(newvalue!='') {
            var newvalue_int = parseInt(newvalue) || 0;
            if(newvalue_int>maxvalue) {
                newvalue_int = maxvalue;
            }
            if(newvalue_int<minvalue) {
                newvalue_int = minvalue;
            }
            newvalue = '' + newvalue_int;
        }

        var newvalue_pad = newvalue;
        while(newvalue_pad.length<zpad) {
            newvalue_pad = '0'+newvalue_pad;
        }

        if(newvalue!=oldvalue && newvalue_pad!=oldvalue) {
            $(this).val(newvalue_pad);
        }
    });
});