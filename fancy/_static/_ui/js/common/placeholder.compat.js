// support 'placeholder' attribute for older browsers
if (document.createElement("input").placeholder == undefined) {
    $('input[placeholder], textarea[placeholder]').each(function() {
        var fld=this, $fld=$(this), text=this.getAttribute('placeholder');

        function setPlaceholder() {
            var v = $.trim(fld.value);
            if(v==text||v=='') {$fld.val(text).addClass('placeholder');}
			else {$fld.val(v).removeClass('placeholder');}
        }

        function removePlaceholder() {
            var v = $.trim(fld.value);
            if(v==text||v=='') $fld.val('').removeClass('placeholder');
        }

        setPlaceholder();
        $fld.focus(removePlaceholder).blur(setPlaceholder).closest("form").submit(removePlaceholder);
        $fld.parents(".popup").find('button').click(removePlaceholder);
        $fld.parents("#content").find('button').click(removePlaceholder);
        $fld.parents("fieldset").find('button').click(removePlaceholder);
    });
}
