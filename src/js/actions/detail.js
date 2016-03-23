import * as type from './actionType';
import extend from 'lodash.assign';
import ajax from '../utils/fetch';
import errorHandler from '../utils/errorHandler';

// 获取活动详情
export function loadDetail(id) {
  return (dispatch) => {
    return ajax({
      url: 'http://baoming.ws.netease.com/admin/competition/get',
      body: { cid: id }
    })
    .then((json) => {
      dispatch({
        type: type.REQUEST_DETAIL,
        data: json.data,
        id
      });
    });
  };
}
// 修改活动详情
export function updateDetail(data) {
  return (dispatch) => {
    return ajax({
      url: 'http://baoming.ws.netease.com/admin/competition/update',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      }, 
      body: JSON.stringify(data)
    }).then((json) => {
      dispatch({
        type: type.REQUEST_DETAIL,
        data: { display: data.display },
        id: data.id,
      });
      return Promise.resolve(json);
    }).catch(errorHandler.bind(null, dispatch));
  };
}
// 显隐账单
export function toggleBill(id) {
  return (dispatch, getState) => {
    const showBill = getState().details.showBill;
    dispatch({
      type: type.TOGGLE_BILL,
      status: !showBill
    });
    if (!showBill) {
      // return ajax({ url: 'http://localhost:3100/bill.json'})
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
      }).catch(errorHandler.bind(null, dispatch));
    }
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
      });
      return Promise.resolve(json);
    }).catch(errorHandler.bind(null, dispatch));
  };
}


function requestCodes(id, pageNum = 1, dispatch) {
  // return ajax({ url: `http://localhost:3100/inviteCodes.json` })
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
  }).catch(errorHandler.bind(null, dispatch));
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
    // return ajax({ url: `http://localhost:3100/count.json` })
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
  return (dispatch) => {
    // return fetch(`http://localhost:3100/inviteCodes.json`)
    return ajax({
      url: `http://baoming.ws.netease.com/admin/invitecode/generateInvitecode`, 
      method: 'POST',
      body: extend({}, { nums: 1 }, data)
    })
    .then((json) => {
      dispatch({
        type: type.GENERATE_CODE,
        data: json.data,
        id: json.data[0].cid
      });
      return Promise.resolve(json);
    }).catch(errorHandler.bind(null, dispatch));
  };
}

// 获取报名人
function requestParticipants(id, pageNum = 1, dispatch, getState) {
  // return ajax({ url: `http://localhost:3100/participants.json` })
  return ajax({
    url: `http://baoming.ws.netease.com/admin/signUp/list`,
    body: { cid: id, pageNum }
  })
  .then((json) => {
    const participants = getState().participants;
    let temp = json.data;
    if (+participants.id === +id) {
      temp = [
        ...participants.data,
        ...json.data
      ];
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
    return requestParticipants(id, pageNum, dispatch, getState).catch(errorHandler.bind(null, dispatch));
  };
}

// 下载报名人信息
export function downloadParticipants(id) {
  return () => {
    window.open(`http://baoming.ws.netease.com/admin/competition/exportSignUp?cid=${id}`)
  }
}

// 搜索报名人
export function searchParticipants(id, condition) {
  return (dispatch) => {
    // return fetch(`http://localhost:3100/search.json`)
    return ajax({
      url: `http://baoming.ws.netease.com/admin/signUp/search`,
      method: 'POST',
      body: {
        cid: id,
        condition
      }
    })
    .then((json) => {
      dispatch({
        type: type.SEARCH_PARTICIPANTS,
        data: json.data
      });
      return Promise.resolve(json);
    }).catch(errorHandler.bind(null, dispatch));
  };
}
// 清除搜索结果
export function clearSearchResults() {
  return (dispatch) => {
    dispatch({
      type: type.CLEAR_RESULTS
    });
  };
}

// 获取报名人总数
export function fetchParticipantsCount(id) {
  return (dispatch) => {
    // return ajax(`http://localhost:3100/pcount.json`)
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
    const searchResults = getState().participants.searchResults;
    const participants = searchResults.length > 0 ? searchResults : getState().participants.data;
    dispatch({
      type: searchResults.length > 0 ? type.SEARCH_PARTICIPANTS : type.REQUEST_PARTICIPANTS,
      data: participants.map((person) => {
        if (person.id === pid) {
          const temp = extend({}, person, { state: 10 });
          return temp;
        }
        return person;
      }),
      id: cid
    });
    // return fetch(`http://localhost:3100/delete.json`)
    return ajax({
      url: `http://baoming.ws.netease.com/admin/signUp/delete?sid=${pid}`
    }).catch(errorHandler.bind(null, dispatch));
  };
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
    if (Object.keys(data).length === 0) {
      return Promise.resolve({});
    }
    dispatch({
      type: type.SAVE_INFO,
      id,
      data
    });
    return ajax({
      url: `http://baoming.ws.netease.com/admin/signUp/update`,
      method: 'POST',
      body: extend({}, { id }, data)
    }).catch(errorHandler.bind(null, dispatch));
  };
}
