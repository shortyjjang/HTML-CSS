(function(){
	$('.figure-list li').css('position','absolute');
	$('.figure-list li:nth-child(3n+1)').css('left','0');
	$('.figure-list li:nth-child(3n+2)').css('left','290px');
	$('.figure-list li:nth-child(3n').css('left','580px');
	$('.figure-list li').each(function(){
		$(this).height($(this).find('img').height()).css('line-height',$(this).find('img').height()+'px');
	});
	$('.figure-list li:nth-child(3n+4)').css('top',$('.figure-list li:nth-child(3n+1)').height()+20+'px');
	$('.figure-list li:nth-child(3n+5)').css('top',$('.figure-list li:nth-child(3n+2)').height()+20+'px');
	$('.figure-list li:nth-child(3n+6)').css('top',$('.figure-list li:nth-child(3n+3)').height()+20+'px');
	$('.figure-list li:nth-child(3n+7)').css('top',$('.figure-list li:nth-child(3n+4)').height()+20+'px');
	$('.figure-list li:nth-child(3n+8)').css('top',$('.figure-list li:nth-child(3n+5)').height()+20+'px');
	$('.figure-list .stream').height(670);
})();
