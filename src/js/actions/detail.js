import * as type from './actionType';
import fetch from 'isomorphic-fetch';
import extend from 'lodash.assign';

// 获取活动详情
export function loadDetail(id) {
  return (dispatch, getState) => {
    const detail = getState().details[id] || {};
    if (detail.id) {
      return detail;
    }

    return fetch(`http://localhost:3000/detail.json`)
    // return fetch(`http://baoming.ws.netease.com/admin/competition/get?cid=${id}`)
      .then(response => response.json())
      .then((json) => {
        dispatch({
          type: type.REQUEST_DETAIL,
          data: json.data,
          id
        });
        return Promise.resolve(json);
      });
  };
}

// 显隐账单
export function toggleBill(id) {
  return (dispatch, getState) => {
    const showBill = getState().details.showBill;
    if (!showBill) {
      return fetch('http://localhost:3000/bill.json')
        .then(response => response.json())
        .then((json) => {
          dispatch({
            type: type.REQUEST_BILL,
            bill: json.data
          });
          return Promise.resolve(json);
        });
    }
    dispatch({
      type: type.TOGGLE_BILL,
      status: !showBill
    });
  };
}
function requestCodes(id, pageNum = 1, dispatch) {
  return fetch(`http://localhost:3000/inviteCodes.json`)
    .then(response => response.json())
    .then((json) => {
      dispatch({
        type: type.REQUEST_CODES,
        data: json.data,
        id
      });
      return Promise.resolve(json);
    });
}

// 获取邀请码
export function loadInviteCodes(id, pageNum) {
  return (dispatch) => {
    // return fetch(`http://localhost:3000/inviteCodes.json`)
    return requestCodes(id, pageNum, dispatch);
  };
}
// 获取邀请码总数
export function fetchCodesCount(id) {
  return (dispatch) => {
    return fetch(`http://localhost:3000/count.json`)
      .then(response => response.json())
      .then((json) => {
        dispatch({
          type: type.REQUEST_CODES_COUNT,
          count: json.data
        });
        return Promise.resolve(json);
      });
  };
}
// 邀请码分页
export function changeCodesPage(next, recordsPerPage) {
  return (dispatch, getState) => {
    const { id, data } = getState().inviteCodes;
    const len = data.slice((next - 1) * recordsPerPage, next * recordsPerPage).length;
    if (len < recordsPerPage) {
      requestCodes(id, next, dispatch)
        .then(() => {
          dispatch({
            type: type.SHOW_CODES,
            current: next
          });
          return Promise.resolve({});
        });
    } else {
      dispatch({
        type: type.SHOW_CODES,
        current: next
      });
    }
  };
}


function transformRequest(obj) {
  let str = [];
  Object.keys(obj).forEach((key) => {
    str.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
  });
  return str.join('&');
}
// 生成邀请码
export function genCode(data) {
  return (dispatch, getState) => {
    const URL = `http://localhost:3000/genCode.json?${transformRequest(extend({}, { nums: 1 }, data))}`;
    const count = getState().inviteCodes.count;
    // return fetch(`http://localhost:3000/inviteCodes.json`)
    return fetch(URL, {
      // url: `http://helloworld.com/admin/invitecode/generateInvitecode`, 
      // method: 'POST',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    }).then(response => response.json())
      .then((json) => {
        dispatch({
          type: type.GENERATE_CODE,
          data: json.data,
          id: json.data[0].cid
        });
        dispatch({
          type: type.REQUEST_CODES_COUNT,
          count: count + 1
        });
      });
  };
}

function requestParticipants(id, pageNum = 1, dispatch) {
  return fetch(`http://localhost:3000/participants.json`)
    .then(response => response.json())
    .then((json) => {
      dispatch({
        type: type.REQUEST_PARTICIPANTS,
        data: json.data,
        id
      });
      return Promise.resolve(json);
    });
}

// 获取报名人
export function loadParticipants(id, pageNum) {
  return (dispatch) => {
    return requestParticipants(id, pageNum, dispatch);
  };
}

// 搜索报名人
export function searchParticipants(id, condition) {
  return (dispatch) => {
    return fetch(`http://localhost:3000/search.json`)
      .then(response => response.json())
      .then((json) => {
        dispatch({
          type: type.SEARCH_PARTICIPANTS,
          data: json.data
        });
        return Promise.resolve(json);
      });
  }
}
// 清除搜索结果
export function clearSearchResults() {
  return (dispatch) => {
    dispatch({
      type: type.CLEAR_RESULTS
    });
  }
}

// 获取报名人总数
export function fetchParticipantsCount(id) {
  return (dispatch) => {
    return fetch(`http://localhost:3000/pcount.json`)
      .then(response => response.json())
      .then((json) => {
        dispatch({
          type: type.REQUEST_PARTICIPANTS_COUNT,
          data: json.data
        });
        return Promise.resolve(json);
      });
  };
}
// 更改报名人总数
export function changeParticipantsCount(delta) {
  return (dispatch, getState) => {
    const count = getState().participants.count;
    dispatch({
      type: type.REQUEST_PARTICIPANTS_COUNT,
      data: count + delta
    });
  };
}
// 删除报名人
export function deleteParticipant(cid, pid) {
  return (dispatch, getState) => {
    const participants = getState().participants.data;
    const count = getState().participants.count;
    dispatch({
      type: type.REQUEST_PARTICIPANTS,
      data: participants.filter((person) => {
        return person.id !== pid;
      }),
      id: cid
    });
    dispatch({
      type: type.REQUEST_PARTICIPANTS_COUNT,
      data: count - 1
    });
    return fetch(`http://localhost:3000/delete.json`)
      .then(response => { response.json() });
  }
}

// 报名人信息分页
export function changeParticipantsPage(next, recordsPerPage) {
  return (dispatch, getState) => {
    const { id, data } = getState().participants;
    const len = data.slice((next - 1) * recordsPerPage, next * recordsPerPage).length;
    if (len < recordsPerPage) {
      requestParticipants(id, next, dispatch)
        .then(() => {
          dispatch({
            type: type.SHOW_PARTICIPANTS,
            current: next
          });
        });
    } else {
      dispatch({
        type: type.SHOW_PARTICIPANTS,
        current: next
      });
    }
  };
}

// 展开报名人信息
export function expandInfo(id) {
  return (dispatch) => {
    dispatch({
      type: type.EXPAND_INFO,
      id
    });
  };
}

// 编辑报名人信息
export function editInfo(id) {
  return (dispatch) => {
    dispatch({
      type: type.EDIT_INFO,
      id
    });
  };
}

// 保存报名人信息
export function saveInfo(id, data) {
  return (dispatch) => {
    console.log(data);
    dispatch({
      type: type.SAVE_INFO,
      id,
      data
    });
  };
}
