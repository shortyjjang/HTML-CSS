import fetch from 'whatwg-fetch';
import cookie from 'tiny-cookie/tiny-cookie';

export default function (url, options){
	options = Object.assign({method: 'GET', headers:{}}, options);

	// set X-CSRFToken when the method is POST, PUT, or DELETE.
	if (/^(POST|PUT|DELETE)$/i.test(options.method)) {
		options.headers['X-CSRFToken'] = cookie.getRaw('csrftoken');
	}

	// disable cache option
	if (options.cache === false) {
		options.cache = 'reload';
	}

	return fetch(url, options);
}
