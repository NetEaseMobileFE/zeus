/**
 * Created by jruif on 16/2/2.
 */

import { UPDATE_APP_LIST,UPDATE_LIST_PAGINATION,UPDATE_LIST_PARAM } from '../actions/actionType';
import extend from 'lodash.assign';

const INIT_STATE = {
    param:{
        type:'',
        pageNum:1,
        name:''
    },
    pagination:null,
    // 做个缓存,设个过期时间
    data:[]
};
export default function applyList(state = INIT_STATE, action) {
    switch (action.type) {
        case UPDATE_LIST_PARAM:
            return extend({}, state,
                {param: extend({},state.param,{
                    [action.name]:action.value
                })}
            );
        case UPDATE_APP_LIST:
            return extend({}, state, {
                data: action.value
            });
        case UPDATE_LIST_PAGINATION:
            return extend({},state,{
                pagination:action.value
            });
        default:
            return state;
    }
}
