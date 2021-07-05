/**
 * Create a namespace if it doesn't exist and return it.
 */
window.namespace = function namespace(name) {
	var names = name.split('.'), theLast = window, i = -1;
	while (names[++i]) {
		if (!(names[i] in theLast)) theLast[names[i]] = {};
		theLast = theLast[names[i]];
	}

	return theLast;
};
