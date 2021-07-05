/**
 * JSized HTML5 Placeholder for Legacy Browsers, v1.0
 *
 * @copyright Copyright (c) 2010 JSized, <a href="http://jsized.com/">JSized</a>
 * @author Stephen Reay
 * @version 1.0
 */

if (!Function.prototype.bind) {
	/**
	 * Bind a function to an object and return it as a callback
	 * @param {Object} context the object to bind the function to
	 * @param {arguments} [1..n] arguments to be passed to the function in the callback
	 * @returns {Function} a callback to the function bound to the object
	 * @requires Object#toArray
	 * @example
	 * var myInstance = new MyClass();
	 * var callback = myInstance.myMethod.bind(myInstance); //context-safe callback
	 */
	Function.prototype.bind = function bind(context) {
		var callback = this;
		var args =  Array.prototype.slice.call(arguments, 0);
		var object = args.shift();
		return function () {
			return callback.apply(object, args.concat(Array.prototype.slice.call(arguments, 0)));
		};
	};
}

if (!Function.prototype.bindAsEventListener) {
	/**
	 * Bind a function to an object and return it as a callback that receives the active Event as its first argument
	 * @param {Object} context the object to bind the function to
	 * @param {arguments} [1..n] arguments to be passed to the function in the callback
	 * @returns {Function} a callback to the function bound to the object
	 * @see Function#bind
	 * @example
	 * var myInstance = new MyClass();
	 * var callback = myInstance.myMethod.bind(myInstance); //context-safe callback
	 */
	Function.prototype.bindAsEventListener = function bindAsEventListener(context) {
		var callback = this;
		var args =  Array.prototype.slice.call(arguments, 0);
		var object = args.shift();
		return function (event) {
			var localArgs = Array.prototype.slice.call(arguments, 0);
			localArgs.shift();
			return callback.apply(object, [event || window.event].concat(args, localArgs));
		};
	};
}

if (typeof JSized === 'undefined') {
	/**
	 * JSized Namespace
	 * @namespace
	 */	
	var JSized = {};
}
if (typeof JSized.Ui === 'undefined') {
	/**
	 * JSized User Interface Namespace
	 * @namespace
	 */
	JSized.Ui = {};
}
if (typeof JSized.Ui.Form === 'undefined') {
	/**
	 * JSized Form Namespace
	 * @namespace
	 */
	JSized.Ui.Form = {};
}
/**
 * jQuery Plugin for JSized HTML5 Placeholder for Legacy Browsers
 */
jQuery.fn.JSizedFormPlaceholder = function () {
	return this.each(function () {
		new JSized.Ui.Form.Placeholder(this);
	});
};

/**
 * @class HTML5 Placeholder for Legacy Browsers
 * @param {HTMLElement} element element ID or element reference to initialise Placeholder on
 */
JSized.Ui.Form.Placeholder = function (element) {
	
	/**
	 * The Input element
	 * @type HTMLElement
	 */
	this.element = jQuery(element);

	if (!this.element.length || this.nativeSupport(this.element)) {
		return;
	}
	
	/**
	 * The placeholder text (false if none)
	 * @type String|Boolean
	 */
	this.placeholderText = this.element.attr('placeholder');
	
	/**
	 * Indicates if placeholder text is showing
	 * @type Boolean
	 */
	this.active = false;
	
	/**
	 * Indicates if we're dealing with a password field
	 * @type Boolean
	 */
	this.passwordMode = this.element.get(0).type === 'password';
	
	
	this.passwordFieldFixed = false;
	
	if (this.placeholderText) {
		this.events();
		this.show();
	}
};

JSized.Ui.Form.Placeholder.prototype.nativeSupport = function (element) {
	
	var type = element.get(0).nodeName.toLowerCase(),	
		e = document.createElement(type);

	return 'placeholder' in e;
};

JSized.Ui.Form.Placeholder.prototype.events = function () {
	this.element.bind('focus', this.hide.bindAsEventListener(this));
	this.element.closest('form').bind('submit', this.hide.bindAsEventListener(this));
	this.element.closest('form').bind('reset', this.reset.bindAsEventListener(this));
	this.element.bind('blur', this.show.bindAsEventListener(this));
};


JSized.Ui.Form.Placeholder.prototype.fixPasswordField = function () {

	this._element = this.element;
	
	this.otherField = jQuery('<input />').attr('type', 'text').addClass(this.element.attr('class')).bind('focus', this.hide.bindAsEventListener(this));
	
	jQuery('label[for="' + this.element.attr('id') + '"]').bind('observe', 'click', this.focus.bind(this));
	
	this.element.parent().get(0).insertBefore(this.otherField.get(0), this.element.get(0));
	
	this.passwordFieldFixed = true;
};

/**
 * Show the placeholder text
 */
JSized.Ui.Form.Placeholder.prototype.show = function () {
	if (this.element.val().length === 0) {
		
		if (this.passwordMode) {
			try {
				this.element.attr('type', 'text');
			}
			catch(e) {
				if (!this.passwordFieldFixed) {
					this.fixPasswordField();	
				}
				
				this.element.hide();
				this.otherField.show();
				
				this.element = this.otherField;
			}
		}
		
		this.element.val(this.placeholderText);
		this.element.css('color','#b3b9c7');
		this.active = true;
	}
};


/**
 * Hide the placeholder text
 */
JSized.Ui.Form.Placeholder.prototype.hide = function () {
	if (this.active) {
		
		if (this.passwordMode) {
			try {
				this.element.attr('type', 'password');
			}
			catch(e) {
				if (!this.passwordFieldFixed) {
					this.fixPasswordField();	
				}
				
				this.otherField.hide();
				this.element = this._element;
				this.active = false;
				this.element.show().focus();
			}
		}

		
		this.element.val('');
		var toFocus = false;
		
		this.element.css('color', '#b3b9c7');
		this.active = false;
	}
};

JSized.Ui.Form.Placeholder.prototype.focus = function () {
	this.element.focus();
};

JSized.Ui.Form.Placeholder.prototype.reset = function () {
	window.setTimeout(this.show.bind(this), 20);
};
