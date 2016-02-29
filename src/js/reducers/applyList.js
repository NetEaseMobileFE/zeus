/**
 * Created by jruif on 16/2/2.
 */

import { UPDATE_APP_LIST,UPDATE_PAGE,UPDATE_LIST_PARAM,UPDATE_DATA } from '../actions/actionType';
import extend from 'lodash.assign';

const INIT_STATE = {
    is_search:false,
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
        case UPDATE_PAGE:
            return extend({},state,{
                [action.name]:action.value
            });
        case UPDATE_DATA:
            return extend({},state,{
                data:[
                    ...state.data.slice(0,action.index),
                    extend(state.data[action.index],{weight:action.value}),
                    ...state.data.slice(action.index+1)
                ]
            });
        default:
            return state;
    }
}
