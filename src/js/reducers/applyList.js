/**
 * Created by jruif on 16/2/2.
 */

import { REQUEST } from '../actions/actionType'
import extend from'lodash.assign'

const init_state={};
export default function applyList(state = init_state,action){
    switch(action.type){
        case REQUEST:
            return Object.assign({},state,{
                applyList:action.list
            });
        default:
            return state;
    }
}