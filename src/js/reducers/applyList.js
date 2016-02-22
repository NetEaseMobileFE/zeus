/**
 * Created by jruif on 16/2/2.
 */

import { UPDATE_APP_LIST } from '../actions/actionType';
import extend from 'lodash.assign';

const INIT_STATE = {
    param:{
        type:1,
        pageNum:1,
    },
    // 做个缓存,设个过期时间
    data:[
        {
            "id": 37,
            "type": 0,	//0赛事 or 1活动
            "name": "马拉松-1",	//赛事名称
            "account": "admin",	//创建人
            "gameStart": 1470377398000,	//赛事比赛开始时间
            "gameEnd": 1453810198000,	//赛事比赛结束时间
            "state": 7,	//赛事状态
            "weight": 50,	//赛事排序权重
            "surplusSignUpNum": 114, //报名剩余数
            "limitNum": 200,	//赛事参赛最大报名人数
            "signUpNum": 86,	//已报名人数
        },
        {
            "id": 36,
            "type": 0,
            "name": "2016北京马拉松",
            "account": "admin",
            "gameStart": 1453788604000,
            "gameEnd": 1453788604000,
            "state": 7,
            "weight": 50,
            "surplusSignUpNum": 114,
            "limitNum": 300,
            "signUpNum": 186
        }
    ]
};
export default function applyList(state = INIT_STATE, action) {
    switch (action.type) {
        case UPDATE_APP_LIST:
            return extend({}, state, {
                data: action.value
            });
        default:
            return state;
    }
}
