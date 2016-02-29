/**
 * Created by jruif on 16/2/2.
 */
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from '../../css/modules/slideBar.scss';

@CSSModules(styles)
class SlideBar extends Component {
  render() {
    const menu = [
      {
        link: '/appList',
        name: '报名列表',
        other: ['/appList','/create','/match','/modification']
      }, {
        link: '/users',
        name: '管理员管理',
        other: ['/users']
      }, {
        link: '/training/1',
        name: '跑步培训',
        other: ['/training']
      }
    ];
    let { route } = this.props;
    let pathname = route.location.pathname;
    return (
      <aside styleName="menu">
        <ul>
          {
            menu.map((elm, index) => (
              <li styleName={ elm.other.filter((e)=>pathname.indexOf(e)===0).length && 'active'} key={index}>
                <Link to={elm.link}>{elm.name}</Link>
              </li>
            ))
          }
        </ul>
      </aside>
    );
  }
}
SlideBar.propTypes = {
  route: PropTypes.object.isRequired
};

export default SlideBar;
