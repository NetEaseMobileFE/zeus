/**
 * Created by jruif on 16/2/2.
 */

import { REQUEST } from '../actions/actionType'
import extend from'lodash.assign'
const init_state={};
export default function create(state = init_state,action){
    switch(action.type){
        case REQUEST:
            console.log(state);
            return extend({},state,{
                app:action.app
            });
        default:
            return state;
    }
}