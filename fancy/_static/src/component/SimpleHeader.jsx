import React from 'react';

export default class SimpleHeader extends React.Component {
	render() {
		// change menu based on user login status
		var menus = [];
		if (this.attrs.user.loggedIn) {
			menus = [
			];
		} else {
			menus = [
			];
		}

		<header>
			<h1 class="logo">
				<a href="" target="_blank">FANCY</a>
			</h1>
			<div>
				<a href="/merchant" class="avatar after-bg" target="_blank">{user.name}</a>
				<ul>
				</ul>
			</div>
		</header>
	}
}
