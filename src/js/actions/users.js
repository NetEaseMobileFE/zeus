import * as type from './actionType';
import extend from 'lodash.assign';
import ajax from '../utils/fetch';
import errorHandler from '../utils/errorHandler';

function loadUsers(pageNum = 1, dispatch) {
  return ajax({
    url: 'http://baoming.ws.netease.com/admin/permissions/list',
    body: { pageNum }
  })
  .then((json) => {
    dispatch({
      type: type.REQUEST_USERS,
      data: json.data,
    });
    return Promise.resolve(json);
  }).catch(errorHandler.bind(null, dispatch));
}

// 获取管理员列表
export function fetchUsers(pageNum = 1) {
  return (dispatch) => {
    return loadUsers(pageNum, dispatch);
  };
}

// 分页
export function changePage(next, recordsPerPage) {
  return (dispatch, getState) => {
    const { data } = getState().users;
    const len = data.slice((next - 1) * recordsPerPage, next * recordsPerPage).length;
    if (len < recordsPerPage) {
      loadUsers(next, dispatch)
        .then(() => {
          dispatch({
            type: type.SHOW_USERS,
            current: next
          });
          return Promise.resolve({});
        });
    } else {
      dispatch({
        type: type.SHOW_USERS,
        current: next
      });
    }
  }

}

// 获取管理员总数
export function fetchUsersCount() {
  return (dispatch) => {
    return ajax({
      url: 'http://baoming.ws.netease.com/admin/permissions/totalCount'
    }).then((json) => {
      dispatch({
        type: type.REQUEST_USERS_COUNT,
        count: json.data
      });
    });
  };
}

// 打开或关闭添加管理员对话框
export function toggleModal() {
  return (dispatch, getState) => {
    const showModal = getState().users.showModal;
    dispatch({
      type: type.TOGGLE_MODAL,
      showModal: !showModal
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
    }).catch(errorHandler.bind(null, dispatch));
  };
}
// 修改管理员
export function modifyUser(data = { account: '', name: ''}) {
  return (dispatch) => {
    dispatch({
      type: type.MODIFY_USER,
      modifying: data
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
        type: type.DELETE_USER,
        count: count - 1,
      });
    }).catch(errorHandler.bind(null, dispatch));
  };
}

