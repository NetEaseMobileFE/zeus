/**
 * Created by jruif on 16/2/25.
 */

import { UPDATE_RUNNING_PLAN_DATA,UPDATE_ITEM } from '../actions/actionType';
import extend from 'lodash.assign';

const INIT_STATE = {
    topTitle:[],
    data:[]
};
export default function training(state = INIT_STATE,action){
    switch (action.type){
        case UPDATE_RUNNING_PLAN_DATA:
            return extend({},state,{
                [action.name]:action.value
            });
        default:
            return state;
    }
}