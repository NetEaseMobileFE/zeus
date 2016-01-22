import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../css/menu.scss';


class Menu extends Component {
	render() {
		return (
			<menu>
				<section styleName="menu">
					<h3 styleName="title"><i/>湘菜</h3>
				</section>

				<section styleName="menu">
					<h3 styleName="title"><i/>川菜</h3>
				</section>

				<section styleName="menu">
					<h3 styleName="title"><i/>粤菜</h3>
				</section>
			</menu>
		);
	}
}


export default CSSModules(Menu, styles);