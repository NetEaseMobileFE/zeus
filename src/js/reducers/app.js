/**
 * Created by jruif on 16/2/2.
 */

import extend from'lodash.assign'
import { REQUEST } from '../actions/actionType'

const init_state={};
export default function create(state = init_state,action){
    switch(action.type){
        case REQUEST:
            return extend({},state,{
                app:action.app
            });
        default:
            return state;
    }
}