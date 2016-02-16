
import extend from'lodash.assign';
import { REQUEST_DETAIL } from '../actions/actionType';

const INIT_STATE = {};
export function detail(state = INIT_STATE, action) {
  switch (action.type) {
    case REQUEST_DETAIL:
      return extend({}, state, {
        [action.data.id]: action.data
      });
    default:
      return state;
  }
}

export function users(state = INIT_STATE, action) {
  switch (action.type) {
    case REQUEST_DETAIL:
      return extend({}, state, {
        [action.data.id]: action.data
      });
    default:
      return state;
  }
}