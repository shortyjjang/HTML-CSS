jQuery(function($) {
    function getcaret($this) {
        var input = $this.get(0)
        if ('selectionStart' in input) {
            // Standard-compliant browsers
            return input.selectionStart;
        } else if(document.selection) {
            input.focus();
            var sel = document.selection.createRange();
            var selLen = document.selection.createRange().text.length;
            sel.moveStart('character', -input.value.length);
            return sel.text.length - selLen;
        }
    }

    function setcaret($this, pos) {
        var input = $this.get(0)
        if (input.setSelectionRange) {
            input.focus()
            input.setSelectionRange(pos,pos)
        } else if(input.createTextRange) {
            var range = input.createTextRange();
            range.move('character', pos);
            range.select();
        }
    }

    function format_cardnumber(cc, maxlength) {
        cc = cc.replace(/[^0-9]+/g,'')
        if(maxlength) {
            cc = cc.substring(0,maxlength)
        }
        if(cc.match(/^3[47]/)) {
            return [cc.substring(0,4),cc.substring(4,10),cc.substring(10,15)].join(' ').trim()
        }
        return cc?cc.match(/.{1,4}/g).join(' '):''
    }

    function setval($this, newval) {
        var maxlength = $this.attr('maxlength')

        var oldval = $this.val()
        var caret_position = getcaret($this)
        var before_caret = oldval.substring(0,caret_position)
        before_caret = format_cardnumber(before_caret)
        caret_position = before_caret.length

        var newvalue = format_cardnumber(oldval, maxlength)

        if(oldval==newvalue) return

        $this.val(newvalue)
        setcaret($this, caret_position)
    }

    $('.credit-card-number').change(function(event) {
        setval($(this))
    })
    $('.credit-card-number').keydown(function(event) {
        try {
            var key = event.key.toLowerCase();
            if(/^[0-9]$/.test(key) || key in {'backspace':true,'delete':true,'arrowleft':true,'arrowright':true,'tab':true} || !!event.metaKey) {
                return true;
            }
        } catch (e){
            return true;
        }
        event.preventDefault();
    })
    $('.credit-card-number').keyup(function(event) {
        setval($(this))
    })

    $('.credit-card-number').each(function(){
        $(this).validateCreditCard(function(res) {
            var $logo = $(this).siblings('.credit-card-logo');
            if(!$logo.length) $logo = $(this).closest('.card_number');

            var CARD_TYPES = {'visa':true,'mastercard':true,'amex':true,'amex-express':true,'american':true,'discover':true,'unknown':true}
            for(var k in CARD_TYPES) {
                $logo.removeClass(k)
            }
            if(res.card_type && res.card_type.name && res.card_type.name in CARD_TYPES) {
                $logo.addClass(res.card_type.name)
            } else {
                $logo.addClass('unknown')
            }

            $(this).attr('maxlength', 19)
            if(res.card_type && res.card_type.valid_length) {
                var maxlength = 0
                for(var i in res.card_type.valid_length) {
                    maxlength = Math.max(maxlength, res.card_type.valid_length[i])
                }
                if(maxlength>0) {
                    maxlength = maxlength + 3;
                    $(this).attr('maxlength', maxlength)
                } else {
                    $(this).attr('maxlength', 19)
                }
            }
            setval($(this))
        })
    });
})
