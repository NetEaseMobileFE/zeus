/**
 * Created by jruif on 16/2/25.
 */

import { UPDATE_RUNNING_PLAN_DATA, UPDATE_RUNNING_PLAN_ITEM } from '../actions/actionType';
import extend from 'lodash.assign';

const INIT_STATE = {
  topMenu: [],
  subMenu: [],
  content: []
};
export default function training(state = INIT_STATE, action) {
  switch (action.type) {
    case UPDATE_RUNNING_PLAN_DATA:
      return extend({}, state, {
        [action.name]: action.value
      });
    case UPDATE_RUNNING_PLAN_ITEM:
      return extend({}, state, {
        [action.name]: [
          ...state[action.name].slice(0, action.index),
          extend({}, state[action.name][action.index], action.value),
          ...state[action.name].slice(action.index + 1)
        ]
      });
    default:
      return state;
  }
}
