/**
 * Created by jruif on 16/2/2.
 */

import { ADD_ITEM, REMOVE_ITEM, UPDATE_ITEM, UPDATE_FORM, RESET, MODIFICATION_INIT } from '../actions/actionType';
import extend from 'lodash.assign';

const INIT_STATE = {
  type: 0,
  name: '',
  signUpStart: null,
  signUpEnd: null,
  gameStart: null,
  gameEnd: null,
  siteUrl: '',
  items: [],
  limitNum: '',
  introduce: '',
  disclaimer: '',
  pictures: [],
  requiredItems: {},
  addItems: {},
  weight: 50,
  display: 1,
  defaultTenant: '0',
  tenantAccount: '',
  privkey: '',
  publickey: '',
  plateformId: ''
};
export default function create(state = INIT_STATE, action) {
  switch (action.type) {
    case ADD_ITEM:
      return extend({}, state, {
        [action.name]: [
          ...state[action.name].slice(),
          action.value
        ]
      });
    case REMOVE_ITEM:
      return extend({}, state, {
        [action.name]: [
          ...state[action.name].slice(0, action.index),
          ...state[action.name].slice(action.index + 1)
        ]
      });
    case UPDATE_ITEM:
      return extend({}, state, {
        [action.name]: [
          ...state[action.name].slice(0, action.index),
          extend({}, state[action.name][action.index], action.value),
          ...state[action.name].slice(action.index + 1)
        ]
      });
    case UPDATE_FORM:
      return extend({}, state, {
        [action.name]: action.value
      });
    case MODIFICATION_INIT:
      return extend({}, state, action.value);
    case RESET:
      return INIT_STATE;
    default:
      return state;
  }
}
