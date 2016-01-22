import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../css/menu.scss';
import Loading from './loading.jsx';


class Menu extends Component {
	constructor() {
		super();
		this.state = {
			CuisineHN: null,
			CuisineSC: null,
			CuisineGD: null
		};
	}

	componentDidMount() {
		this._getCuisines(800)
			.then((cuisines) => {
				this.setState(cuisines);
			});
	}

	_getCuisines(delay) {
		return new Promise(resolve => {
			setTimeout(() => {
				require.ensure([], require => {
					resolve({
						CuisineHN: require('./cuisineHN.jsx').default,
						CuisineSC: require('./cuisineSC.jsx').default,
						CuisineGD: require('./cuisineGD.jsx').default
					});
				});
			}, delay);
		});
	}

	render() {
		let { CuisineHN, CuisineSC, CuisineGD } = this.state;
		return (
			<menu>
				<section styleName="menu">
					<h3 styleName="title"><i/>湘菜</h3>
					{ CuisineGD ? <CuisineHN/> : <Loading/> }
				</section>

				<section styleName="menu">
					<h3 styleName="title"><i/>川菜</h3>
					{ CuisineSC ? <CuisineSC/> : <Loading/> }
				</section>

				<section styleName="menu">
					<h3 styleName="title"><i/>粤菜</h3>
					{ CuisineGD ? <CuisineGD/> : <Loading/> }
				</section>
			</menu>
		);
	}
}


export default CSSModules(Menu, styles);