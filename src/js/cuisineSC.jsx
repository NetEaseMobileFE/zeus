import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../css/modules/cuisineSC.scss';


class Cuisine extends Component {
	render() {
		return (
			<ul styleName="dishes">
				<li styleName="dish">
					<i styleName="icon"/>
					<h4 styleName="name">爆炒腰花</h4>
				</li>
				<li styleName="dish">
					<i styleName="icon"/>
					<h4 styleName="name">歌乐山辣子鸡</h4>
				</li>
			</ul>
		);
	}
}


export default CSSModules(Cuisine, styles);