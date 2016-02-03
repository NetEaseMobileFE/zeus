/**
 * Created by jruif on 16/2/2.
 */

import { REQUEST } from '../actions/actionType';
import extend from 'lodash.assign';

const INIT_STATE = {};
export default function applyList(state = INIT_STATE, action) {
  switch (action.type) {
    case REQUEST:
      return extend({}, state, {
        applyList: action.list,
      });
    default:
      return state;
  }
}
