import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import CSSModules from 'react-css-modules';
import moment from 'moment';

import Modal from '../common/Modal';
import Pagination from '../common/Pagination';
import styles from '../../../css/modules/users.scss';
import * as usersActions from '../../actions/users';

@CSSModules(styles, {
  allowMultiple: true
})
class Users extends Component {
  constructor(props) {
    super(props);
    this.modalTitle = '增加用户';
    this.RECORDS_PER_PAGE = 10;
    this.hideModal = this.hideModal.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleModifyClick = this.handleModifyClick.bind(this);
  }
  handlePageChangeClick(next) {
    this.props.changePage(next, this.RECORDS_PER_PAGE);
  }
  handleDeleteClick(account) {
    this.props.deleteUser({ acount });
  }
  handleModifyClick(user) {
    this.modalTitle = '修改用户';
    const { account, name, select } = this.refs;
    account.value = user.account;
    name.value = user.name;
    select.value = user.select;
    this.props.toggleModal();
  }
  handleAddClick(title) {
    this.modalTitle = '增加用户';
    this.props.toggleModal();
  }
  hideModal(isOK) {
    const { account, name, select } = this.refs;
    const data = {
      account: account.value.trim(),
      name: name.value.trim(),
      select: select.value
    };
    if (isOK) {
      if (!data.account || !data.name) {
        return;
      }
      console.log(data);
      this.props.addUser(data);
    }
    account.value = '';
    name.value = '';
    select.value = '0';
    this.modifyingUser = {};
    this.props.toggleModal();
  }
  componentDidMount() {
    this.props.fetchUsers();
    this.props.fetchUsersCount();
  }

  render() {
    const { users, changePage } = this.props;
    return (
      <div>
        <a styleName="button small" onClick={this.handleAddClick}>添加新用户</a>
        <table>
          <thead>
            <tr>
              <th>账号</th>
              <th>姓名</th>
              <th>最后登录时间</th>
              <th>创建时间</th>
              <th>权限</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
          {
            users.data.map((user) => {
              return (<tr key={user.account}>
                <td>{user.account}</td>
                <td>{user.name}</td>
                <td>{moment(user.lastLogin).format('YYYY-MM-DD hh:mm:ss')}</td>
                <td>{moment(user.createTime).format('YYYY-MM-DD hh:mm:ss')}</td>
                <td>111</td>
                <td><a styleName="button warning tiny" onClick={this.handleModifyClick.bind(this, user)}>修改</a><a styleName="button alert tiny"  onClick={this.handleDeleteClick.bind(this, user.account)}>删除</a></td>
              </tr>)
            }) 
          }
          </tbody>
        </table>
        <Pagination total={Math.ceil(users.count / this.RECORDS_PER_PAGE)} curPage={users.current} toPage={this.handlePageChangeClick} />
        <Modal title={this.modalTitle} isShown={users.showModal} hideCancelButton={false} hideModal={this.hideModal} >
          <form>
            <div styleName="row">
              <div styleName="small-3 columns">
                <label styleName="text-right middle">邮箱前缀：</label>
              </div>
              <div styleName="small-9 columns">
                <input type="text" ref="account" placeholder="corp邮箱前缀"  />
              </div>
            </div>
            <div styleName="row">
              <div styleName="small-3 columns">
                <label styleName="text-right middle">姓名：</label>
              </div>
              <div styleName="small-9 columns">
                <input styleName="alert" type="text" ref="name" placeholder="姓名" />
              </div>
            </div>
            <div styleName="row">
              <div styleName="small-3 columns">
                <label styleName="text-right middle">权限：</label>
              </div>
              <div styleName="small-9 columns">
                <select ref="select">
                  <option value="0">用户</option>
                  <option value="1">管理员</option>
                </select>
              </div>
            </div>
          </form>
        </Modal>
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
