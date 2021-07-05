/**
 * Draw controls to input numbers
 */
(function($){
	function draw(idx){
		var $this = $(this),
			min   = $this.attr('min'),
			max   = $this.attr('max'),
			step  = Math.abs($this.attr('step') || 1),
			btn_h, $span, $up, $down;

		if ($this.parent('span').hasClass('input-number')) return true;

		$span = $this.wrap('<span>').parent().addClass('input-number').css({display:'inline-block',position:'relative'});
		btn_h = ($this.height()/2)>>0;
		$this.keydown(function(event){
			if(event.keyCode == 38) {
				$up.mousedown();
				return false;
			} else if (event.keyCode == 40) {
				$down.mousedown();
				return false;
			}
		});
		$up = $('<a href="#btn">')
			.attr('class', 'btn-up')
			.css({position:'absolute',top:$this.css('margin-top'),right:0,height:btn_h+'px',height:btn_h+'px',padding:'0 7px'}).css('line-height',btn_h+'px')
			.click(function(){ return false })
			.mousedown(function(){
				var v = (parseInt($this.val()) || 0) + step;
				if (max !== null && max < v) v = max;
				$this.val(v);
				$this.trigger('change');
				return false;
			})
			.append('<span>')
			.appendTo($span);
		$down = $up.clone().off('mousedown').css('top', (parseInt($this.css('margin-top'))||0)+btn_h+1+'px')
			.attr('class', 'btn-down')
			.click(function(){ return false })
			.mousedown(function(){
				var v = (parseInt($this.val()) || 0) - step;
				if (min !== null && min > v) v = min;
				$this.val(v);
				$this.trigger('change');
				return false;
			})
			.appendTo($span);
	};

	$.fn.inputNumber = function(){
		return this.each(draw);
	};
})(jQuery);
