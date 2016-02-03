/**
 * Created by jruif on 16/2/2.
 */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routeActions } from 'react-router-redux';
import * as Actions from '../actions';

class AppList extends Component {
  render() {
    const { route } = this.props;
    return (
      <div onClick={ () => route.push('/create') }>创建活动</div>
    );
  }
}

// Api: https://facebook.github.io/react/docs/reusable-components.html
AppList.propTypes = {
  // data & actions
  route: PropTypes.object.isRequired,
};

export default connect(
  (state) => ({ data: state.applyList }),
  (dispatch) => ({
    actions: bindActionCreators(Actions, dispatch),
    route: bindActionCreators(routeActions, dispatch),
  })
)(AppList);
