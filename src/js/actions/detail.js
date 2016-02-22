import * as type from './actionType';
import fetch from 'isomorphic-fetch';
import extend from 'lodash.assign';
import ajax from '../utils/fetch';

// 获取活动详情
export function loadDetail(id) {
  return (dispatch, getState) => {
    const detail = getState().details[id] || {};
    if (detail.id) {
      return detail;
    }

    return ajax({
      url: `http://localhost:3100/detail.json`
    })
    // return ajax({
    //   url: 'http://baoming.ws.netease.com/admin/competition/get',
    //   body: { cid: id }
    // })
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
      // return fetch('http://localhost:3000/bill.json')
      return ajax({
        url: `http://baoming.ws.netease.com/admin/competition/competitionReport`,
        body: { id }
      })
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
// 删除赛事
export function deleteMatch(id) {
  return (dispatch, getState) => {
    return ajax({
      url: 'http://baoming.ws.netease.com/admin/competition/delete',
      body: { id }
    })
    .then((json) => {
      dispatch({
        type: type.REQUEST_DETAIL,
        data: extend({}, getState().details[id], { state: 10 }),
        id
      })
    })
  }
}


function requestCodes(id, pageNum = 1, dispatch) {
  // return fetch(`http://localhost:3000/inviteCodes.json`)
  return ajax({
    url: `http://baoming.ws.netease.com/admin/invitecode/list`,
    body: { cid: id, pageNum }
  })
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
    return requestCodes(id, pageNum, dispatch);
  };
}
// 获取邀请码总数
export function fetchCodesCount(id) {
  return (dispatch) => {
    // return fetch(`http://localhost:3000/count.json`)
    return ajax({
      url: `http://baoming.ws.netease.com/admin/invitecode/totalCount`,
      body: { cid: id }
    })
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


// 生成邀请码
export function genCode(data) {
  return (dispatch, getState) => {
    // const URL = `http://localhost:3000/genCode.json?${transformRequest(extend({}, { nums: 1 }, data))}`;
    const count = getState().inviteCodes.count;
    // return fetch(`http://localhost:3000/inviteCodes.json`)
    const body = extend({}, { nums: 1 }, data)
    console.log(body)
    return ajax({
      url: `http://baoming.ws.netease.com/admin/invitecode/generateInvitecode`, 
      method: 'POST',
      body: body
    })
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

function requestParticipants(id, pageNum = 1, dispatch, getState) {
  return ajax({ url: `http://localhost:3100/participants.json` })
  // return ajax({
  //   url: `http://baoming.ws.netease.com/admin/signUp/list`,
  //   body: { cid: id, pageNum }
  // })
  .then((json) => {
    const participants = getState().participants;
    let temp = json.data;
    if (+participants.id === +id) {
      temp = [
        ...participants.data,
        ...json.data
      ]
    }
    dispatch({
      type: type.REQUEST_PARTICIPANTS,
      data: temp,
      id
    });
    return Promise.resolve(json);
  });
}

// 获取报名人
export function loadParticipants(id, pageNum) {
  return (dispatch, getState) => {
    return requestParticipants(id, pageNum, dispatch, getState);
  };
}

// 搜索报名人
export function searchParticipants(id, condition) {
  return (dispatch) => {
    // return fetch(`http://localhost:3000/search.json`)
    return ajax({
      url: `http://baoming.ws.netease.com/admin/signUp/search`,
      method: 'POST',
      body: {
        condition
      }
    })
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
    // return fetch(`http://localhost:3000/pcount.json`)
    return ajax({
      url: `http://baoming.ws.netease.com/admin/signUp/totalCount`,
      body: { cid: id }
    })
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

    // 判断当前是否处于搜索状态（searchResults长度大于0）
    // 若是，更改searchResults, 否则更改data
    const participants = searchResults.length > 0 ? searchResults : getState().participants.data;
    const count = getState().participants.count;
    dispatch({
      type: searchResults.length > 0 ? type.SEARCH_PARTICIPANTS : type.REQUEST_PARTICIPANTS,
      data: participants.map((person) => {
        if (person.id === pid) {
          const temp = extend({}, person, { state: 10 })
          return temp;
        }
        return person;
      }),
      id: cid
    });
    // return fetch(`http://localhost:3000/delete.json`)
    return ajax({
      url: `http://baoming.ws.netease.com/admin/signUp/delete?sid=${pid}`
    })
  }
}

// 报名人信息分页
export function changeParticipantsPage(next, recordsPerPage) {
  return (dispatch, getState) => {
    const { id, data } = getState().participants;
    const len = data.slice((next - 1) * recordsPerPage, next * recordsPerPage).length;
    if (len < recordsPerPage) {
      requestParticipants(id, next, dispatch, getState)
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
    return ajax({
      url: `http://baoming.ws.netease.com/admin/signUp/update`,
      method: 'POST',
      body: extend({}, { id }, data)
    })
  };
}
