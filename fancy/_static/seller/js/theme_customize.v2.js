require(['jquery', 'underscore', 'backbone', 'util/cookie', 'util/csrf', 'underscore-string', 'component/uploader', 'mousetrap'], function($, _, Backbone, Cookie){
	var $win = $(window), $preview = $('#preview'), JST = [], Views = {}, Popups = {};

	Mousetrap.bind(['command+s','control+s'], function(e) { 
	 	e.preventDefault();
	 	$(".btn-save").trigger("click");
	 });

	// support transition
	var supportTransition = (function(){
		var support, s = document.createElement('p').style, p = 'transition', v = 'Moz,webkit,Webkit,Khtml,O,ms'.split(',');

		support = (p in s);
		p = 'Transition';
		while(!support && v.length){ support = (v.pop()+p) in s }

		return support;
	})();
	var eventTransitionEnd = 'transitionend webkitTransitionEnd WebkitTransitionEnd MozTransitionEnd OTransitionEnd MSTransitionEnd';

	var asset = {
		map : {},
		callbacks : [],
		loaded : false,
		get : function(name, callback) {
			var self = this;
			if (this.loaded) {
				if(this.map[name]) callback(this.map[name]);
			} else {
				this.callbacks.push(function(){ if(self.map[name]) callback(self.map[name]) });
			}
		},
		add : function(data) {
			this.map[data.name] = data;
		},
		update : function(){
			var self = this;

			self.loaded = false;
			self.map = {};

			// get all asset list
			$.getJSON(expand_url_params('/merchant/themes/admin/all_assets.json?theme_id='+themeID), function(json){
				if (!json.assets || !json.assets.asset) return;

				// map the assets
				_.each(json.assets.asset, function(asset){ self.map[asset.name] = asset; });

				_.each(self.callbacks, function(callback){ callback(); });
				self.listeners = []; 
				self.loaded = true;
			});
		}
	};

	var PopupView = Backbone.View.extend({
		$document : null,
		$scroll   : null,
		defaults  : {},
		options   : {},
		currentView : null,
		initialize : function(options) {
			_.bindAll(this, 'closeOnEvent', 'onTransitionEnd');

			this.options = _.extend({}, this.defaults, options);

			this.$document = $(document);
	    	this.$scroll = $('.scroll.edit-basic');

			if (supportTransition) {
				this.$el.on(eventTransitionEnd, this.onTransitionEnd);
			}
		},
		toggle : function(view) {
			if (this.$el.hasClass('animating_')) return;
			this.$el.hasClass('show') ? this.close(view) : this.open(view);
			return this;
		},
		open : function(view) {
			var $el = this.$el.show(), $row = view.$el.find('[data-popup]').closest('li'), offset = $row.offset();

			this.currentView = view;

			$el.css({top:offset.top, bottom:'auto'}).addClass('top').removeClass('bottom');
			if ($el.offset().top + $el.height() > $win.height()) {
				$el.css({top:'auto', bottom:$win.height() - offset.top - $row.height()}).addClass('bottom').removeClass('top');
			}

			setTimeout(function(){ $el.addClass('show animating_'); }, 0);

			this.$document.on('mousedown.popup', this.closeOnEvent);
			this.$scroll.on('scroll.popup', this.closeOnEvent);

			this.$el.trigger('open', view);

			if (!supportTransition) this.onTransitionEnd();
		},
		close : function(view) {
			this.$document.off('.popup');
			this.$scroll.off('.popup');
			this.$el.addClass('animating_').removeClass('show');

			this.$el.trigger('close', view);
			this.currentView = null;
		},
		closeOnEvent : function(event){
			if (event.type == 'scroll') return this.close();

			var $target = $(event.target).closest('.select-popup, [data-popup]');
			
			if ($target.is('.select-popup')) return;
			if ($target[0] !== this.$el.find('[data-popup]')) this.close();
		},
		onTransitionEnd : function(event){
			this.$el.removeClass('animating_');
		}
	});

	// get templates
	$('script[type="template"][data-option-type]').each(function(){
		JST[this.getAttribute('data-option-type')] = _.template(this.innerHTML);
	});

	// container view
	Views.ContainerView = Backbone.View.extend({
		template : JST['container'],
		subviews : [],
		option   : null,
		initialize : function(opt) {
			this.subviews = [];
			this.option = opt || {};
			if (!this.option.title) this.option.title = '';
		},
		addSubview : function(view) {
			this.subviews.push(view);
			return this;
		},
		render : function() {
			this.setElement( $(this.template(this.option)) );

			for (var i=0, c=this.subviews.length, $el; i < c; i++) {
				$el = this.subviews[i].$el;
				if ($el.is('.controller')) {
					this.$el.find('.controller').replaceWith($el);
				} else if ($el.is('li')) {
					this.$el.find('.controller ul').append($el);
				}
			}

			return this;
		},
		serialize : function() {
			var json = {};

			_.each(this.subviews, function(view){
				_.extend(json, view.serialize());
			});

			return json;
		}
	});

	Views.Base = Backbone.View.extend({
		options  : {},
		defaults : {},
		events : {
			'click [data-popup]': 'togglePopup'
		},
		popup : null,
		initialize : function(options) {
			this.options = _.extend({}, this.defaults, options);
		},
		render : function() {
			this.setElement( $(this.template(this.options)) );
			return this;
		},
		togglePopup : function(event){
			event.preventDefault();

			if (_.isString(this.popup)) {
				this.popup = Popups[this.popup];
			}

			if (this.popup && _.isFunction(this.popup.toggle)) {
				this.popup.toggle(this);
			}

			return this;
		},
		setValue : function(value) {
			this.$el.find('input[name]').val(value);
			return this;
		},
		getValue : function() {
			return this.$el.find('input[name]').val();
		},
		serialize : function() {
			var json = {};
			json[this.options.key] = this.getValue();
			return json;
		}
	});

	// boolean view
	Views.BooleanView = Views.Base.extend({
		template : JST['boolean'],
		events : {
			'click .btn-switch' : 'toggle',
			'onClick input[type="checkbox"]' : 'onToggle'
		},
		getValue : function() {
			return this.$el.find('input[name]').prop('checked');
		},
		setValue : function(value) {
			this.$el.find('input[name]').prop('checked', !!value);
			return this;
		},
		serialize : function() {
			var json = {};
			json[this.options.key] = this.getValue() ? 'true' : '';
			return json;
		},
		toggle : function() {
			var $checkbox = this.$el.find('input[type="checkbox"]');
			$checkbox.prop( 'checked', !$checkbox.prop('checked') );
			this.onToggle();
		},
		onToggle : function() {
			var $btn = this.$el.find('button.btn-switch'), $checkbox = this.$el.find('input[type="checkbox"]');
			$checkbox.prop('checked') ? $btn.addClass('on') : $btn.removeClass('on');
		}
	});

	// number view
	Views.NumberView = Views.Base.extend({
		template : JST['number'],
		defaults : {value:0},
		popup : 'number',
		getValue : function() {
			var v = this.$el.find('input[name]').val();
			return parseInt(v, 10) || 0;
		},
		setValue : function(value) {
			Views.Base.prototype.setValue.call(this, value);
			this.$el.find('.selector').text(value);
			return this;
		}
	});

	// text view
	Views.TextView = Views.Base.extend({
		template : JST['text'],
		defaults : {placeholder:''},
		render : function() {
			Views.Base.prototype.render.call(this);

			this.$el
				.find('label').attr('for', 'opt-'+this.cid).end()
				.find('input[type="text"]').attr('id', 'opt-'+this.cid);

			return this;
		}
	});

	// textarea view
	Views.TextareaView = Views.Base.extend({
		template : JST['textarea'],
		defaults : {placeholder:''},
		getValue : function() {
			return this.$el.find('textarea[name]').val();
		},
		setValue : function(text) {
			this.$el.find('textarea[name]').val(text);
			return this;
		},
		render : function() {
			Views.Base.prototype.render.call(this);

			this.$el
				.find('label').attr('for', 'opt-'+this.cid).end()
				.find('input[type="text"]').attr('id', 'opt-'+this.cid);

			return this;
		}
	});

	// logo view
	Views.LogoView = Views.Base.extend({
		template : JST['logo'],
		events : {
			'click .add.loaded' : 'remove'
		},
		setUploader : function() {
			var self = this, $el = this.$el;

			$el.find('.add')
				.uploader({
                    url : expand_url_params('/merchant/themes/admin/upload_asset.json'),
					accept : 'image/*',
					multiple : false
				})
				.on('upload', function(event){
					var uploader = event.uploader, file = uploader.files[0];

					uploader.addField('type', 'asset');
					uploader.addField('theme_id', themeID);
					self.setState('loading');
				})
				.on('complete', function(event){
					var json = event.response;
					asset.add(json);
					self.setValue(json.name);
					self.setState('loaded');
					self.setLogo();
				});
		},
		setState : function(state) {
			this.$el.find('.add').removeClass('loaded loading');

			var html = this.options.name;
			if (this.options.description) html += '<small>'+this.options.description+'</small>';

			switch(state) {
				case 'loading':
					this.$el.find('.add').addClass('loading');
					break;
				case 'loaded':
					this.$el.find('.add').addClass('loaded').end();
// 					html = 'Your logotype<small>'+this.getValue()+'</small>';
					break;
			}

// 			this.$el.find('label').html(html);
 			return this;
		},
		setLogo: function() {
			var self = this;
			this.$el.find('.value .add').removeClass('loaded').css('background-image', '');
			if(this.getValue()){
				asset.get(this.getValue(), function(image){
					self.$el.find('.value .add').addClass('loaded').css('background-image', 'url("'+image.url+'")');
				})
			}
		},
		render : function() {
			Views.Base.prototype.render.call(this);
			this.setUploader();
			this.setLogo();
			return this;
		},
		remove : function() {
			if (!this.getValue()) return;

			// delete file
			$.ajax({
				type : 'DELETE',
				url  : expand_url_params('/merchant/themes/admin/delete_asset.json'),
				data : {type : 'asset', name : this.getValue(), theme_id : themeID}
			});
			this.setValue('').setState('');
			this.setLogo();
			return this;
		}
	});

	// image view
	Views.ImageView = Views.Base.extend({
		template : JST['image'],
		popup : 'image',
		initialize : function(options) {
			Views.Base.prototype.initialize.call(this, options);
			var self = this;
			asset.get(options.value, function(){
				self.$el.find(".thumb-box").addClass('done');
			});
		},
		setState : function(state) {
			switch(state) {
				case 'loaded':
					this.$el.find('.thumb-box').addClass('done');
					break;
				default:
					this.$el.find('.thumb-box').removeClass('done');
			}
			return this;
		},
		remove : function() {
			if (!this.getValue()) return this;

			// delete file
			$.ajax({
				type : 'DELETE',
				url  : expand_url_params('/merchant/themes/admin/delete_asset.json'),
				data : {type : 'asset', name : this.getValue(), theme_id : themeID}
			});
			this.setState('').setValue('');
			return this;
		}
	});

	// image-list view
	Views.ImageListView = Views.Base.extend({
		template : JST['image-list'],
		defaults : {value:[]},
		events   : {
			'click label' : 'toggleSection',
			'click .btn-del' : 'remove',
			'upload .add' : 'onUploadStart',
			'progress .add' : 'onUploadProgress',
			'complete .add' : 'onUploadComplete'
		},
		toggleSection : function() {
			this.$el.find('ul').slideToggle('fast');
		},
		setValue : function(array) {
			Views.Base.prototype.setValue.call(this, JSON.stringify(array));
			return this;
		},
		getValue : function() {
			var v = Views.Base.prototype.getValue.call(this) || '[]';
			return JSON.parse(v);
		},
		remove : function(event) {
			var $li = $(event.target).closest('li'), name = $li.attr('data-name'), array = this.getValue();

			array = _.reject(array, function(v){ return v === name });
			this.setValue(array);

			$li.hide(200, function(){ $li.remove() });

			$.ajax({
				type : 'DELETE',
				url  : expand_url_params('/merchant/themes/admin/delete_asset.json'),
				data : {type : 'asset', name : name, theme_id : themeID}
			});
		},
		drawItems : function() {
			if (!this.$itemTpl || !this.options.value.length) return;

			var self = this;

			this.$el.find('li:not(.add)').remove();
			_.each(this.getValue(), function(image){
				if (image) self.drawItem(image);
			});
		},
		drawItem : function(imageName) {
			var self = this;
			asset.get(imageName, function(image){
				self.$itemTpl.clone()
					.attr('data-name', image.name)
					.find('img').css('background-image', 'url("'+image.url+'")').end()
					.insertBefore(self.$el.find('li.add'));
			});
		},
		render : function() {
			Views.Base.prototype.render.call(this);

			this.$itemTpl = this.$el.find('li:first').remove().css('display','');
			this.setDragdrop();
			this.setUploader();

			if (this.options.value) {
				this.setValue(this.options.value);
 				this.drawItems();
			}

			return this;
		},
		setDragdrop : function() {
			var self = this;

			this.$el.find('ul')
				.sortable({
					cancel : 'a.btn-del',
					placeholder : 'hint-drop',
					start : function(event, ui){
						if (!ui.position) {
							$(this).sortable('refreshPositions');
						}
						self.$el.find('li.add').hide();
					},
					stop : function(event, ui){
						self.$el.find('li.add').appendTo(self.$el.find('ul')).css('display','');
						
						var names = [];
						self.$el.find('li[data-name]').each(function(){
							names.push(this.getAttribute('data-name'));
						});

						self.setValue(names);
					}
				})
				.disableSelection();
		},
		setUploader : function() {
			this.$el.find('a.btn-add')
				.uploader({
                    url : expand_url_params('/merchant/themes/admin/upload_asset.json'),
					accept : 'image/*',
					multiple : true
				});
		},
		onUploadStart : function(event) {
			var self = this, uploader = event.uploader, $add = self.$el.find('li.add');

			uploader.addField('type', 'asset');
			uploader.addField('theme_id', themeID);

			this.$el.find('li.add').fadeOut();

			_.each(uploader.files, function(file){
				var $item = self.$itemTpl.clone();
				
				$item.addClass('loading').insertBefore($add);

				if (window.FileReader) {
					var reader = new FileReader();
					reader.onload = function(){
						$item.find('img').css('background-image', 'url("'+reader.result+'")');
					};
					reader.readAsDataURL(file);
				}
			});
		},
		onUploadProgress : function(event) {
			this.$el.find('li.loading b.progress i').css('width', event.percent+'%');
		},
		onUploadComplete : function(event) {
			var self = this, data = event.response, images = data.assets || data;

			if (!_.isArray(images)) images = [images];

			_.each(images, function(img){
				img.url = img.url.replace(/^https?:/, ''); // convert to schemeless url
				asset.add(img);

				array = self.getValue();
				array.push(img.name);
				self.setValue(array);

				var $img = self.$el.find('li.loading:first').removeClass('loading').attr('data-name', img.name).find('img');
				with(new Image){
					onload = function(){ $img.css('background-image', 'url("'+img.url+'")') };
					src = img.url;
				}
			});

			this.$el.find('li.add').fadeIn();
		}
	});

	// slideshow view
	Views.SlideshowView = Views.ImageListView.extend({
		popup : 'slideshow', 
		events   : {
			'click .btn-edit': 'togglePopup',
			'click label' : 'toggleSection',
			'click .btn-del' : 'remove',
			'upload .add' : 'onUploadStart',
			'progress .add' : 'onUploadProgress',
			'complete .add' : 'onUploadComplete'
		},
		togglePopup : function(event){
			event.preventDefault();

			var $target = $(event.target);

			if (_.isString(this.popup)) {
				this.popup = Popups[this.popup];
			}

			if (this.popup && _.isFunction(this.popup.toggle)) {
				this.popup.toggle(this)
				this.popup.setItem($target.closest('li'));
			}

			return this;
		},
		setValue : function(array){
			var self = this;

			array = _.map(array, function(item){
				if (typeof item != 'string') return item;
				var $li = self.$el.find('li[data-name="'+item+'"]');

				return {
					name : item,
					text : $li.attr('data-text') || '',
					button_text : $li.attr('data-button_text') || '',
					link : $li.attr('data-link') || '',
					target : $li.attr('data-target') || '' 
				};
			});

			Views.ImageListView.prototype.setValue.call(this, array);
		},
		removeItem : function($li) {
			var name = $li.attr('data-name'), array = this.getValue();

			array = _.reject(array, function(v){ return v.name === name });
			this.setValue(array);

			$li.hide(200, function(){ $li.remove() });

			$.ajax({
				type : 'DELETE',
				url  : expand_url_params('/merchant/themes/admin/delete_asset.json'),
				data : {type : 'asset', name : name, theme_id : themeID}
			});
		},
		drawItem : function(img) {
			var self = this;

			asset.get(img.name, function(image){
				self.$itemTpl.clone()
					.attr({
						'data-name': image.name,
						'data-text': img.text||'',
						'data-button_text': img.button_text||'',
						'data-link': img.link,
						'data-target': img.target,
						'data-popup': ''
					})
					.find('img').css('background-image', 'url("'+image.url+'")').end()
					.find('.btn-del').toggleClass('btn-del btn-edit').end()
					.insertBefore(self.$el.find('li.add'));
			});
		},
		onUploadStart : function(event) {
			Views.ImageListView.prototype.onUploadStart.call(this, event);
			this.$el.find('li.loading').attr({'data-popup': '', 'data-text':'', 'data-link':'', 'data-target':''});
		},
		onUploadComplete : function(event) {
			Views.ImageListView.prototype.onUploadComplete.call(this, event);
			this.$el.find('li[data-name] .btn-del').toggleClass('btn-del btn-edit');
			this.update();
		},
		update : function() {
			var arr = [];

			this.$el.find('li[data-name]').each(function(){
				var $li = $(this);
				arr.push({
					name : $li.attr('data-name'),
					text : $li.attr('data-text') || '',
					button_text : $li.attr('data-button_text') || '',
					link : $li.attr('data-link') || '',
					target : $li.attr('data-target') || '' 
				});
			});

			this.setValue(arr);
		}
	});

	// category view
	Views.CategoryView = Views.Base.extend({
		template : JST['category'],
		defaults : {value:[]},
		popup : 'category',
		setValue : function(array) {
			if (array.length && !_.findWhere(array, {name:'Everything'})) {
				array.unshift({key:'', name:'Everything'});
			}
			Views.Base.prototype.setValue.call(this, JSON.stringify(array));

			this.$el.find('.selector').text( Math.max(array.length - 1, 0) );

			return this;
		},
		getValue : function() {
			var v = Views.Base.prototype.getValue.call(this) || '[]';
			return JSON.parse(v);
		},
		render : function(){
			Views.Base.prototype.render.call(this);
			if (this.options.value) {
				this.setValue(this.options.value);
			}
			return this;
		}
	});

	// collection view
	Views.CollectionView = Views.CategoryView.extend({
		template : JST['collection'],
		defaults : {value:[]},
		popup    : 'collection',
		setValue : function(array) {
			Views.Base.prototype.setValue.call(this, JSON.stringify(array));
			this.$el.find('.selector').text( array.length );
			return this;
		}
	});

	// link list view
	Views.LinkListView = Views.CategoryView.extend({
		template : JST['link-list'],
		defaults : {value:[]},
		popup : 'linkList',
		setValue : function(array) {
			Views.Base.prototype.setValue.call(this, JSON.stringify(array));
			this.$el.find('.selector').text( array.length );
			return this;
		}
	});

	// thing-list view
	Views.ThingListView = Views.Base.extend({
		template : JST['thing-list'],
		defaults : {value:[]},
		thingMap : {},
		popup    : 'thingList',
		events   : {
			'click [data-popup]': 'togglePopup',
			'click label' : 'toggleSection',
			'click .btn-del' : 'remove'
		},
		initialize : function(options) {
			Views.Base.prototype.initialize.call(this, options);

			var self = this;
			if (options.value.length) {
				$.getJSON('/rest-api/v1/things/'+options.value.join(',')+',0')
					.done(function(json){
						if (!json || !json.things) return;
						_.each(json.things, function(thing){
							// convert to schemeless url
							var image = thing.image.src.replace(/^https?:/, '');
							self.thingMap[thing.id] = thing;
						});
						self.drawItems();
					});
			}
		},
		toggleSection : function() {
			this.$el.find('ul').slideToggle('fast');
		},
		setValue : function(array) {
			_.unique(array);
			Views.Base.prototype.setValue.call(this, JSON.stringify(array));
			return this;
		},
		getValue : function() {
			var v = Views.Base.prototype.getValue.call(this) || '[]';
			return JSON.parse(v);
		},
		addItem : function(thing) {
			var array = this.getValue();
			array.push(thing.id);

			if (!this.thingMap[thing.id]) {
				this.thingMap[thing.id] = thing;
			}

			this.setValue(array);
			this.drawItem(thing);
		},
		removeItem : function(thing) {
			var array = this.getValue();
			array = _.reject(array, function(v){ return v === thing.id });
			this.setValue(array);

			this.$el.find('li[data-id="'+thing.id+'"]').remove();
		},
		remove : function(event) {
			event.preventDefault();
			var id = $(event.target).closest('li').attr('data-id');
			this.removeItem({id:id});
		},
		drawItems : function() {
			if (!this.$itemTpl || !this.options.value.length) return;

			var self = this, $add = this.$el.find('li.add');

			this.$el.find('li:not(.add)').remove();
			_.each(this.getValue(), function(id){
				var thing = self.thingMap[id];
				if (thing) self.drawItem(thing);
			});
		},
		drawItem : function(thing) {
			this.$itemTpl.clone()
				.attr('data-id', thing.id).attr('title', thing.name)
				.find('img').css('background-image', 'url("'+thing.image.src+'")').end()
				.insertBefore(this.$el.find('li.add'));
		},
		render : function() {
			Views.Base.prototype.render.call(this);
			this.$itemTpl = this.$el.find('li:first').remove().css('display','');
			this.setDragdrop();
			if (this.options.value) {
				this.setValue(this.options.value);
				this.drawItems();
			}
			return this;
		},
		setDragdrop : function() {
			var self = this;
			this.$el.find('ul')
				.sortable({
					cancel : 'a.btn-del',
					placeholder : 'hint-drop',
					start : function(event, ui){
						if (!ui.position) {
							$(this).sortable('refreshPositions');
						}
						self.$el.find('li.add').hide();
					},
					stop : function(event, ui){
						self.$el.find('li.add').appendTo(self.$el.find('ul')).css('display','');
						
						var ids = [];
						self.$el.find('li[data-id]').each(function(){
							ids.push(this.getAttribute('data-id'));
						});

						self.setValue(ids);
					}
				})
				.disableSelection();
		},
	});

	// font view
	Views.FontView = Views.Base.extend({
		template : JST['font'],
		defaults : {value:{}},
		fontMap  : {},
		events   : {
			'click .label' : 'toggleSection',
			'click input[type="radio"]' : 'onSelectFont'
		},
		initialize : function(options) {
			var self = this;

			Views.Base.prototype.initialize.call(this, options);

			_.each(options.fonts || [], function(url, font) {
				self.fontMap[font] = url;
				if (url) {
					var s = document.createElement('link');
					s.setAttribute('type', 'text/css');
					s.setAttribute('rel', 'stylesheet');
					s.setAttribute('href', url);
					$('head').append(s);
				}
			});
		},
		setValue : function(font) {
			this.$el
				.find('.label .value').text( font.name ).end()
				.find('input[type="radio"][value="'+font.name+'"]').prop('checked', true)
					.closest('li').addClass('selected').siblings('li').removeClass('selected');
			return this;
		},
		getValue : function() {
			var v = this.$el.find('input[type="radio"]:checked').attr('value'), font = '';
			if (v && (v in this.fontMap)) {
				font = {name : v, url : this.fontMap[v]};
			}
			return font;
		},
		render : function() {
			Views.Base.prototype.render.call(this);
			if (this.options.value) this.setValue(this.options.value);

			// arrange fonts in alphabetical order
			var fonts = _.keys(this.fontMap), $list = this.$el.find('ul.after');
			fonts.sort();
			_.each(fonts, function(name){
				var $li = $list.find('input[type="radio"][value="'+name+'"]').closest('li');
				if ($li.length) $list.append($li);
			});

			return this;
		},
		toggleSection : function() {
			this.$el.find('ul').slideToggle('fast');
		},
		onSelectFont : function(event) {
			this.setValue( {name:event.target.value} );
		}
	});
	
	// color picker view
	Views.ColorView = Views.Base.extend({
		template : JST['color'],
		defaults : {value:"#fff"},
		popup 	 : 'color',
		events   : {
			'click [data-popup]': 'togglePopup',
		},
		initialize : function(options) {
			Views.Base.prototype.initialize.call(this, options);
		},
		setValue : function(color) {
			this.$el
				.find("input:hidden").val(color).end()
				.find("em.color-box").css('background-color', color);
			return this;
		},
		getValue : function() {
			var color = this.$el.find("input:hidden").val();
			return color;
		}
	});

	// newsletter view
	Views.NewsletterView = Views.Base.extend({
		template : JST['newsletter'],
		defaults : {value:{code:'', display_in_footer:true, title:''}},
		events   : {
			'click .btn-switch' : 'toggle',
			'onClick input[type="checkbox"]' : 'onToggle'
		},
		toggle : function(e) {
			var $checkbox = $(e.target).closest('li').find('input:checkbox');
			$checkbox.prop( 'checked', !$checkbox.prop('checked') ).trigger('onClick')
		},
		onToggle : function(e) {
			var $checkbox = $(e.target), $btn = $checkbox.closest('li').find('.btn-switch');
			$checkbox.prop('checked') ? $btn.addClass('on') : $btn.removeClass('on');
		},
		setValue : function(newsletter) {
			this.$el.find("[name=code]").val(newsletter.code);
			this.$el.find("[name=display_in_footer]").prop('checked', newsletter.display_in_footer).trigger('onClick');
			this.$el.find("[name=title]").val(newsletter.title);
			return this;
		},
		getValue : function() {
			var value = {};
			value.code = this.$el.find("[name=code]").val();
			value.display_in_footer = this.$el.find("[name=display_in_footer]").prop('checked');
			value.title = this.$el.find("[name=title]").val();
			return value;
		}
	});

	// blog posts view
	Views.BlogpostsView = Views.Base.extend({
		template : JST['blogposts'],
		defaults : {value:{count:0, type:0, size:0}},
		events   : {
		},
		setValue : function(blogposts) {
			this.$el.find("[name=count]").val(blogposts.count);
			this.$el.find("[name=type]").val(blogposts.type);
			this.$el.find("[name=size]").val(blogposts.size);
			return this;
		},
		getValue : function() {
			var value = {};
			value.count = this.$el.find("[name=count]").val();
			value.type = this.$el.find("[name=type]").val();
			value.size = this.$el.find("[name=size]").val();
			return value;
		}
	});

	var MainView = Backbone.View.extend({
		containers : [],
		defaults : {settings:{}, allowedSettings:[]},
		options : {},
		events  : {
			'click .btn-back' : 'back',
			'click .btn-exit' : 'exit',
			'click .btn-save' : 'save',
			'click .btn-customize' : 'openCSS',
			'click .btn-full' : 'fullscreen'
		}, 
		initialize : function(options) {
			this.options = _.extend({}, this.defaults, options);

			_.bindAll(this, 'onTransitionEnd', 'onExit');
			if (supportTransition) this.$el.on(eventTransitionEnd, this.onTransitionEnd);

			window.onbeforeunload = this.onExit;
		},
		render : function() {
			var self = this, settings = this.options.allowedSettings, setting, view, class_, lastContainer;

			this.containers = [];

			function addContainer(opt) {
				self.containers.push(new Views.ContainerView(opt));
				lastContainer = self.containers[self.containers.length - 1];
			}

			for (var i=0, c = settings.length; i < c; i++) {
				option = settings[i];

				if (typeof option == 'string') {
					// new section with title
					addContainer({title:option});
				} else {
					option.value = this.options.settings[option.key] || '';

					class_ = Views[option.type.replace(/(?:^|-)(\w)/g, function(a,b){return b.toUpperCase()})+'View'];

					if (class_) {
						view = new class_(option);
						view.render();

						if (!self.containers.length) addContainer();

						if (view.$el.is('.controller')) {
							if (lastContainer.subviews.length) addContainer();
							lastContainer.addSubview(view);
							addContainer();
						} else {
							lastContainer.addSubview(view);
						}
					}
				}
			}

			var $el = this.$el.find('#optionContainer').empty();
			_.each(self.containers, function(c){ 
				if (c.subviews.length) $el.append(c.render().$el)
			});

			this.savedSettings = this.getJSON();

			return this;
		},
		exit : function(event){
			var from = $(event.target).attr('from');
			location.href = from||'/merchant/storefront';
		},
		save : function(event){
			var self = this, $btn = $(event.target).prop('disabled', true).addClass('loading'), json;

			json = this.getJSON();

			$.ajax({
				type : 'POST',
				url  : expand_url_params('/merchant/themes/admin/save_theme_settings.json'),
				data : {json:json, theme_id : themeID},
				dataType : 'json',
				success  : function(data){
					if (!data) return;
					if (!data.status_code) {
						if (data.message) alert(data.message);
						return;
					}

					self.savedSettings = json;

					// reload
					$preview.find('>iframe')[0].contentWindow.postMessage('reload', '*');
				},
				complete : function(){
					$btn.prop('disabled', false).removeClass('loading');
				}
			});
		},
		getJSON : function() {
			var settings = {custom_css:''}, $css = $('#custom_css');

			_.each(this.containers, function(c){
				_.extend(settings, c.serialize());
			});

			if ($css.data('cm')) {
				settings['custom_css'] = $css.data('cm').doc.getValue();
			}

			return JSON.stringify(settings);
		},
		openCSS : function(event) {
			var $el = this.$el;

			event.preventDefault();

			if ($el.hasClass('view-css') && !$el.hasClass('done')) return;

			$el.addClass('view-css');
			setTimeout(function(){ $el.addClass('animate') }, 0);
			if (!supportTransition) $el.addClass('done');
		},
		back : function() {
			var $el = this.$el;

			if ($el.hasClass('view-css') && !$el.hasClass('done')) return;

			$el.removeClass('done full');
			setTimeout(function(){ $el.removeClass('animate') }, 0);
			if (!supportTransition) $el.removeClass('done');
		},
		fullscreen : function(event){
			event.preventDefault();
			this.$el.toggleClass('full');
		},
		onExit : function(event) {
			var json = this.getJSON();

			if (json != this.savedSettings) {
				return 'You have made changes that have not been saved.';
			}
		},
		onTransitionEnd : function() {
			if (this.$el.hasClass('animate')) {
				this.$el.addClass('done');

				var $css = $('#custom_css');
				$css.data('cm') ? $css.data('cm').focus() : $css.focus();

				$('.nano').nanoScroller({stop:true});
			} else {
				this.$el.removeClass('view-css');
				$('.nano').nanoScroller({stop:false});
			}

		}
	});


	$(function(){ 
		// number popup
		Popups.number = new PopupView({
			el: '#popup-number',
			events : {
				'open' : function(event, view) {
					this.$el
						.find('.name_').text( view.$el.find('label').text() ).end()
						.find('.desc_').text( view.$el.find('.desc').text() ).end()
						.find('input:text').val( view.$el.find('input:hidden').val() ).end()
						.find('.spinner')
							.spinner('changing', null)
							.spinner('changing', function(el, newVal, oldVal){
								view.setValue(newVal);
							})
						.end()
				}
			}
		});

		// image popup
		Popups.image = new PopupView({
			el: '#popup-image',
			events : {
				'open' : function(event, view) {
					var v = view.$el.find('input[name]').val(), $img = this.$el.find('.img-editor').css('background-image','');

					$img.removeClass('loading loaded');

					if (v) {
						asset.get(v, function(a){
							$img.addClass('loaded').css('background-image', 'url("'+a.url+'")');
						});
					}

					$img.find('.add')
						.uploader({
                            url : expand_url_params('/merchant/themes/admin/upload_asset.json'),
							accept : 'image/*',
							multiple : false
						})
						.off('upload')
						.on('upload', function(event){
							var $this = $(this), uploader = event.uploader, file = uploader.files[0];

							uploader.addField('type', 'asset');
							uploader.addField('theme_id', themeID);

							$img.removeClass('loaded').addClass('loading');
						})
						.off('complete')
						.on('complete', function(event){
							var data = event.response;

							asset.add(data);

							view.setValue(data.name).setState('loaded');
							$img.removeClass('loading').addClass('loaded').css('background-image', 'url("'+data.url+'")');
						});
				},
				'click .btn-del' : function(event){
					event.preventDefault();

					this.$el.find('.img-editor').removeClass('loaded').css('background-image', '');
					this.currentView.remove();
				}
			}
		});

		// category popup
		Popups.category = new PopupView({
			el: '#popup-category',
			events : {
				'open' : function(event, view){
					var $checkbox, selected = view.getValue();

					$checkbox = this.$el.find('input[type="checkbox"]').prop('checked', false);

					_.each(selected, function(c){
						if (!c.key) return;
						$checkbox.filter('[value="'+c.key+'"]').prop('checked', true);
					});
				},
				'click a.toggle' : function(event){
					event.preventDefault();
					$(event.target).closest('dl').toggleClass('active all');
				},
				'click input[type="checkbox"]' : function(event){
					var $target = $(event.target), selected = [];
					this.$el.find('input[value="'+$target.attr('value')+'"]').prop('checked', $target.prop('checked'));

					this.$el.find('input:checked:visible').each(function(){
						var $check = $(this);
						selected.push({
							key: $check.attr('value'),
							name: $.trim($check.next('label').text())
						});
					});

					this.currentView.setValue( selected );
				}
			}
		});

		// collection popup
		Popups.collection = new PopupView({
			el: '#popup-collection',
			events: {
				'open' : function(event, view){
					var $checkbox, selected = view.getValue(), that = this, $ul = this.$el.find("ul");

					$checkbox = this.$el.find('input[type="checkbox"]').prop('checked', false);

                                        for (var i = selected.length - 1; i >= 0; --i)
                                            $checkbox.filter('[value="'+selected[i]+'"]').prop('checked', true).closest('li').addClass('selected').prependTo($ul);

					$ul.sortable({
						items: "li.selected",
				        tolerance: "intersect",
				        forcePlaceholderSize: true,
				        forceHelperSize: true,
				        containment: "parent",
				        helper: "clone",
				        stop : function(event, ui){
				        	that.options.update(that);
				        }
					})

					this.options.update(this);
				},
				'change input[type="checkbox"]' : function(event){
					
					this.$el.find("li").removeClass("selected").find('input:checked:visible').each(function(){
						if( $(this).prop('checked') ) $(this).closest('li').addClass('selected');
					});

					this.options.update(this);
				}
			},
			update: function(popup){
				var selected = [];

				popup.$el.find("li").sort(function(a,b) {
					var $a = $(a), $b = $(b);
					if( $a.find("input[type=checkbox]").prop('checked') && $b.find("input[type=checkbox]").prop('checked') ){
						return $a.index() - $b.index();
					}else if( $a.find("input[type=checkbox]").prop('checked') != $b.find("input[type=checkbox]").prop('checked') ){
						return $a.find("input[type=checkbox]").prop('checked')?-1:1;
					}
				    return $a.find("label").text().trim().toLowerCase() > $b.find("label").text().trim().toLowerCase()?1:-1;
				}).detach().appendTo( popup.$el.find("ul") );

				popup.$el.find('input:checked:visible').each(function(){
					selected.push(this.value);
				});

				popup.currentView.setValue( selected );

			}
		});

		// list list popup
		Popups.linkList = new (PopupView.extend({
			el : '#popup-link-list',
			events : {
				'open' : 'onOpen',
				'click .add' : 'addLink',
				'click .btn-remove' : 'removeLink',
				'keyup input[type="text"]' : 'update'
			},
			initialize : function(options) {
				PopupView.prototype.initialize.call(this, options);
				this.$tpl = this.$el.find('tr:hidden').remove();
			},
			onOpen : function(event, view){
				var self = this, links = view.getValue(), $tbody;

				$tbody = this.$el.find('tbody').empty();

				if (!links.length) {
					return this.addLink();
				}

				_.each(links, function(link){
					var $row = self.$tpl.clone().css('display','');
					$row
						.find('input.url').val(link.url).end()
						.find('input.text').val(link.text).end()
						.appendTo($row);
				});
			},
			addLink : function(event){
				if (event) event.preventDefault();
				this.$el.find('tbody').append( this.$tpl.clone().css('display','') );
			},
			removeLink : function(event){
				event.preventDefault();

				$(event.currentTarget).closest('tr').remove();
				if (!this.$el.find('tbody > tr').length) {
					this.addLink();
				}

				this.update();
			},
			update : function(){
				var links = [];

				this.$el.find('tbody > tr').each(function(){
					var $this = $(this), url = $.trim($this.find('input.url').val()), text = $.trim($this.find('input.text').val());

					if (url && text) {
						links.push({url:url, text:text});
					}
				});

				this.currentView.setValue(links);
			}
		}));
		
		// thing list popup
		Popups.thingList = new (PopupView.extend({
			el: '#popup-thing-list',
			events : {
				'open' : 'onOpen',
				'keyup input[name=q]' : 'onInputKeyword',
				'click li' : 'onClickItem',
				'click .btn-remove' : 'clearKeyword'
			},
			initialize : function(options) {
				PopupView.prototype.initialize.call(this, options);

				_.bindAll(this, 'onScrollList');
				this.$el.find('.product-list > ul').on('scroll', this.onScrollList);
			},
			onOpen : function(event, view) {
				this.lastKeyword = '';
				this.curPage = 1;
				this.isFetching = false;
				this.selected = {};
				this.thingMap = {};
				this.resultTpl = _.template(this.$el.find('script[type="template"]').html());

				if (this.xhr) this.xhr.abort();
				this.xhr = null;

				this.$el.find('input[name="q"]').val('').trigger('keyup');
			},
			onInputKeyword : function(event) {
				if (event.which === 13) event.preventDefault();

				var self = this, keyword = $.trim(event.target.value);

				if (this.xhr) this.xhr.abort();

				this.$el
					.addClass('loading')
					.find('ul').empty().end()
					.find('.product-list').hide().end()
					.find('.no-result').hide().end();

				if (keyword) {
					this.$el.find('.btn-remove').show();
				} else {
					this.$el.find('.btn-remove').hide();
				}

				this.lastKeyword = keyword;
				this.curPage = 1;
				this.nextPage = 0;

				this.fetch();
			},
			fetch : function() {
				var self = this, page = this.curPage;

				if (this.isFetching) return;

				this.isFetching = true;

				this.xhr = $.getJSON('/rest-api/v1/seller/'+storeID+'/products', {'search[text]':this.lastKeyword, status:'active', page:this.curPage, 'include_affiliate': true})
					.done(function(json){
						if (!json || !json.products) return;
						
						var things = [];
                        _.each(json.products, function(saleitem) {
                            things.push({ id: saleitem.thing_id_str, image: { src: saleitem.image_url }, name: saleitem.title });
                        });
						self.nextPage = json.current_page < json.max_page ? (json.current_page+1) : undefined;
						self.addThingMap(things);
						self.drawThings(things, page > 1);
					})
					.always(function(){
						self.isFetching = false;
						self.$el.removeClass('loading');
					});
			},
			addThingMap : function(things) {
				var self = this;
				_.each(things, function(thing){
					self.thingMap[thing.id] = thing;
				});
			},
			drawThings : function(things, append) {
				if (things.length) {
					var self = this, selected = {};

					this.$el
						.find('.product-list').show().end()
						.find('.no-result').hide().end();

					var html = [];
					_.each(things, function(thing) {
						thing.selected = (thing.id in selected);
						html.push(self.resultTpl(thing));
					});

					var $list = this.$el.find('.product-list > ul');
					if (append) {
						$list.append( html.join('') );
					} else {
						$list.empty().html( html.join('') );
					}
				} else {
					this.$el
						.find('.product-list').hide().end()
						.find('.no-result').show().end();
				}
			},
			onClickItem : function(event){
				var $item = $(event.target).closest('li').toggleClass('selected'), id = $item.attr('data-id');

				if (!id || !this.thingMap[id]) return;

				if ($item.hasClass('selected')) {
					this.currentView.addItem(this.thingMap[id]);
				} else {
					this.currentView.removeItem(this.thingMap[id]);
				}
			},
			clearKeyword : function(event){
				event.preventDefault();
				this.$el.find('input[name="q"]').val('').trigger('keyup');
			},
			onScrollList : function(event){
				if (this.isFetching || !this.nextPage || this.nextPage < this.curPage) return;

				var $list = this.$el.find('.product-list > ul');

				if ($list.scrollTop() + $list.height() < ($list.find('>li:last-child').position().top - 50)) return;

				this.curPage++;
				this.fetch();
			}
		}));

		// slideshow popup
		Popups.slideshow = new (PopupView.extend({
			el: '#popup-slideshow',
			$item: null,
			events : {
				'open' : 'onOpen',
				'keyup input.text' : 'update',
				'click input[type="checkbox"]' : 'update',
				'click a.remove' : 'remove'
			},
			setItem : function($li) {
				this.$item = $li;
				this.$el
					.css('left', $li.offset().left + $li.width())
					.find('input[name="text"]').val( $li.attr('data-text') ).end()
					.find('input[name="button_text"]').val( $li.attr('data-button_text') ).end()
					.find('input[name="link"]').val( $li.attr('data-link') ).end()
					.find(':checkbox').prop('checked', !!$li.attr('data-target'));
			},
			update : function(event) {
				if (event && event.which === 13) event.preventDefault();
				if (!this.$item) return;
				this.$item.attr({
					'data-text': $.trim(this.$el.find('input[name="text"]').val()),
					'data-button_text': $.trim(this.$el.find('input[name="button_text"]').val()),
					'data-link': $.trim(this.$el.find('input[name="link"]').val()),
					'data-target': this.$el.find(':checkbox').prop('checked') ? '_blank' : ''
				});

				this.currentView.update();
			},
			remove : function(event) {
				event.preventDefault();

				if (this.currentView && this.$item) {
					this.currentView.removeItem(this.$item);
				}

				this.close();
			}
		}));

		// color picker popup
		Popups.color = new (PopupView.extend({
			el: '#popup-color',
			$item: null,
			events : {
				'open' : 'onOpen'
			},
			initialize : function(options) {
				PopupView.prototype.initialize.call(this, options);
				var self = this;
				this.$el.colpick({
					flat : true,
					layout : 'hex',
					colorScheme : 'dark',
					submit : 0,
					onChange : function(hsb,hex,rgb,el,bySetColor) {
						if (!bySetColor && self.$el.data('view')) {
							self.$el.data('view').setValue('#'+hex);
						}
					}
				});
			},
			onOpen : function(event, view) {
				this.$el.data('view',view).colpickSetColor(view.getValue());
			}
		}));		

		$('.tooltip').hover(function(event){
			if($(this).find('em').width()>250) {
				$(this).find('em').width(250).css('white-space','normal');
			}
		});

		new MainView({el: '#customize_bar', settings:settings, allowedSettings:allowedSettings}).render();
	});
	asset.update();
});

