/**
 * Created by jruif on 16/2/19.
 */
import {UPDATE_APP_LIST} from './actionType'

export function updateList(value){
    return {
        type:UPDATE_APP_LIST,
        value
    }
}