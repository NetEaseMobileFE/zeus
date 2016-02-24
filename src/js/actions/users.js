import * as type from './actionType';
import extend from 'lodash.assign';
import ajax from '../utils/fetch';
import errorHandler from '../utils/errorHandler';

// 获取管理员列表
export function fetchUsers() {
  return (dispatch) => {
    return ajax({
      url: 'http://localhost:3100/users.json'
    }).then((json) => {
      dispatch({
        type: type.REQUEST_USERS,
        data: json.data
      });
    }).catch(errorHandler.bind(null, dispatch));
  };
}

// 获取管理员总数
export function fetchUsersCount() {
  return (dispatch) => {
    return ajax({
      url: 'http://localhost:3100/userCount.json'
    }).then((json) => {
      dispatch({
        type: type.REQUEST_USERS_COUNT,
        count: json.data
      });
    });
  };
}

// 添加管理员
export function addUser(data = { account: '', name: ''}) {
  return (dispatch, getState) => {
    return ajax({
      url: 'http://localhost:3100/addUser.json',
      // method: 'POST',
      body: data
    }).then((json) => {
      dispatch({
        type: type.ADD_USER,
        data,
      });
    });
  };
}

// 删除管理员
export function deleteUser(data = { account: '' }) {
  return (dispatch, getState) => {
    const count = getState().users.count;
    return ajax({
      url: 'http://localhost:3100/addUser.json',
      // method: 'POST',
      body: data
    }).then((json) => {
      dispatch({
        type: type.ADD_USER,
        count: count + 1,
      });
    });
  };
}

