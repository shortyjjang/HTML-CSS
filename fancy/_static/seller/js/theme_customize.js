jQuery(function($){
	var $win = $(window),
	    $doc = $(document),
	    $scroll  = $('.scroll.edit-basic'),
	    $form    = $('#customize_bar'),
	    $preview = $('#preview'),
	    settings = window.settings || {};

	$form.find('input,textarea').each(function(){
		var name = this.getAttribute('name');
		if (!name || !(name in settings)) return;

		if (this.type == 'checkbox') {
			if (settings[name]) {
				this.checked = true;
				$('button[name="'+name+'"]').addClass('on');
			}
		} else {
			if (typeof settings[name] == 'object') {
				this.value = JSON.stringify(settings[name]);
			} else {
				this.value = settings[name];
			}
			if( $(this).prev().is(".trick-input") ){
				$(this).prev().html( this.value );
			}
		}
	});

	$form.find('input,textarea').change(function(){
		if( $(this).prev().is(".trick-input") ){
			$(this).prev().html( this.value );
		}
	})

	$form.find('[data-bind]').each(function(){
		var bind = this.getAttribute('data-bind'), name = /^\w+/.exec(bind||'');
		if (!name || !(name in settings)) return;

		var $this = $(this);
		var val = new Function(name,'return '+bind)(settings[name])

		$this.text( val );
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

	// popup
	$('a[data-popup]').click(function(event){
		event.preventDefault();

		var $this = $(this), $popup = $($this.attr('href')), $row;

		// ignore class when animating the overlay
		if ($popup.hasClass('animating_')) return;

		if (!$popup.hasClass('show')) {
			$popup.show();
			setTimeout(function(){ $popup.addClass('show animating_'); open(); }, 0);
		} else {
			$popup.addClass('animating_').removeClass('show');
		}

		$doc.trigger('mousedown.popup').off('.popup');
		$scroll.off('.popup');

		function open() {
			var $row = $this.closest('li').trigger('popup'), offset = $row.offset();

			$popup.css({top:offset.top, bottom:'auto'}).addClass('top').removeClass('bottom');

			if ($popup.offset().top + $popup.height() > $win.height()) {
				$popup.css({top:'auto', bottom:$win.height() - offset.top - $row.height()}).addClass('bottom').removeClass('top');
			}

			$popup.trigger('open');

			$doc.on('mousedown.popup', function(event){
				if ( $(event.target).closest('.select-popup, a[data-popup]').length ) return;
				close();
			});

			$scroll.on('scroll.popup', function(event){
				close();
			});
		};

		function close() {
			$popup.removeClass('show');
			$doc.off('.popup');
			$scroll.off('.popup');
		};
	});

	$('.tooltip').hover(function(event){
		if($(this).find('em').width()>250) {
			$(this).find('em').width(250).css('white-space','normal');
		}
	});

	$('.select-popup[id]').on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(event){
		var $this = $(this);
		$this.removeClass('animating_');

		if (!$this.hasClass('show')) $this.removeClass('show');
	});

	// boolean
	$('.btn-switch').click(function(){
		var $this = $(this).toggleClass('on');
		$('input[type="checkbox"][name="'+this.name+'"]').prop('checked', $this.hasClass('on'));
	});

	// color
	(function(){
		var $popup = $('#popup-color');

		$popup.colpick({
			flat : true,
			layout : 'hex',
			colorScheme : 'dark',
			submit : 0,
			onChange : function(hsb,hex,rgb,el,bySetColor) {
				if (!bySetColor) {
					$popup.data('field').val('#'+hex).closest('li').find('.color-box').css('background', '#'+hex);
				}
			}
		});

		$('.type_color').on('popup', function(){
			var $this = $(this), $field = $this.find('input[name]'), color = $field.val() || 'ffffff';

			color = color.replace(/^#/, '');

			$popup.data('field', $field).colpickSetColor(color);
			$this.find('.color-box').css('background', '#'+color);
		});
	})();

	// number
	(function(){
		var $popup = $('#popup-number');

		$popup.find('.spinner').spinner('changing', function(e, newVal, oldVal){
			$popup.data('field').val( newVal ).closest('li').find('a.selector').text( newVal );
		});

		$('li.type_number').on('popup', function(){
			var $this = $(this), $field = $this.find('input[type="hidden"]');

			$popup
				.data('field', $field)
				.find('.name_').text( $this.find('label.label').text() ).end()
				.find('.desc_').text( $this.find('.desc').text() ).end()
				.find('.number').val( $field.val() ).end();
		});
	})();

	// image
	(function(){
		var $popup = $('#popup-image'), url = '/merchant/themes/admin/upload_asset.json';

		$popup
			.on('click', '.btn-del', function(){
				deleteFile( $popup.data('field').val() );
				$popup.find('.img-editor').removeClass('loaded').attr('style','');
				$popup.data('field').val( '' );
			})
			.find('.add')
				.uploader({
					url : url,
					accept : 'image/*',
					multiple : false
				})
				.on('upload', function(event){
					var $this = $(this), uploader = event.uploader, file = uploader.files[0];

					uploader.addField('type', 'asset');
					uploader.addField('theme_id', themeID);

					$popup.find('.img-editor').removeClass('loaded').addClass('loading');
					$popup.data('field').closest('.type_image').find('.thumb-box').removeClass('done').addClass('loading');
				})
				.on('progress', function(event){
				})
				.on('complete', function(event){
					var $img = $popup.find('.img-editor'), json = event.response;

					asset.add(json.name, json.url);

					$popup.data('field').val( json.name );
					$img.removeClass('loading').addClass('loaded').css('background-image', 'url("'+json.url+'")');
					$popup.data('field').closest('.type_image').find('.thumb-box').removeClass('loading').addClass('done');
				});

		$('.type_image')
			.on('load', function(){
				var $this = $(this), $field = $this.find('input[name]'), name = $.trim($field.val());

				if (!name) return;
				
				asset.url(name).done(function(url){
					var $add = $this.find('.add').removeClass('loading');

					if (url) {
						$add.addClass('loaded').css('background-image', 'url("'+url+'")');
						$add.uploader('disable');
					}
				});
			})
			.on('popup', function(){
				var $this = $(this), $field = $this.find('input[name]'), name = $field.val(), $img = $popup.find('.img-editor');

				$popup.data('field', $field);
				$img.removeClass('loaded loading');

				if (name) {
					asset.url(name).done(function(url){
						$img.addClass('loaded').css('background-image', 'url("'+url+'")');
					});
				} else {
					$img.css('background-image', '');
				}
			})
			.trigger('load')
			.on('click', '.add.loaded', function(event){
				event.preventDefault();
				var $this = $(this).removeClass('loaded').uploader('enable'), $field = $this.closest('.type_image').find('input[name]');
				deleteFile( $field.val() );
				$field.val('');
			})
			.find('.add')
				.uploader({
					url : url,
					accept : 'image/*',
					multiple : false
				})
				.on('upload', function(event){
					var $this = $(this), uploader = event.uploader, file = uploader.files[0];

					uploader.addField('type', 'asset');
					uploader.addField('theme_id', themeID);

					$this.removeClass('loaded').addClass('loading');
				})
				.on('complete', function(event){
					var $this = $(this), $field = $this.closest('li').find('input[name]'), json = event.response;

					asset.add(json.name, json.url);

					$field.val( json.name );

					// preloading uploaded image
					(new Image()).src = json.url;

					$this.closest('.type_image').trigger('load').uploader('disable');
				});

		function deleteFile(name) {
			$.ajax({
				type : 'DELETE',
				url  : '/merchant/themes/admin/delete_asset.json',
				data : {type : 'asset', name : name, theme_id : themeID}
			});
		};
	})();

	// image list
	(function(){
		var $type = $('.type_image-list'), $tpl, url = '/merchant/themes/admin/upload_asset.json';

		$tpl = $type.find('li:first-child').css('display','').remove().eq(0);

		$type
			.each(function(){
				var $this = $(this), $field = $this.find('input[name]'), list = $field.val(), $add = $this.find('.btn-add').parent();

				list = JSON.parse(list || '[]');

				asset.url.apply(asset, list).done(function(){
					var url, name;

					for (var i=0; i < arguments.length; i++) {
						name = list[i]; // asset name
						url  = arguments[i]; // real url of the asset

						if (!url) continue;

						$tpl.clone()
							.attr('data-asset', name)
							.find('img').css('background-image', 'url("'+url+'")').end()
							.insertBefore($add);
					}
				});
			})
			.find('.btn-add')
				.uploader({
					url : url,
					accept : 'image/*',
					multiple : true
				})
				.on('upload', function(event){
					var $this = $(this), uploader = event.uploader, $add = $this.parent();

					uploader.addField('type', 'asset');
					uploader.addField('theme_id', themeID);

					// Add images and show progress bar
					$.each(uploader.files, function(idx, file){
						var $li = $tpl.clone().addClass('loading').insertBefore( $add );

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
					var $li = $(this).closest('.type_image-list').find('li.loading');
				})
				.on('complete', function(event){
					var $this = $(this), $cell = $this.closest('.type_image-list'), $field = $cell.find('input[name]'), json = event.response;


					if (!json || !json.status_code) {
						if (json.message) alert(json.message);
						return;
					}

					var assets = json.assets || [json];
					var list = JSON.parse($field.val() || '[]');

					$cell.find('li.loading')
						.removeClass('loading')
						.each(function(idx){
							var $this = $(this), name, url;

							if (!assets[idx]) return $this.remove();

							name = assets[idx].name;
							url  = assets[idx].url;
							list.push( assets[idx].name );

							$this.attr('data-asset', name).find('img').css('background-image', 'url("'+url+'")');
							asset.add(name, url);
						});

					$field.val( JSON.stringify(list) );
				})
			.end()
			.on('click', '.btn-del', function(event){
				event.preventDefault();

				var $this = $(this), $cell = $this.closest('.type_image-list'), $field = $cell.find('input[name]'), name, list = [];

				name = $(this).closest('li').remove().attr('data-asset');

				if (!name) return;

				$.ajax({
					type : 'DELETE',
					url  : '/merchant/themes/admin/delete_asset.json',
					data : {type : 'asset', name : name, theme_id : themeID}
				});

				$cell.find('li[data-asset]').each(function(){ list.push( this.getAttribute('data-asset') ) });

				$field.val( JSON.stringify(list) );
			});
	})();

	// thing list
	(function(){ 
		var $popup = $('#popup-thing-list'), $tpl, $resultTpl, xhr = null, lastKeyword = '', curPage, nextPage, isFetching;

		$tpl = $('.type_thing-list li:first-child').remove().eq(0).css('display','');
		$resultTpl = $popup.find('li:first-child').remove();

		$popup
			.on('keyup', 'input[name="q"]', function(event){
				if (event.which === 13) event.preventDefault();

				var keyword = $.trim(this.value);

				if (xhr) xhr.abort();

				$popup.find('ul').empty();
				$popup.addClass('loading');
				$popup
					.find('.product-list').hide().end()
					.find('.no-result').hide().end();

				if(keyword){
					$popup.find(".btn-remove").show();
				}else{
					$popup.find(".btn-remove").hide();
				}

				//if (!keyword) return;
				lastKeyword = keyword;
				curPage = 1;
				isFetching = true;

				xhr = $.getJSON('/rest-api/v1/things/by_seller/'+storeID, {q:keyword, active:true})
					.done(function(json){
						if (!json || !json.things) return;
						
						var things = json.things, selected = {};
						xhr.hasNextPage = json.next_page_num  > 1;

						$popup.removeClass('loading');
						$popup.data('field')
							.closest('.type_thing-list')
							.find('li[data-id]')
							.each(function(){ selected[ $(this).attr('data-id') ] = 1 });

						if( json.next_page_num > curPage) nextPage = json.next_page_num;

						drawThings(things, selected);
						isFetching = false;
					});
			})
			.on('click', 'li', function(event){
				var $this = $(this), $field = $popup.data('field'), $list, $add;

				$list = $field.closest('.type_thing-list').find('ul');
				$add = $list.find('a.btn-add').parent();

				$this.toggleClass('selected');

				if ($this.hasClass('selected')) {
					$tpl.clone()
						.attr('data-id', $this.attr('data-id'))
						.find('img').css('background-image', 'url("'+$this.attr('data-image')+'")').end()
						.insertBefore($add);
				} else {
					$list.find('li[data-id="'+$this.attr('data-id')+'"]').remove();
				}

				$field.closest('.type_thing-list').trigger('update');
			})
			.on('click', '.btn-remove', function(event){
				event.preventDefault();

				if( !$popup.find('input[name="q"]').val() ) return;

				$popup.find('input[name="q"]').val('').trigger("keyup");
				//drawThings([]);
			});

		$popup.find(".product-list > ul").scroll( function(event){
			if(!nextPage || nextPage <= curPage || isFetching) return;
			if(!xhr.hasNextPage) return;
			if( $popup.find(".product-list > ul").scrollTop()+$popup.find(".product-list > ul").height() < ($popup.find(".product-list > ul > li:last").position().top - 50) ) return;

			var keyword = $.trim(this.value);
			isFetching = true;

			var $list = $popup.find('.product-list > ul');
			$("<li class='loading'></li>").appendTo($list).show();


			xhr = $.getJSON('/rest-api/v1/things/by_seller/'+storeID, {q:keyword, active:true, page:nextPage})
				.done(function(json){
					if (!json || !json.things) return;
					
					var things = json.things, selected = {};
					curPage = nextPage;
					xhr.hasNextPage = json.next_page_num > curPage;

					if( json.next_page_num > curPage) nextPage = json.next_page_num;

					$popup.data('field')
						.closest('.type_thing-list')
						.find('li[data-id]')
						.each(function(){ selected[ $(this).attr('data-id') ] = 1 });

					$list.find("> li.loading").remove();
					drawThingsMore(things, selected);

					isFetching = false;
				});

		});

		$('.type_thing-list')
			.each(function(){
				var $this = $(this), $field = $this.find('input[name]'), list = JSON.parse($field.val());

				if (!list.length) return;
				if (list.length < 2) list.push(0);

				$.getJSON('/rest-api/v1/things/'+list.join(',')).done(function(json){
					if (!json || !json.things || !json.things.length) return;

					var thing, $add = $field.closest('.type_thing-list').find('.btn-add').parent();

					for (var i=0; i < json.things.length; i++) {
						thing = json.things[i];
						thing.image.src = thing.image.src.replace(/^https?:/, '');

						$tpl.clone()
							.attr('data-id', thing.id)
							.find('em').text(thing.sales.title).end()
							.find('img').css('background-image', 'url('+thing.image.src+')').end()
							.insertBefore($add);
					}
				});
			})
			.on('popup', 'li:has(.btn-add)', function(){
				var $cell = $(this).closest('.type_thing-list');

				$popup.data('field', $cell.find('input[name]'))
					.find('dt').text( $cell.find('.label b').text() ).end()
					.find('.btn-remove').click().end()
					.find('input[name=q]').keyup();
			})
			.on('update', function(){
				var $this = $(this), $field = $this.find('input[name]'), list = [];

				$this.find('li[data-id]').each(function(){
					list.push( $(this).attr('data-id') );
				});

				$field.val( JSON.stringify(list) );
			})
			.on('click', '.btn-del', function(event){
				event.preventDefault();

				var $type = $(this).closest('li').closest('.type_thing-list');
				$type.end().remove();
				$type.trigger('update');
			});

		function drawThings(things, selected) {
			if (things.length) {
				var $list = $popup.find('.product-list > ul').empty();

				if (!selected) selected = {};

				$popup
					.find('.product-list').show().end()
					.find('.no-result').hide().end();

				$.each(things, function(idx, thing) {
					var $res = $resultTpl.clone()
						.removeAttr('style')
						.attr('data-id', thing.id)
						.attr('data-image', thing.image.src)
						.find('img').css('background-image', 'url("'+thing.image.src+'")').end()
						.appendTo($list);

					if (thing.id in selected) $res.addClass('selected');
				});
			 } else {
				$popup
					.find('.product-list').hide().end()
					.find('.no-result').show().end();
			 }
		};
		function drawThingsMore(things, selected) {
			if (things.length) {
				var $list = $popup.find('.product-list > ul');

				if (!selected) selected = {};

				$.each(things, function(idx, thing) {
					var $res = $resultTpl.clone()
						.removeAttr('style')
						.attr('data-id', thing.id)
						.attr('data-image', thing.image.src)
						.find('img').css('background-image', 'url("'+thing.image.src+'")').end()
						.appendTo($list);

					if (thing.id in selected) $res.addClass('selected');
				});
			 } 
		};
	})();

	// category
	(function(){
		var $popup = $('#popup-category');

		$popup.on('click', 'input[type="checkbox"]', function(){
			var list = [{key:"", name:"Everything"}];

			$popup.find('input:checked').each(function(){
				var $this = $(this);
				list.push({key:this.value, name:$.trim($this.next('label').text())});
			});
			$popup.data('field').val( JSON.stringify(list) ).closest('li').find('.selector').text( list.length - 1 );
		});

		$('.type_category')
			.each(function(){
				var $this = $(this), $field = $this.find('input[type="hidden"]'), list = JSON.parse($field.val()||'[]');
				$this.find('.selector').text( Math.max(list.length - 1, 0) );
			})
			.on('popup', function(){
				var $field = $(this).find('input[type="hidden"]'), list = JSON.parse($field.val()||'[]');

				$popup.data('field', $field).find('input[type="checkbox"]').prop('checked', false);

				if (list.length) {
					list = list.map(function(v){ return 'input[value="'+v.key+'"]'});
					$popup.find(list.join(',')).prop('checked', true);
				}
			})
			.on('mousedown', function(event){
				if (!$(event.taregt).is('a[data-popup]')) return false;
			})
			.on('click', function(event){
				if (!$(event.target).is('a[data-popup]')) {
					$(this).find('a[data-popup]').trigger('click');
					return false;
				}
			});
	})();

	// collection
	(function(){
		var $popup = $('#popup-collection'), $tpl = $popup.find('li:first-child').remove(), collections = [], xhr;

		if ($popup.find('input[type="checkbox"]').length) {
			$popup.find('.add-collection').hide();
		} else {
			$popup.find('ul.after').hide();
		}

		if (!collections.length) {
			$popup.find('input[type="checkbox"]').each(function(){
				var name = $.trim($(this).next('label').text());
				collections.push( {id:this.value, name:name} );
			});
		}

		$popup
			.on('draw', function(){
				var $field = $popup.data('field'), $ul = $popup.find('ul').empty(), list = JSON.parse($field.val()||'[]');

				$.each(collections, function(idx, col) {
					$tpl.clone()
						.find('input').val(col.id).attr('id', 'coll-'+idx).end()
						.find('label').text(' '+col.name).attr('for', 'coll-'+idx).end()
						.appendTo($ul);
				});

				if (collections.length) {
					$popup.find('ul').show().end().find('.add-collection').hide();
				} else {
					$popup.find('ul').hide().end().find('.add-collection').show();
				}

				if (list.length) {
					list = list.map(function(v){ return 'input[value="'+v+'"]'});
					$popup.find(list.join(',')).prop('checked', true);
				}
			})
			.on('click', 'input[type="checkbox"]', function(){
				var list = [];

				$popup.find('input:checked').each(function(){ list.push(this.value) });
				$popup.data('field').val( JSON.stringify(list) ).closest('li').find('.selector').text( list.length );
			});

		$('.type_collection')
			.each(function(){
				var $this = $(this), $field = $this.find('input[type="hidden"]'), list = JSON.parse($field.val()||'[]');
				$this.find('.selector').text( list.length );
			})
			.on('popup', function(){
				var $field = $(this).find('input[type="hidden"]'), list = JSON.parse($field.val()||'[]');

				$popup.data('field', $field).trigger('draw');

				// load collections
				if (xhr) return;
				xhr = $.getJSON(
					'/rest-api/v1/seller/'+window.storeID+'/collections',
					function(json){
						if (!json || !json.collections) return;
						collections = json.collections;
						$popup.trigger('draw');
					}
				);
				xhr.always(function(){ xhr = null });
			})
			.on('mousedown', function(event){
				if (!$(event.taregt).is('a[data-popup]')) return false;
			})
			.on('click', function(event){
				if($(event.target).is('span.comment a')){
					return true;
				}else if (!$(event.target).is('a[data-popup]')) {
					$(this).find('a[data-popup]').trigger('click');
					return false;
				}
			});
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
			headers  : {'X-CSRFToken': Cookie.get('csrftoken')},
			dataType : 'json',
			success  : function(json){
				if (!json) return;
				if (!json.status_code) {
					if (json.message) alert(json.message);
					return;
				}

				$alert.fadeIn(300);
				$alert.data('timer', setTimeout(function(){ $alert.click(); }, 3000));

				// reload
				$preview.find('>iframe')[0].contentWindow.postMessage('reload', '*');
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

	// back to themes
	$('.btn-exit').click(function(event){
		var from = $(event.target).attr('from');
		location.href = from||'/merchant/storefront';
	});

	// hide empty option container
	$('.controller > ul').not(':has(>li)').closest('.content_').hide();

	$('#customize_bar .controller.image-list .label')	
	  .on('click', function(event){
	     $(this).closest('.image-list').find('ul.after').slideToggle('fast');
	});
});

// Setting CSRF Token
jQuery.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
	if (options.type == 'POST' || options.type == 'PUT' || options.type == 'DELETE') {
		if (!options.headers) options.headers = {};
		options.headers['X-CSRFToken'] = Cookie.get('csrftoken');
	}
});
