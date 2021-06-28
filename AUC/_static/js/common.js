
jQuery(function($){
	$('.tab a').click(function(){
		$(this).closest('.tab').find('a').removeClass('current').end().end().addClass('current');
		return false;
	});
	$('.keypad button').click(function(){
		if ($(this).hasClass('remove') || $(this).hasClass('cancel')) {
			$('.keypad_number .dot').removeClass('on');
		}else if($('.keypad_number i:not(.on)')) {
			$('.keypad_number i:not(.on):eq(0)').addClass('on');
		}
	});
	$('#popup_container').click(function(e){
		if(e.target.id === 'popup_container') {
			$(this).hide().find('.popup').hide();
		}
	});
	$('.popup .button.cancel').click(function(){
		$(this).closest('.popup').hide().closest('#popup_container').hide();
	});
});

function showPopup(popup){
	$('#popup_container').show().find('.'+popup).show();
}
function copyClipboard() {
	/* Get the text field */
	var copyText = document.getElementById("copyText");

	/* Select the text field */
	copyText.select();
	copyText.setSelectionRange(0, 99999); /* For mobile devices */

	/* Copy the text inside the text field */
	document.execCommand("copy");

}