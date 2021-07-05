// hotkey
(function($){
	var $body;

	$.fn.hotkey = function(hotkey, handler){
		if($.isPlainObject(hotkey)) {
			var _this = this;
			$.each(hotkey, function(_hotkey, _handler){
				_this.hotkey(_hotkey, _handler);
			});
			return;
		}

		hotkey = parse(hotkey);
		if(!hotkey) return this;

		var $el = this;
		if($el.get(0) === window || $el.get(0) === document) $el = $body;

		var handlers = $el.data('hotkey-handlers'), strHotkey = serialize(hotkey);
		if(!handlers){
			$el.data('hotkey-handlers', handlers={});
			$el.on('keydown', keyHandler);
		}

		handlers[strHotkey] = handler;

		return this;
	};

	$.hotkey = function(){
		if(!$body) $body = $('body');
		$body.hotkey.apply($body, arguments);
	};

	$.hotkey.specialKeys = {
		BACKSPACE:8, TAB:9, ENTER:13, RETURN:13, PAUSE:19, CAPSLOCK:20,
		'ESC':27, SPACE:32, PAGEUP:33, PGUP:33, PAGEDOWN:34, PGDN:34, END:35, HOME:36,
		LEFT:37, UP:38, RIGHT:39, DOWN:40, INSERT:45, INS:45, DELETE:46, DEL:46,
		';':186, '=':187, ',':188, '-':189, '.':190, '/':191, '`':192,
		"'":222
	};

	function parse(strHotkey){
		var ret = {altKey:false, ctrlKey:false, shiftKey:false, metaKey:false, keyCode:null}, keys = strHotkey.replace(/\s+/g,'').toUpperCase().split('+'), i, c;

		for(i=0,c=keys.length; i < c; i++){
			if(keys[i] == 'CTRL'){
				ret.ctrlKey = true;
			} else if(keys[i] == 'ALT'){
				ret.altKey = true;
			} else if(keys[i] == 'SHIFT'){
				ret.shiftKey = true;
			} else if(/^[A-Z0-9]$/.test(keys[i])){
				ret.keyCode = keys[i].charCodeAt(0);
			} else {
				ret.keyCode = $.hotkey.specialKeys[keys[i]] || null;
			}
		};

		return (ret.keyCode === null)?false:ret;
	};

	function serialize(objHotkey){
		var arr = [];

		if(objHotkey.ctrlKey)  arr.push('CTRL');
		if(objHotkey.altKey)   arr.push('ALT');
		if(objHotkey.shiftKey) arr.push('SHIFT');
		if(objHotkey.keyCode)  arr.push(getSpecialKey(objHotkey.keyCode) || String.fromCharCode(objHotkey.keyCode));

		return arr.join('+');
	};

	function getSpecialKey(code){
		for(var k in $.hotkey.specialKeys){
			if(code == $.hotkey.specialKeys[k]) return k;
		}
		return false;
	};

	function keyHandler(event){
		var $this = $(this), handlers = $this.data('hotkey-handlers'), strHotkey = serialize(event);

		if(!handlers || !(strHotkey in handlers)) return;

		handlers[strHotkey].call(this, event);
	};
})(jQuery);
