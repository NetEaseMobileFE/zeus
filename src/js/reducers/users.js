import extend from'lodash.assign';
import * as actions from '../actions/actionType';
export default function users(state = { data: [], count: 0, current: 1, showModal: false, modifying: {} }, action) {
  switch (action.type) {
    case actions.REQUEST_USERS:
      return extend({}, state, {
        data: [
          ...state.data,
          ...action.data
        ]
      });
    case actions.SHOW_USERS:
      return extend({}, state, {
        current: action.current
      });
    case actions.REQUEST_USERS_COUNT:
      return extend({}, state, {
        count: action.count
      });
    case actions.ADD_USER:
      return extend({}, state, {
        count: state.count + 1,
        data: [
          action.data,
          ...state.data,
        ]
      });
    case actions.DELETE_USER:
      return extend({}, state, {
        count: state.count - 1,
        data: state.data.filter(user => user.account !== action.account)
      });
    case actions.TOGGLE_MODAL:
      return extend({}, state, {
        showModal: action.showModal
      });
    default:
      return state;
  }
}
