/**
 * Created by jruif on 16/2/18.
 */

import { REQUEST,RECEIVE,ERROR,MODAL_OK,MODAL_CANCEL } from '../actions/actionType'
const INIT_STATE={
    isFetching:false,
    didInvalidate: false,
    msg:'',
    modal:{}
};

export default function modal(state = INIT_STATE,action){
    switch (action.type){

        case MODAL_CANCEL:
            return Object.assign({}, state, {
                didInvalidate:action.didInvalidate
            });
        case REQUEST:
            return Object.assign({}, state, {
                isFetching: true
            });
        case RECEIVE:
            return state.type === COUNT ? Object.assign({}, state, {count: action.result.data}) :
                Object.assign({}, state, {
                    isFetching: false,
                    isSubmitReply: false,
                    data: Array.isArray(action.result.data)&&action.result.data || mergeData(state, action),
                    msg:action.result.message
                });
        case ERROR:
            return Object.assign({}, state, {
                isFetching: false,
                isSubmitReply: false,
                msg:action.result.message,
                didInvalidate:true,
                modal:{
                    type:'alert',
                    onOk:action.modal.onOk,
                    onCancel:action.modal.onCancel
                }
            });
        default :
            return state;
    }
}