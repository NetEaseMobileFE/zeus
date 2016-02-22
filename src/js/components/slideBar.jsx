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
                    name:'报名列表'
                },{
                    link:'/create',
                    name:'创建活动'
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
                    {state.menu.map((elm,index)=>(
                        <li styleName={elm.link === pathname && 'active'}
                            key={index}>
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
