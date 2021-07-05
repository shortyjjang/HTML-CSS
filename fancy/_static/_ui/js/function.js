if (!Function.prototype.bind) {
	/**
	 * Bind a function to an object and return it as a callback
	 * @param {Object} context the object to bind the function to
	 * @param {arguments} [1..n] arguments to be passed to the function in the callback
	 * @returns {Function} a callback to the function bound to the object
	 * @requires Object#makeArray
	 * @example
	 * var myInstance = new MyClass();
	 * var callback = myInstance.myMethod.bind(myInstance); //context-safe callback
	 */
	Function.prototype.bind = function bind(context) {
		var callback = this,
			args = jQuery.makeArray(arguments);
			object = args.shift();
		
		return function () {
			var newArgs = args.slice(0);
			newArgs.push.apply(newArgs, arguments);

			return callback.apply(context, newArgs);
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
		var callback = this,
			args = jQuery.makeArray(arguments);
			object = args.shift();
		
		return function (event) {
			var newArgs = args.slice(0);
			newArgs.unshift(event || window.event);
			newArgs.push.apply(newArgs, args);
			
			return callback.apply(context, newArgs);
		};
	};
}

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
