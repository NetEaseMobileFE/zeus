/**
 * Created by jruif on 16/2/2.
 */
import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../../css/modules/header.scss';

@CSSModules(styles)
class Header extends Component {
    render() {
        let { info }=this.props;
        return (
            <header >
                <h2 styleName="logo">网易体育跑步后台管理系统</h2>
                <ul styleName="info">
                    <li>{info.name}</li>
                    <li><a href="#">退出</a></li>
                </ul>
            </header>
        )
    }
}
Header.propTypes = {
    info: PropTypes.object
};

export default Header;
