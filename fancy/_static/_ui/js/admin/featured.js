$(function(){

	var $form = $('#form-show-on-homepage');

	$form.on('click' , '#featured-submit', function(e) {

		e.preventDefault();

		var $this = $(this);
		var object_id = $this.data('id');
		var type = $this.data('type');

		if ($('#featured-check').prop('checked')) {
			var timestamp = $('#featured-timestamp').val();
			var params = {'object_id' : object_id,
						  'type' : type,
						  'timestamp' : timestamp }
			var category = []
			$.each($form.find('input[name="category"]:checked'),
				   function() {
					   category.push($(this).val());
				   });
			params['category'] = category.join(',');

			$.post('/publish_object.json',
				   params,
				   function(json)  {
					   if (json.status_code == 1) {
						   alert('published.');
					   } else {
						   if (json.message) {
							   alert(json.message);
						   }
					   }
				   },
				   "json"
				  );
		} else {
			var params = {'object_id' : object_id,
						  'type' : type}
			$.post('/unpublish_object.json',
				   params,
				   function(json)  {
					   if (json.status_code == 1) {
						   alert('unpublished.');
					   } else {
						   if (json.message) {
							   alert(json.message);
						   }
					   }
				   },
				   "json"
				  );
		}
		return false;
	});
	
});
