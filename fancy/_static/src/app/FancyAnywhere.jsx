import React from 'react';
import {Router, Route} from 'react-router';
import SimpleHeader from '../component/SimpleHeader';

require('!style/url!file!less!../style/FancyAnywhere.less');

export default class FancyAnywhere extends React.Component {
	render() {
		return (
			<div id="app">
				<SimpleHeader />
				<div>Hello, world</div>
			</div>
		);
	}
};
