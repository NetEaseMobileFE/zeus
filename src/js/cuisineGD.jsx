import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../css/cuisineGD.less';


class Cuisine extends Component {
	render() {
		return  (
			<ul styleName="dishes">
				<li styleName="dish">
					<i styleName="icon"/>
					<h4 styleName="name">烤乳猪</h4>
				</li>
				<li styleName="dish">
					<i styleName="icon"/>
					<h4 styleName="name">叉烧</h4>
				</li>
			</ul>
		);
	}
}


export default CSSModules(Cuisine, styles);