/**
 * Headless file uploader component using ajax or iframe as a fallback.
 *
 * Usage
 *   $(selector).uploader(options); // create instance
 *   $(selector).uploader(command, arg1, ...); // execute a command
 *
 * Events
 *   some events are fired on the target element as a file upload is progressing.
 *
 *   - 'upload' is triggered just before starting to upload.
 *   - 'progress' is fired as uploads a file.
 *   - 'complete' occurs when finished.
 */
;(function($){
	var defaults = {
		field : 'file',
		dragndrop : false,
		autoupload : true
	};

	var styles = {
		position : 'absolute',
		top  : '-999px',
		left : '-999px',
		margin  : 0,
		padding : 0,
		border  : 0,
		overflow : 'hidden'
	};
	
	function uploader(options) {
		var instance, $el, cmd, ret, arg, i=0;

		if (!options || typeof options == 'object') {
			options = $.extend({}, defaults, options);
		}
		
		if (typeof options == 'string') {
			cmd = options;
			(arg = arguments).shift();
		}

		while (($el = this.eq(i++)) && $el[0]) {
			instance = $el.data('uploader');

			if (!instance) {
				instance = new Uploader($el, options);
				this.data('uploader', instance);
			}
			
			if (cmd && typeof instance[cmd] == 'function') {
				instance[cmd].apply(instance, arg);
			}
		}

		return this;
	};

	function Uploader(element, options) {
		this.options = {};
		this.supportHTML5 = !!(window.FormData && ('upload' in $.ajaxSettings.xhr()));
		this.$el   = $(element).on('mouseover mousemove', $.proxy(this, 'mousemove'));
		this.$file = $('<input type="file">').css({position:'absolute',top:0,left:0,width:'10px',height:'10px',opacity:0}).on('change', $.proxy(this, 'change'));

		this.set(options);
	};

	$.extend(Uploader.prototype, {
		// set options
		'set' : function(name, value) {
			var attrs = {};

			if (typeof name == 'object') {
				attrs = $.extend({}, name);
			} else {
				attrs[name] = value;
			}
			
			if ('accept' in attrs) {
				if (attrs.accept === false) {
					this.$file.removeAttr('accept');
				} else {
					this.$file.attr('accept', attrs.accept);
				}
			}

			$.extend(this.options, attrs);
		},
		// get option value
		'get' : function(name) {
			return this.options[name];
		},
		mousemove : function(event) {
			if (!this.$file[0].offsetParent) {
				this.$file.appendTo(this.$el[0].offsetParent);
			}
			var offset = this.$file.parent().offset();
			this.$file.css({top:event.pageY-offset.top-5+'px', left:event.pageX-offset.left-5+'px'});
		},
		change : function(event) {
			if (this.options.autoupload) {
				this.upload();
			}
		},
		upload : function() {
			var self = this;

			if (this.supportHTML5) {
				this.formData = new FormData(), file = this.$file[0].files[0];
				
				if (!file) return;

				this.formData.append(this.options.field, file);
			} else {
				if (!this.$frame) {
					this.$frame = $('<iframe name="uploader_'+$.now()+'_'+Math.floor(Math.random()*1000)+'">').css(styles).appendTo('body');
				}

				if (!this.$form) {
					this.$form = $('<form method="POST" enctype="multipart/form-data">').css(styles).appendTo('body');
					this.$form.one('reset', $.proxy(this, 'reset'));
					this.$form.one('submit', $.proxy(this, 'fakeProgress'));
				}
				
				if (!this.$file.val()) return;

				this.$form.attr('target', this.$frame.attr('name'));
				this.$file.attr('name', this.options.field);
			}

			this.$el.trigger({type:'upload', uploader:this});

			if (this.supportHTML5) {
				this.xhr = $.ajax({
					type : 'POST',
					url  : this.options.url,
					data : this.formData,
					cache : false,
					contentType : false,
					processData : false,
					xhr  : function() {
						var xhr = $.ajaxSettings.xhr();
						xhr.upload.addEventListener('progress', $.proxy(self, 'progress'));
						return xhr;
					},
					error : $.proxy(self, 'error'),
					success : $.proxy(self, 'complete')
				});
				
				$('<form />').append(this.$file)[0].reset();
			} else {
				if (!window._uploaderCallbacks) window._uploaderCallbacks = {};
				_uploaderCallbacks[this.$frame.attr('name')] = $.proxy(self, 'complete');

				var url = this.options.url;
				url += ((url.indexOf('?') > 0) ? '&' : '?') + 'callback=' + 'parent._uploaderCallbacks.'+this.$frame.attr('name');

				this.$form.attr('action', url).append(this.$file).submit();
			}
		},
		progress : function(event) {
			if (event.lengthComputable) {
				var percent = event.loaded * 100 / event.total;
				this.$el.trigger({type:'progress', uploader:this, percent:percent});
			}
		},
		error : function() {
			this.$el.trigger({type:'error', uploader:this});
		},
		complete : function(json) {
			this.$el.trigger({type:'complete', uploader:this, response:json});
		},
		abort : function() {
			if (this.supportHTML5) {
				try { this.xhr.abort() } catch(e) {};
			} else {
				clearTimeout(this.fakeProgressTimer);
				this.$frame.attr('src', 'about:blank');
				this.$form.reset();
			}

			this.$el.trigger({type:'abort', uploader:this});
		},
		reset : function(event) {
			var self = this;
			setTimeout(function(){ self.$form.empty() }, 1);
		},
		fakeProgress : function() {
			var self = this, percent = 0;
			this.fakeProgressTimer = setInterval(function(){
				self.$el.trigger({type:'progress', uploader:self, percent:percent+=Math.random()});

				// stop progress at about 90%.
				if (percent > 90) clearTimeout(self.fakeProgressTimer);
			}, 100);
		}
	});

	$.fn.uploader = uploader;
})(jQuery);
