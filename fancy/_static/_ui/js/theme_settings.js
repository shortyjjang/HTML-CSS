jQuery(function($){
	var $form = $('.data-frm'), settings = window.settings || {};

	$form.find('input,textarea').each(function(){
		var name = this.getAttribute('name');
		if (!name || !(name in settings)) return;

		if (this.type == 'checkbox') {
			if (settings[name]) this.checked = true;
		} else {
			if (typeof settings[name] == 'object') {
				this.value = JSON.stringify(settings[name]);
			} else {
				this.value = settings[name];
			}
		}
	});

	var asset = {
		xhr : null,
		map : null,
		url : function() {
			var self = this, dfd = new $.Deferred(), assets = arguments;

			if (this.map) {
				_.defer(resolve);
			} else {
				this.xhr.done(resolve).fail(function(){ dfd.reject() });
			}

			function resolve(){
				var results = [];
				for (var i=0; i < assets.length; i++) {
					results.push( self.map[assets[i]] || null );
				}
				dfd.resolve.apply(dfd, results);
			}

			return dfd.promise();
		},
		add : function(asset, url) {
			var self = this;
			if (this.map) {
				this.map[asset] = url;
			} else {
				this.xhr.done(function(){ self.map[asset] = url });
			}
		},
		get : function(){
			this.xhr = $.getJSON('/merchant/themes/admin/all_assets.json?theme_id=' + themeID)
				.done(function(json){
					asset.map = {};
					if (json && json.assets && json.assets.asset) {
						$.each(json.assets.asset, function(idx, file) {
							asset.map[file.name] = file.url;
						});
					}
				});
		}
	};
	asset.get();

	// color
	$('input.color')
		.colpick({
			layout : 'hex',
			submit : 0,
			onChange : function(hsb,hex,rgb,el,bySetColor) {
				var $el = $(el).css('border-color', '#'+hex);
				$el.next('em').css('background-color', '#'+hex);
				if (!bySetColor) $el.val('#'+hex);
			}
		})
		.keyup(function(){
			$(this).colpickSetColor(this.value.replace(/^#/,''));
		})
		.next('em').click(function(){ $(this).prev().focus() });

	// number
	$('.spinner').spinner();

	// image and image list
	(function(){
		var $cells = $('.type_image, .type_image-list'), $tpl, url = '/merchant/themes/admin/upload_asset.json';
		
		$tpl = $cells.find('.template_').remove().eq(0).removeClass('template_');

		$('.type_image')
			.on('apply', function(){
				var $this = $(this), name;

				name = $this.find('li.item').attr('data-asset') || '';

				$this.find('input.image').val( name );
			})
			.on('load', function(){
				var $this = $(this), $add, name;

				$add = $this.find('li.add');
				name = $this.find('input.image').val();

				if (name) {
					$this.find('li.add').hide();
				} else {
					$this.find('li.add').show();
				}

				asset.url(name).done(function(url){
					if (!url) {
						$this.find('li.add').show();
						return;
					}
					$tpl.clone()
						.attr('data-asset', name)
						.find('.btn-delete').remove().end()
						.find('img').css('background-image', 'url("'+encodeURI(url)+'")').end()
						.insertBefore($add);
				});
			})
			.find('li.add,.btn-add').uploader({accept:'image/*', url:url, multiple:false}).end();

		$('.type_image-list')
			.on('apply', function(){
				var $this = $(this), list = [];

				$this.find('li.item[data-asset]').each(function(){
					list.push( $(this).attr('data-asset') );
				});

				$this.find('input.image-list').val( JSON.stringify(list) );
			})
			.on('load', function(){
				var $cell = $(this), $field, $add, list;

				$field = $cell.find('input.image-list');
				$add   = $cell.find('li.add');
				list   = JSON.parse($field.val()||'[]')

				asset.url.apply(asset, list).done(function(){
					var url, name;
					for (var i=0; i < arguments.length; i++) {
						name = list[i]; // asset name
						url  = arguments[i]; // real url of the asset
						if (!url) continue;
						$tpl.clone()
							.attr('data-asset', name)
							.find('img').css('background-image', 'url("'+encodeURI(url)+'")').end()
							.insertBefore($add);
					}
				});
			})
			.find('li.add').uploader({accept:'image/*', url:url, multiple:true}).end();

		$cells
			.find('li.add, .btn-add')
				.on('upload', function(event){
					var self = this, uploader = event.uploader, $cell = $(this).closest('.cell'), $add = $cell.find('li.add');

					uploader.addField('type', 'asset');
					uploader.addField('theme_id', themeID);

					if ($cell.hasClass('type_image')) $add.hide();

					$.each(uploader.files, function(idx, file) {
						var $li = $tpl.clone().addClass('uploading').insertBefore( $add );

						if ($cell.hasClass('type_image')) {
							$li.find('.btn-delete').remove().end().prevAll('li').remove();
						}

						if (window.FileReader) {
							var reader = new FileReader();
							reader.onload = function(){
								$li.find('img').css('background-image', 'url('+reader.result+')');
							};
							reader.readAsDataURL( file );
						}
					});
				})
				.on('progress', function(event){
					$(this).closest('.cell').find('li.uploading').find('.guage > b').width( event.percent + '%' );
				})
				.on('complete', function(event){
					var $cell = $(this).closest('.cell'), $li = $cell.find('li.uploading'), json = event.response;

					$li.removeClass('uploading');

					if (!_.isArray(json)) json = [json];

					$.each(json, function(idx, item){
						if (item.status_code != 1) return;
						$li.eq(idx).attr('data-asset', item.name).find('img').css('background-image', 'url('+item.url+')');
					});

					$cell.trigger('apply');
				})
			.end()
			.on('click', '.btn-delete', function(){
				var $li = $(this).closest('li'), $dd;

				$dd = $li.closest('.cell');
				$li.remove();
				$dd.trigger('apply');

				if ($dd.hasClass('type_image')) $dd.find('li.add').css('display','');

				$.ajax({
					type : 'DELETE',
					url  : '/merchant/themes/admin/delete_asset.json',
					data : {type : 'asset', name : $li.attr('data-asset'), theme_id : themeID}
				});
			})
			.trigger('load');
	})();

	// thing list
	(function(){ 
		var $dialog = $('#thing-list'), $selTpl, $tpl = $dialog.find('li').remove(), xhr = null, lastKeyword = '';

		$selTpl = $('.type_thing-list li.template_').remove().eq(0).removeClass('template_');

		$('.type_thing-list')
			.on('click', 'li.add > a', function(event){
				event.preventDefault();
				$dialog.data( 'field', $(this).closest('.cell').find('input.thing-list') );
			})
			.on('change', 'input.thing-list', function(event){
				var list = JSON.parse(this.value || '[]'), $cell = $(this).closest('.cell'), $add;

				// clear
				$add = $cell.find('li.add').prevAll().remove().end();

				if (!list.length) return;
				if (list.length < 2) list.push(0);

				$.getJSON('/rest-api/v1/things/'+list.join(',')).done(function(json){
					if (!json || !json.things || !json.things.length) return;

					var thing;
					for (var i=0; i < json.things.length; i++) {
						thing = json.things[i];
						thing.image.src = thing.image.src.replace(/^https?:/, '');

						$selTpl.clone()
							.attr('data-id', thing.id)
							.find('em').text(thing.sales.title).end()
							.find('img').css('background-image', 'url('+thing.image.src+')').end()
							.insertBefore($add);
					}
				});
			})
			.on('click', '.btn-delete', function(event){
				var $li = $(this).closest('li'), $cell = $li.closest('.cell'), $input = $cell.find('input.thing-list'), list;

				list = JSON.parse($input.val() || '[]');
				list = _.without(list, $li.remove().attr('data-id'));

				$input.val(JSON.stringify(list));
			})
			.find('input.thing-list').trigger('change').end();

		$dialog
			.on('open', function(){
				$dialog.find('input.text').val('').end().find('.list').empty();

				$dialog.find('div.after').off('scroll.infiniteshow').on('scroll.infiniteshow', onScroll);
				$dialog.find('ul').empty();
				lastKeyword = '';
				if (xhr) xhr.abort();
				xhr = $.getJSON('/rest-api/v1/things/by_seller/'+storeID, {active : true}).done(drawThings);
			})
			.on('keyup', 'input.text', function(event){
				var keyword = $.trim(this.value);

				if (xhr) xhr.abort();
				$dialog.find('ul').empty();

				//if (!keyword) return;
				lastKeyword = keyword;

				xhr = $.getJSON('/rest-api/v1/things/by_seller/'+storeID, {q:keyword, active:true}).done(drawThings);
			})
			.on('click', 'li', function(event){
				var $this = $(this).toggleClass('selected');
			})
			.on('click', '.btns-blue-embo', function(event){
				var $field = $dialog.data('field'), things;

				if (!$field) return;

				things = JSON.parse($field.val() || '[]');
				$dialog.find('li.selected').each(function(){
					things.push( $(this).attr('data-id') );
				});
				things = $.unique(things);

				$dialog.data('field').val(JSON.stringify(things)).trigger('change');
			});

		var $self = $dialog.find("div.after"), calling = false;
		function drawThings(json) {
			calling = false;
			$dialog.find("#loading-indicator").hide();
			var $list = $dialog.find('ul'), $thing, thing;
			if (!json || !json.things || !json.things.length) return;

			for (var i=0; i < json.things.length; i++) {
				thing  = json.things[i];
				thing.image.src = thing.image.src.replace(/^https?:/, '');

				$thing = $tpl.clone();
				$thing
					.attr('data-id', thing.id)
					.css('background-image', 'url('+thing.image.src+')')
					.find('em').text(thing.sales.title).end()
					.appendTo($list);
			}
			$dialog.find("div.after").removeAttr('data-nextpage');
			if(json.next_page_num) $dialog.find("div.after").attr('data-nextpage', json.next_page_num);
			onScroll();
		}

		function onScroll() {			
			var nextpage = $self.attr('data-nextpage');
			if (calling || !nextpage) return;

			calling = true;

			var rest = $self.find("ul").height() - $self.scrollTop();
			if (rest > 2000){
				calling = false;
				return;
			}

			var $loader = $dialog.find("#loading-indicator").show();

			if (xhr) xhr.abort();
			xhr = $.getJSON('/rest-api/v1/things/by_seller/'+storeID, {active: true, q:lastKeyword, page: nextpage }).done(drawThings);
		}

	})();

	// category and collection
	(function(){
		$('.selectable')
			.on('click', 'input[type="checkbox"]', function(event){
				var $item = $(this).closest('.item'), $pane = $item.closest('td'), idx = $pane.attr('data-index');

				if (this.checked) {
					$('.enabled-'+idx).append($item);
				} else {
					$('.disabled-'+idx).append($item);
				}

				$pane.closest('.selectable').trigger('apply');
			})
			.each(function(){
				var $table = $(this), $enabled, $disabled, $field, list, isCategory;

				$enabled = $table.find('.enabled');
				$disabled = $table.find('.disabled');
				$field = $table.closest('.cell').find('input[type="hidden"]');
				isCategory = $field.hasClass('category');
				list = JSON.parse($field.val()||'[]');

				$.each(list, function(idx, value) {
					var $check;
					if (isCategory) {
						$table.find('input[type="checkbox"][value="'+value.key+'"]').prop('checked', true).parent().appendTo($enabled);
					} else {
						$table.find('input[type="checkbox"][value="'+value+'"]').prop('checked', true).parent().appendTo($enabled);
					}
				});

				$table.on('apply', function(){
					var list = [];
					$enabled.find('input:checked').each(function(){
						if (isCategory) {
							if (!list.length) list.push( {key:'', name:'Everything'} );
							list.push( {key:this.value, name:$(this).next().text()} );
						} else {
							list.push(this.value);
						}
					});

					if ($disabled.find('input[type="checkbox"]').length) {
						$disabled.find('p.empty').hide();
					} else {
						$disabled.find('p.empty').show();
					}

					if ($enabled.find('input[type="checkbox"]').length) {
						$enabled.find('p.empty').hide();
					} else {
						$enabled.find('p.empty').show();
					}

					$field.val( JSON.stringify(list) );
				});
			})
			.find('.enabled,.disabled')
				.sortable({revert:true, items:'div.item'})
				.on('sortupdate', function(event,ui){
					ui.item.find('input[type="checkbox"]').prop('checked', ui.item.closest('td').hasClass('enabled'));
					$(this).closest('.selectable').trigger('apply');
				})
				.on('sortstart', function(event,ui){
					var $win = $(window), $pane = $(this);
					$win.scrollTop( $win.scrollTop() + $pane.scrollTop() );
					$(this).closest('table').addClass('dragging');
				})
				.on('sortstop', function(event,ui){
					$(this).closest('table').removeClass('dragging');
				})
				.each(function(){
					var $this = $(this), idx = $this.attr('data-index'), isEnabledPane =$this.parent().hasClass('enabled');
					$this.sortable('option', 'connectWith', isEnabledPane ? '.disabled'+idx : '.enabled-'+idx);
				})
			.end()
			.trigger('apply');
	})();

	// save settings
	$('.btn-save').click(function(){
		var $this = $(this).prop('disabled', true), json;

		settings = {};
		$form.find('input,textarea').each(function(){
			var $field, name = this.getAttribute('name'), val = $.trim(this.value);
			if (!name || !val.length) return;

			$field = $(this);
			if ($field.is('.collection, .category, .thing-list, .image-list')) {
				val = JSON.parse(val);
			} else if (this.type == 'checkbox') {
				val = this.checked ? 'true' : '';
				if (!val) return;
			}
			settings[name] = val;
		});

		json = JSON.stringify(settings);

		$.ajax({
			type : 'POST',
			url  : '/merchant/themes/admin/save_theme_settings.json',
			data : {json:json, theme_id : themeID},
			dataType : 'json',
			success  : function(json){
				if (!json) return;
				if (!json.status_code) {
					if (json.message) alert(json.message);
					return;
				}

				$alert.fadeIn(300);
				$alert.data('timer', setTimeout(function(){ $alert.click(); }, 3000));
			},
			complete : function(){
				$this.prop('disabled', false);
			}
		});
	});
	var $alert = $('.alert-saved').on('click', function(){
		var timer = $alert.data('timer');
		clearTimeout(timer);

		$alert.stop().fadeOut(300);
	});

});
