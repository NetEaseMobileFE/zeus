/**
 * Created by jruif on 16/2/2.
 */
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router'
import CSSModules from 'react-css-modules';
import styles from '../../css/modules/slideBar.scss';

@CSSModules(styles)
class SlideBar extends Component {
    componentWillMount(){
        this.setState({
            menu:[
                {
                    link:'/appList',
                    name:'报名列表',
                    id: 1
                },{
                    link:'/create',
                    name:'管理员管理',
                    id: 2
                }
            ]
        });
    }
    render(){
        let state = this.state;
        let { route } = this.props,
            pathname = route.location.pathname;
        return (
            <aside styleName="menu">
                <ul>
                    {state.menu.map((elm)=>(
                        <li styleName={elm.link === pathname && 'active'}
                            key={elm.id}>
                            <Link to={elm.link}>{elm.name}</Link>
                        </li>
                    ))}
                </ul>
            </aside>
        );
    }
}
SlideBar.propTypes = {
    route:PropTypes.object.isRequired
};

export default SlideBar;
