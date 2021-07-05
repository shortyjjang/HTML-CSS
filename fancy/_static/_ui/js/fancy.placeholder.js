if (!Function.prototype.inherits) {
	/**
	 * Makes a Class constructor Function inherit from another Class
	 * @param {Class} parentClass the Class to inherit from
	 * @author Based on an idea by <a href="http://www.coolpage.com/developer/javascript/Correct%20OOP%20for%20Javascript.html">Shelby H. Moore III</a>
	 * @example
	 * function ClassA(arg) {
	 *     this.prop = arg || false;
	 * }
	 * 
	 * ClassA.prototype.foo = function (foo) {
	 *     this.bar = foo;
	 * }
	 * 
	 * ClassB.inherits(ClassA);
	 * function ClassB(arg) {
	 *     this.inherits(ClassA, arg);
	 * }
	 *
	 * ClassB.prototype.foo = function (foo) {
	 *     this.parent.foo.call(this, foo);
	 *     this.bar2 = foo;
	 * }
	 */
	Function.prototype.inherits = function inherits(ParentClass) {
	 	// When it's run initially
	 	if (typeof this === 'function') {
			if (this === ParentClass) {
		 		throw new ReferenceError("A Class can't inherit from itself");
		 	}
			
			this.prototype = new ParentClass();
			
			this.prototype.inherits = Function.prototype.inherits;
			
			this.prototype.constructor = this;
			
			this.prototype.parent = ParentClass.prototype;
		}
		
		else if (typeof this === 'object') {
			if (this.constructor === ParentClass) {
		 		throw new ReferenceError("A Class can't inherit from itself");
		 	}
		 	
			if (arguments.length > 1) {
				ParentClass.apply(this, Array.prototype.slice.call(arguments, 1));
			}
			else {
				ParentClass.call(this);
			}
		}
	};
}

Fancy.Placeholder = function (element) {

	this.inherits(JSized.Ui.Form.Placeholder, element);
	
	this.element.attr('placeholder', '');
	this.element.bind('keypress keyup', this.typingHandler.bindAsEventListener(this));
	this.element.bind('click', this.hide.bind(this));
};
Fancy.Placeholder.inherits(JSized.Ui.Form.Placeholder);

Fancy.Placeholder.prototype.nativeSupport = function (element) {
	return false;
};

Fancy.Placeholder.prototype.typingHandler = function (event) {
	var length = this.element.val().length;
	if (length && this.active) {
		this.remove();
	}
	else if (!length) {
		this.hide();
	}
};

Fancy.Placeholder.prototype.show = function () {
	if (!this.element.val().length || this.active) {
		this.element.addClass('placeholder-active').removeClass('placeholder-inactive');
		this.populate();
	}
};

Fancy.Placeholder.prototype.hide = function () {
	if (!this.element.val().length) {
		this.populate();
	}

	if (this.active) {
		this.element.addClass('placeholder-inactive').removeClass('placeholder-active')
		this.setCaret();
	}
};

Fancy.Placeholder.prototype.remove = function () {
	this.element.removeClass('placeholder-active placeholder-inactive');
	this.element.val('');
	this.active = false;
};

Fancy.Placeholder.prototype.populate = function () {
	this.element.val(this.placeholderText);
	this.active = true;
};

Fancy.Placeholder.prototype.setCaret = function () {

	var el = this.element.get(0);	
	
	if(el.setSelectionRange) {
		el.focus();
		el.setSelectionRange(0,0);
	}
	else if (el.createTextRange) {
		var range = el.createTextRange();
		el.collapse(true);
		el.moveEnd('character', 0);
		el.moveStart('character', 0);
		el.select();
	}
};