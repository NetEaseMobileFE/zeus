import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import styles from '../../css/main.scss';
import * as Actions from '../actions';
import * as ModalActions from '../actions/modal';
import SlideBar from './SlideBar';
import Header from './Header';
import AlertModal from './AlertModal.jsx';

@CSSModules(styles)
class App extends Component {
  render() {
    const { route, data, children, modal, modalAction } = this.props;
    return (
      <div styleName="root">
        <Header info={data}/>
        <section styleName="main">
          <SlideBar route={route}/>
          <section styleName="content">
            {children}
          </section>
        </section>
        <AlertModal modal={modal} actions={modalAction}/>
      </div>
    );
  }
}

// Api: https://facebook.github.io/react/docs/reusable-components.html
App.propTypes = {
  data: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  modalAction: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  children: PropTypes.element
};

export default connect(
  state => ({
    data: state.app,
    route: state.routeReducer,
    modal: state.modal
  }),
  dispatch => ({
    actions: bindActionCreators(Actions, dispatch),
    modalAction: bindActionCreators(ModalActions, dispatch)
  })
)(App);
