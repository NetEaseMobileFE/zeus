import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import CSSModules from 'react-css-modules';

import styles from '../../../css/modules/users.scss';
import * as usersActions from '../../actions/users';

@CSSModules(styles, {
  allowMultiple: true
})
class Users extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.fetchUsers();
  }

  render() {
    return (
      <div>
        <a styleName="button small">添加新用户</a>
        <table>
        </table>
      </div>
    );
  }
}
Users.propTypes = {
};
function mapStateToProps(state, props) {
  const users = state.users;
  return {
    users,
  }
}
export default connect(mapStateToProps, usersActions)(Users);
