/**
 * Created by jruif on 16/2/18.
 */

import { REQUEST, RECEIVE, SUCCESS, ERROR, MODAL_CANCEL } from '../actions/actionType';
import extend from 'lodash.assign';
const INIT_STATE = {
  isFetching: false,   // 是否正在请求
  didInvalidate: false,  // 使无效
  msg: '', // 错误信息
  config: {}  // modal相关
};

export default function modal(state = INIT_STATE, action) {
  switch (action.type) {
    case MODAL_CANCEL:
      return extend({}, state, {
        didInvalidate: action.didInvalidate
      });
    case REQUEST:
      return extend({}, state, {
        isFetching: true
      });
    case RECEIVE:
      return extend({}, state, {
        isFetching: false,
        msg: action.msg
      });
    case SUCCESS:
    case ERROR:
      return extend({}, state, {
        isFetching: false,
        msg: action.type === SUCCESS ? '成功' : action.result.msg,
        didInvalidate: true,
        config: {
          type: 'alert',
          onOk: action.modal.onOk,
          onCancel: action.modal.onCancel
        }
      });
    default :
      return state;
  }
}
