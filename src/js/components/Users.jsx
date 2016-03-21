import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import moment from 'moment';

import Modal from './common/Modal';
import Pagination from './common/Pagination';
import styles from '../../css/modules/users.scss';
import * as usersActions from '../actions/users';

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
    this.handlePageChangeClick = this.handlePageChangeClick.bind(this);
    
  }
  componentDidMount() {
    this.props.fetchUsers();
    this.props.fetchUsersCount();
  }
  handlePageChangeClick(next) {
    this.props.changePage(next, this.RECORDS_PER_PAGE);
  }
  handleDeleteClick(account) {
    if (confirm('确认删除该用户吗？')) {
      this.props.deleteUser({ account });
    }
  }
  handleAddClick() {
    this.modalTitle = '增加用户';
    this.props.toggleModal();
  }
  hideModal(isOK) {
    const { account, name, select } = this.refs;
    const data = {
      account: account.value.trim(),
      name: name.value.trim(),
      authority: select.value
    };
    if (isOK) {
      if (!data.account || !data.name) {
        return;
      }
      this.props.addUser(data);
    }
    account.value = '';
    name.value = '';
    select.value = '0';
    this.modifyingUser = {};
    this.props.toggleModal();
  }

  render() {
    const { users } = this.props;
    return (
      <div styleName="wrap">
        <a className="button small" onClick={this.handleAddClick}>添加新用户</a>
        <table styleName="table">
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
                <td>{user.authority === 0 ? '普通用户' : '管理员'}</td>
                <td><a className="button alert tiny" styleName="btn" onClick={this.handleDeleteClick.bind(this, user.account)}>删除</a></td>
              </tr>);
            })
          }
          </tbody>
        </table>
        <Pagination total={Math.ceil(users.count / this.RECORDS_PER_PAGE)} curPage={users.current} toPage={this.handlePageChangeClick} />
        <Modal title={this.modalTitle} isShown={users.showModal} hideCancelButton={false} hideModal={this.hideModal} >
          <form styleName="form">
            <div className="row">
              <div className="small-3 columns">
                <label className="text-right middle">邮箱前缀：</label>
              </div>
              <div className="small-9 columns">
                <input type="text" ref="account" placeholder="corp邮箱前缀" />
              </div>
            </div>
            <div className="row">
              <div className="small-3 columns">
                <label className="text-right middle">姓名：</label>
              </div>
              <div className="small-9 columns">
                <input className="alert" type="text" ref="name" placeholder="姓名" />
              </div>
            </div>
            <div className="row">
              <div className="small-3 columns">
                <label className="text-right middle">权限：</label>
              </div>
              <div className="small-9 columns">
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
  users: PropTypes.object.isRequired,
  changePage: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  fetchUsers: PropTypes.func.isRequired,
  fetchUsersCount: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  addUser: PropTypes.func.isRequired,
};
function mapStateToProps(state) {
  const users = state.users;
  return {
    users,
  };
}
export default connect(mapStateToProps, usersActions)(Users);
