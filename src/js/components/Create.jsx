/**
 * Created by jruif on 16/2/2.
 */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions';

class Create extends Component {
  render() {
    const { actions } = this.props;
    return (
      <div onClick={ () => actions.login() }>Create</div>
    );
  }
}

// Api: https://facebook.github.io/react/docs/reusable-components.html
Create.propTypes = {
  actions: PropTypes.object.isRequired,
};

export default connect(
  (state) => ({ data: state.create }),
  (dispatch) => ({ actions: bindActionCreators(Actions, dispatch) })
)(Create);
