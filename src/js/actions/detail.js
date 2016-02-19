import * as type from './actionType';
import fetch from 'isomorphic-fetch';
import { ajax } from './fetch';
import extend from 'lodash.assign';

// 获取活动详情
export function loadDetail(id) {
  return (dispatch, getState) => {
    const detail = getState().details[id] || {};
    if (detail.id){
      return detail
    }

    return fetch(`http://localhost:3000/detail.json`)
    // return fetch(`http://baoming.ws.netease.com/admin/competition/get?cid=${id}`)
      .then(response => response.json())
      .then((json) => {
        dispatch({
          type: type.REQUEST_DETAIL,
          data: json.data,
          id
        })
      })
  }
}

// 显隐账单
export function toggleBill(id) {
  return (dispatch, getState) => {
      const showBill = getState().detail.showBill;
      if (!showBill) {
        return fetch('http://localhost:3000/bill.json')
          .then(response => response.json())
          .then((json) => {
            dispatch({
              type: type.REQUEST_BILL,
              bill: json.data
            })
          })
      }
      dispatch({
        type: type.TOGGLE_BILL,
        status: !showBill
      })
  }
}
function requestCodes(id, pageNum = 1, dispatch) {
  return fetch(`http://localhost:3000/inviteCodes.json`)
    .then(response => response.json())
    .then((json) =>{
      dispatch({
        type: type.REQUEST_CODES,
        data: json.data,
        id
      })
      return Promise.resolve(json)
    })
}

// 获取邀请码
export function loadInviteCodes(id, pageNum) {
  return (dispatch, getState) => {
    // return fetch(`http://localhost:3000/inviteCodes.json`)
    return requestCodes(id, pageNum, dispatch)
  }
}
// 获取邀请码总数
export function fetchCodesCount(id) {
  return (dispatch, getState) => {
    return fetch(`http://localhost:3000/count.json`)
      .then(response => response.json())
      .then((json) => {
        dispatch({
          type: type.REQUEST_CODES_COUNT,
          count: json.data
        })
      })
  }
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
          })
        })
    } else {
      dispatch({
        type: type.SHOW_CODES,
        current: next
      })
    }
  }
}


function transformRequest(obj) {
  let str = [];
  Object.keys(obj).forEach((key) => {
    str.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
  });
  return str.join('&');
}
// 生成邀请码
export function genCode(data){
  return (dispatch, getState) => {
    const URL = `http://localhost:3000/genCode.json?${transformRequest(extend({}, { nums: 1 }, data))}`;
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
        })
      })
  }
}

function requestParticipants(id, pageNum = 1, dispatch) {
  return fetch(`http://localhost:3000/participants.json`)
    .then(response => response.json())
    .then((json) =>{
      dispatch({
        type: type.REQUEST_PARTICIPANTS,
        data: json.data,
        id
      })
      return Promise.resolve(json)
    })
}

// 获取报名人
export function loadParticipants(id, pageNum) {
  return (dispatch, getState) => {
    return requestParticipants(id, pageNum, dispatch)
  }
}
// 获取报名人总数
export function fetchJoinersCount(id) {
  return (dispatch, getState) => {
    return fetch(`http://localhost:3000/pcount.json`)
      .then(response => response.json())
      .then((json) =>{
        dispatch({
          type: type.REQUEST_PARTICIPANTS_COUNT,
          data: json.data
        })
      })
  }
}

// 报名人信息分页
export function changeJoinersPage(next, recordsPerPage) {
  return (dispatch, getState) => {
    const { id, data } = getState().participants;
    const len = data.slice((next - 1) * recordsPerPage, next * recordsPerPage).length;
    if (len < recordsPerPage) {
      requestParticipants(id, next, dispatch)
        .then(() => {
          dispatch({
            type: type.SHOW_PARTICIPANTS,
            current: next
          })
        })
    } else {
      dispatch({
        type: type.SHOW_PARTICIPANTS,
        current: next
      })
    }
  }
}


// 展开报名人信息
export function expandInfo(id) {
  return (dispatch) => {
    dispatch({
      type: type.EXPAND_INFO,
      id
    })
  }
}

// 编辑报名人信息
export function editInfo(id) {
  return (dispatch) => {
    dispatch({
      type: type.EDIT_INFO,
      id
    })
  }
}

// 更新临时信息
export function updateTempInfo(data) {
  return (dispatch) => {
    dispatch({
      type: type.UPDATE_TEMP_INFO,
      data
    })
  }
}

// 保存报名人信息
export function saveInfo(id, data) {
  return (dispatch) => {
    dispatch({
      type: type.SAVE_INFO,
      id,
      data
    })
  }
}