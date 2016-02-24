import extend from'lodash.assign';
import * as actions from '../actions/actionType';
import moment from 'moment';
export default function users(state = { data: [], count: 0, showModal: false, modifying: {} }, action) {
  switch (action.type) {
    case actions.REQUEST_USERS:
      return extend({}, state, {
        data: [
          ...state.data,
          ...action.data
        ]
      });
    case actions.REQUEST_USERS_COUNT:
      return extend({}, state, {
        count: action.count
      });
    case actions.REQUEADD_USERST_BILL:
      return extend({}, state, {
        count: state.count + 1,
        data: [
          action.data,
          ...state.data
        ]
      });
    case actions.TOGGLE_MODAL:
      return extend({}, state, {
        showModal: action.showModal
      });
    default:
      return state;
  }
}