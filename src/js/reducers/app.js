/**
 * Created by jruif on 16/2/2.
 */

import extend from'lodash.assign';
import { REQUEST } from '../actions/actionType';

const INIT_STATE = {};
export default function create(state = INIT_STATE, action) {
  switch (action.type) {
    case REQUEST:
      return extend({}, state, {
        app: action.app
      });
    default:
      return state;
  }
}
