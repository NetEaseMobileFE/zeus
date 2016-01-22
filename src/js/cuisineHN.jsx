import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../css/cuisineHN.css';


class Cuisine extends Component {
	render() {
		return (
			<ul styleName="dishes">
				<li styleName="dish">
					<i styleName="icon"/>
					<h4 styleName="name">剁椒鱼头</h4>
				</li>
				<li styleName="dish">
					<i styleName="icon"/>
					<h4 styleName="name">回锅肉</h4>
				</li>
			</ul>
		);
	}
}


export default CSSModules(Cuisine, styles);