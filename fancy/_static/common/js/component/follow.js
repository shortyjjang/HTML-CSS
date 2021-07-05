/**
 * Create follow/following toggle button.
 */
(function(){
	$(document).on('click', 'a[data-component="follow"],button[data-component="follow"]', function(event){
		var $this = $(this), username = $this.attr('data-username'), following = $this.hasClass('following');

		event.preventDefault();

		if (!username) return;
		if ($this.attr('disabled')) return;

		$this.attr('disabled', 'disabled');

		$.ajax({
			type : 'PUT',
			url  : '/rest-api/v1/users/'+username,
			data : { following : !following },
			success : function(user) {
				if ('following' in user) {
					user.following ? $this.addClass('following') : $this.removeClass('following');
				}

				$this.trigger('change:following');
			},
			complete : function() {
				$this.removeAttr('disabled');
			}
		});
	});
});
