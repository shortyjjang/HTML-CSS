var getTodayDate = function(){
    var today = new Date();

    var day = today.getDate();
    var month = today.getMonth() + 1;
    var year = today.getFullYear();

    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;

    var date = year + "-" + month + "-" + day;
    return date;
};

$(function(){
    $('.remove_all_credits').parent().find('.text').val(getTodayDate());
});

$('.remove_all_credits').on('click',function(event){
    var uid = $(this).attr('uid');
    var params = {};
    params['user_id'] = uid;
    params['date'] = $(this).parent().find('.text').val();
    if (params['date'] === '') params['date'] = getTodayDate();

	if (window.confirm('Remove all credits?')){
        $.post(
            '/remove_all_credits.json',
			params, // parameters
			function(response){
                if (response.status_code != undefined && response.status_code == 1) {
                    alert("Successfully removed.");
                }
                else if (response.status_code != undefined && response.status_code == 0) {
                    if(response.message != undefined)
                        alert(response.message);
                }
			},
			"json"
		);
		return false;
	}
    return false;
});