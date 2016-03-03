/**
 * Created by jruif on 16/2/19.
 */

import actionCreate from '../utils/makeActionCreator';
import { UPDATE_APP_LIST, UPDATE_PAGE, UPDATE_LIST_PARAM, UPDATE_DATA } from './actionType';

export const updateParam = actionCreate(UPDATE_LIST_PARAM, 'name', 'value');
export const updateData = actionCreate(UPDATE_DATA, 'value', 'index');

export function updateList(value, name) {
  if (name !== void 0) {
    return {
      type: UPDATE_PAGE,
      value,
      name
    };
  }
  return {
    type: UPDATE_APP_LIST,
    value
  };
}
