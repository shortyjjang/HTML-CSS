(function () {
	function collect (collection, property, type) {
		return collection.map(function () {
			return jQuery(this)[type](property);
		}).get();
	}
	
	jQuery.fn.collectAttr = function (property) {
		return collect(this, property, 'attr');
	};
	
	jQuery.fn.collectProp = function () {
		return collect(this, property, 'prop');
	};
})();