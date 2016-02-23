/**
 * Created by jruif on 16/2/19.
 */
import {UPDATE_APP_LIST,UPDATE_LIST_PAGINATION,UPDATE_LIST_PARAM} from './actionType'

export function updateList(value,name){
    if(name !== void 0){
        return {
            type:UPDATE_LIST_PAGINATION,
            value,
            name
        }
    }
    return {
        type:UPDATE_APP_LIST,
        value
    }
}

export function  updateParam(name,value){
    return {
        type:UPDATE_LIST_PARAM,
        name,
        value
    }
}