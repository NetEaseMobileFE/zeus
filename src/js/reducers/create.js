/**
 * Created by jruif on 16/2/2.
 */

import { ADD_ITEM,REMOVE_ITEM,UPDATE_ITEM,UPDATE_FORM } from '../actions/actionType';
import { extend,find } from 'lodash';

const time = Date.now();
const INIT_STATE = {
    "type": "1/2",
    "name": "马拉松",
    "signUpStart": time,
    "signUpEnd": time,
    "gameStart": time,
    "gameEnd": time,
    "items": [],
    "limitNum": 10000,
    "introduce": "",
    "disclaimer": "",
    "pictures": "",
    "requiredItems": [],
    "addItems": [],
    "weight": "",
    "display": "0/1",
    "transferAccount": ""
};
export default function create(state = INIT_STATE, action) {
    switch (action.type) {
        case ADD_ITEM:
            return extend({}, state, {
                [action.name]:[
                    ...state[action.name].slice(),
                    {
                        "name":"",
                        "price":""
                    }
                ]
            });
        case REMOVE_ITEM:
            return extend({}, state, {
                [action.name]:[
                    ...state[action.name].slice(0,action.index),
                    ...state[action.name].slice(action.index+1)
                ]
            });
        case UPDATE_ITEM:
            return extend({}, state, {
                [action.name]:[
                    ...state[action.name].slice(0,action.index),
                    extend({},state[action.name][action.index],{
                        "name":action.name,
                        "price":action.value
                    }),
                    ...state[action.name].slice(action.index+1)
                ]
            });
        case UPDATE_FORM:
            if(action.name === 'pictures'){
                let items = state.pictures.split(',');
                let has_item = null;
                items.forEach((elm)=>{
                    if( elm === action.value ) {
                        has_item = elm;
                    }
                });
                return extend({}, state, {
                    pictures: has_item ? items.filter((elm)=> elm != has_item).join(',') :
                        items.concat(action.value).join(',')
                });
            }
            return extend({}, state, {
                [action.name]:action.value
            });
        default:
            return state;
    }
}
