jQuery(function($){
	$('select[data-component="multioption"]')
		.change(function(){
			var $this = $(this), $second = $this.data('second-select'), $options = $this.data('second-options');

			// hide all options which has parent option.
            if ($options && $options.length) 
                $second.empty().append($options.filter('[data-first="'+this.value+'"]')).prop('selectedIndex', 0).change();
		})
		.each(function(){
			var $this = $(this), selector = $this.attr('data-selector'), $second, delim = $this.attr('data-delimiter') || '|';

			if (!selector) {
				try { console.error('You should set a selector that points the second select box.') }catch(e){};
				return;
			}

			$second = $(selector);
			if (!$second.length) {
				try { console.error('Cannot find the second select box.') }catch(e){};
				return;
			}
			$second.prop('disabled', true);
			$this.data('second-select', $second);

			var options = [], exists = {}, $options = $this.find('>option:contains("'+delim+'")');
			if ($options.length) {
                $seconds = $();
				$options.remove().each(function(){
					var $opt = $(this), texts = $opt.text().split(delim), firstText, secondText, _firstText;

					firstText  = $.trim(texts.shift());
					secondText = $.trim(texts.join(''));
					_firstText = firstText.replace(/"/g, '');
					if (!exists[firstText]) {
						exists[firstText] = true;
						$('<option />').val(_firstText).text(firstText).appendTo($this);
					}

					if (this.value) {
                        console.log($opt.data('price'));
                        $seconds = $seconds.add( 
                            $('<option />').val(this.value).text(secondText).attr('data-first', _firstText)
                            .prop('disabled', $opt.prop('disabled'))
                            .attr('data-price', $opt.data('price')) );
					}
				});
                $this.data('second-options', $seconds);
				$second.prop('disabled', false);
			}

			$this.prop('selectedIndex', 0).change();
		});
});
