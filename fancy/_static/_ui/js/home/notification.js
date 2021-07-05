(function($) {
    $(document).ready(function() {
        var $activityList = $('#sidebar .activity ul');
        $.get("/recent_activity_feed.json?for_sidebar=true", {}, function (data) {
        	$activityList.empty();
            $activityList.html(data);
            if(!$activityList.find("li").length){
            	$activityList.hide().next().hide().next().show();
            }
        });
    });
})(jQuery);