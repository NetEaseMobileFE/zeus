/**
 * Created by jruif on 16/2/2.
 */
import * as type from './actionType';
import fetch from 'isomorphic-fetch';

export function login() {
  return {
    type: type.REQUEST,
    app: {
      name: 'netEase',
    },
  };
}

export function loadDetail(id) {
  return (dispatch, getState) => {
    const detail = getState().details[id] || {};
    if (detail.id){
      return detail
    }

    return fetch(`http://localhost:3000/detail.json`)
      .then(response => {
        return response.json()
      })
      .then((json) => {
        dispatch({
          type: type.REQUEST_DETAIL,
          data: json.data
        })
      })
  }
}
