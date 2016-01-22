import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../css/widgets/loading.styl';

@CSSModules(styles)
export default class extends Component {
	render() {
		return <div styleName="loading"/>;
	}
}