require(['jquery', 'nanoscroller'], function($){
	$(function(){
		$('.nano').nanoScroller();
	});
});

require(['jquery', 'underscore', 'cm/lib/codemirror', 'cm/mode/css/css', 'cm/addon/edit/closebrackets', 'cm/addon/selection/active-line', 'cm/addon/edit/trailingspace', 'cm/addon/search/search', 'cm/addon/display/placeholder'], function($, _, CodeMirror){
	$(function(){
		var tpl = _.template($('.edit-css .position script[type="template"]').remove().html());
		var $ta = $('#custom_css');

		$('.edit-css').show();

		var cm = CodeMirror.fromTextArea($ta[0], {
			mode: 'css',
			theme: 'joa',
			lineNumbers: true,
			gutters: ["CodeMirror-linenumbers"],
			extraKeys : {
				'Ctrl-S' : function(cm){ $('.btn-save').click(); },
				'Cmd-S' : function(cm){ $('.btn-save').click(); }
			}
		});

		$('.edit-css').removeAttr('style');

		$ta.data('cm', cm);

		var $status = $('.edit-css .status').text( tpl({ch:0,line:0}) );

		cm.on('beforeSelectionChange', function(cm, sel){
			$status.text( tpl(sel.ranges[0].head) );
		});
	});
});
