/**
 * Created by jruif on 16/2/25.
 */
import makeActionCreator from '../utils/makeActionCreator';
import {UPDATE_RUNNING_PLAN_DATA} from './actionType';

export const updateValue = makeActionCreator(UPDATE_RUNNING_PLAN_DATA,'name','value');

//export function updateTopTitle(value){
//    return {
//        type:UPDATE_TOPTITLE,
//        value
//    }
//}
//
//export function updatePerTopData(value){
//    return {
//        type:UPDATE_PER_TOP_DATA,
//        value
//    }
//}
//
//export function updateValue(name,value){
//    return {
//        type:UPDATE_RUNNING_PLAN_DATA,
//        name,
//        value
//    }
//}
