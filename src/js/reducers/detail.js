
import extend from'lodash.assign';
import * as actions from '../actions/actionType';

const INIT_STATE = {};
export function details(state = {showBill: false, bill: []}, action) {
  switch (action.type) {
    case actions.REQUEST_DETAIL:
      return extend({}, state, {
        [action.data.id]: action.data
      });
    case actions.TOGGLE_BILL:
      return extend({}, state, {
        showBill: action.status
      })
    case actions.REQUEST_BILL:
      return extend({}, state, {
        bill: action.bill
      })
      
    default:
      return state;
  }
}

export function inviteCodes(state = {id: '', data: [], current: 1, count: 0}, action) {
  switch (action.type) {
    case actions.REQUEST_CODES:
      if (+state.id === +action.id) {
        return {
          id: action.id,
          data: [
            ...state.data,
            ...action.data
          ],
          current: state.current,
          count: state.count
        }
      }
      return {
        id: action.id,
        data: action.data,
        current: state.current,
        count: state.count
      }
    case actions.GENERATE_CODE: 
      return extend({}, state, {
        data: [
          ...action.data,
          ...state.data
        ]
      })
    case actions.REQUEST_CODES_COUNT:
      return extend({}, state, {
        count: action.count
      })
    case actions.SHOW_CODES:
      return extend({}, state, {
        current: action.current 
      })
    default:
      return state;
  }
}

export function participants(state = {id: '', data: [], current: 1, count: 0}, action) {
  switch (action.type) {
    case actions.REQUEST_PARTICIPANTS:
      if (state.id === action.id) {
        return extend({}, state, {
          data: [
            ...state.data,
            ...action.data
          ]
        })
      }
      return extend({}, state, {
        id: action.id,
        data: action.data
      })
    case actions.REQUEST_PARTICIPANTS_COUNT:
      return extend({}, state, {
        count: action.data
      })
    case actions.SHOW_PARTICIPANTS:
      return extend({}, state, {
        current: action.current
      })
    case actions.EXPAND_INFO:
      return extend({}, state, {
        expandId: action.id
      })
    case actions.EDIT_INFO:
      return extend({}, state, {
        editId: action.id
      })
    case actions.SAVE_INFO:
      return extend({}, state, {
        data: state.data.map((item) => {
          if (item.id === action.id) {
            return extend({}, item, action.data);
          }
          return item;
        })
      })
    case actions.UPDATE_TEMP_INFO:
      return extend({}, state, {
        tempInfo: extend({}, state.tempInfo, action.data)
      })
    default:
      return state;
  }
}