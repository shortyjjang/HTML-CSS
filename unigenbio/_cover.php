
	<div class="cover">
		<h1 class="inner"></h1>
	</div>
	<script>
	jQuery(function($){
		var background;
		if($('#content').hasClass('news')){
			background = "./_static/images/cover-explore.png";
			$('.cover h1').text('UNIGEN NEWS');
		}else if ($('#content').hasClass('notice')) {
			background = "./_static/images/cover-explore.png";
			$('.cover h1').text('UNIGEN NOTICE');
		}else if ($('#content').hasClass('mall')) {
			background = "./_static/images/cover-mall.png";
			$('.cover h1').text('UNIGENMALL');
		}
		$('.cover').css('background-image',"url('"+background+"')");
	});
	</script>