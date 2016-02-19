/**
 * Created by jruif on 16/2/18.
 */

import { REQUEST,RECEIVE,SUCCESS,ERROR,MODAL_OK,MODAL_CANCEL } from '../actions/actionType'

export function modal_ok(){
    return{
        type:MODAL_OK,
        didInvalidate:false
    }
}

export function modal_cancel(){
    return{
        type:MODAL_CANCEL,
        didInvalidate:false
    }
}

export function request(question) {
    return {
        type: REQUEST,
        question
    }
}
export function receive(question, result) {
    return {
        type: RECEIVE,
        question,
        result
    }
}
export function success(result,onOk=function(){},onCancel=function(){}) {
    return {
        type: SUCCESS,
        result,
        modal:{
            onOk,
            onCancel
        }
    }
}
export function error(result,onOk=function(){},onCancel=function(){}) {
    return {
        type: ERROR,
        result,
        modal:{
            onOk,
            onCancel
        }
    }
}