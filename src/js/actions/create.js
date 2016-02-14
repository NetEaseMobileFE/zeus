/**
 * Created by jruif on 16/2/14.
 */
import {ADD_ITEM,REMOVE_ITEM,UPDATE_ITEM,UPDATE_FORM} from './actionType'

export function addItem(name){
    return {
        type:ADD_ITEM,
        name
    }
}

export function removeItem(index){
    return {
        type:REMOVE_ITEM,
        index
    }
}

export function updateForm(name,value,index){
    if (index !== void 0){
        return {
            type:UPDATE_ITEM,
            name,
            value,
            index
        }
    }
    return {
        type:UPDATE_FORM,
        name,
        value
    }
}
