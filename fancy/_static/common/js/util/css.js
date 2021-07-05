/**
 * Manage dynamic CSS styles.
 *
 * Note: this library can't remove or modify default styles.
 * It can overrides and restores them by set() and remove() respectively.
 *
 * CSS.set(selector, declaration)
 * CSS.set(object_of_selector_declaration_paris)
 *   adds or modifies CSS declarations.
 *
 * CSS.get(selector)
 *   returns the selected declaration.
 *
 * CSS.remove(selector1, selector2, ...)
 *   removes specified selectors from injected styles.
 *
 * CSS.clear()
 *   clear all injected styles.
 */
(function(){
	var style, declares = {}, updating = false;

	window.CSS = {
		stylesheet : function() {
			if (style) return style;
			style = document.createElement('style');
			style.type = 'text/css';
			return style;
		},
		set : function(selector, declaration) {
			if (typeof selector == 'object') {
				updating = true;
				var pairs = selector;
				for (var s in pairs) {
					if (pairs.hasOwnProperty(s)) this.set(s, pairs[s]);
				}
				updating = false;
			} else if(typeof selector == 'string') {
				selector = trim(selector);
				if (declaration) {
					var declarations = declaration.split(';'), parts, i, c;

					if (declarations.length && !declares[selector]) {
						declares[selector] = {};
					}

					for (i=0,c=declarations.length; i < c; i++) {
						parts = declarations[i].split(':');
						if (parts[0] && parts[1]) {
							declares[selector][trim(parts[0])] = trim(parts[1]);
						}
					}
				} else {
					this.remove(selector);
				}
			}

			if (!updating) {
				this.update();
			}
		},
		get : function(selector, property) {
			var rules = declares[selector];

			if (rules) {
				if (property && rules[property]) return rules[property];
				return rules;
			}

			return null;
		},
		remove : function(selector) {
			if (arguments.length > 1) {
				updating = true;
				for (var i=0,c=arguments.length; i < c; i++) {
					this.remove(arguments[i]);
				}
				updating = false;
			} else if(selector) {
				var prop = [];

				selector = trim(selector.replace(/@([\w-]+)/g, function($0,name){ prop.push(name); return '' }));

				if (declares[selector]) {
					if (prop.length) {
						// remove specific property only
						for (var i=0,c=prop.length; i < c; i++) {
							console.log(prop[i]);
							delete declares[selector][prop[i]];
						}
					} else {
						delete declares[selector];
					}
				} 
			}

			if (!updating) {
				this.update();
			}

			return this;
		},
		update : function() {
			// remove all rules
			try { style.parentNode.removeChild(style); style = null; } catch(e){};

			var styles = [], sheet = this.stylesheet().sheet || this.stylesheet().styleSheet, selector;

			// add new rules
			if (!sheet) {
				for (selector in declares) {
					if (declares.hasOwnProperty(selector)) {
						styles.push(selector + '{'+ glue(declares[selector]) +'}');
					}
				}
				this.stylesheet().innerHTML = styles.join('');
			} else {
				for (selector in declares) {
					if (declares.hasOwnProperty(selector)) {
						var rule = glue(declares[selector]);
						if (!rule) continue;

						if (sheet.addRule) {
							sheet.addRule(selector, rule);
						} else if (sheet.insertRule) {
							sheet.insertRule(selector + '{' + rule + '}', sheet.cssRules.length);
						}
					}
				}
			}

			if (!this.stylesheet().parentNode) {
				document.getElementsByTagName('head')[0].appendChild(this.stylesheet());
			}
		},
		clear : function() {
			try { style.parentNode.removeChild(style) }catch(e){};
			style = null;
			declares = {};
		}
	};

	function trim(s){ return s.replace(/^\s+|\s+$/g,'') };
	function glue(o){ var str = []; for(var x in o){ if(o.hasOwnProperty(x)) str.push(x+':'+o[x]) }; return str.join(';') };
})();
