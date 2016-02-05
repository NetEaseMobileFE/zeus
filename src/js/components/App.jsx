import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import styles from '../../css/main.scss';
import * as Actions from '../actions';
import SlideBar from './SlideBar';
import Header from './Header';

@CSSModules(styles)
class App extends Component {
  render() {
    const { route, data, children } = this.props;
    return (
      <div styleName="root">
        <Header info={data}/>
        <section styleName="main">
          <SlideBar route={route} />
          <section styleName="content">
            {children}
          </section>
        </section>
      </div>
    );
  }
}

// Api: https://facebook.github.io/react/docs/reusable-components.html
App.propTypes = {
  data: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  children: PropTypes.element
};

export default connect(
  (state) => ({
    data: state.app,
    route: state.routeReducer
  }),
  (dispatch) => ({ actions: bindActionCreators(Actions, dispatch) })
)(App);
