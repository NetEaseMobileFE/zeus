/**
 * Created by jruif on 16/2/2.
 *
 * 异步加载action
 * 与服务器异步通信最好能使用一个接口
 */
import fetch from 'isomorphic-fetch';
import extend from 'lodash.assign';
import * as modal from './modal';
import { transformRequest, stringifyJSON } from '../utils/tools'
//import checkLogin from '../utils/checkLogin';

let url = '/admin/competition';
export function ajax(opt,callback) {
    const DEFAULT = {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    };
    let _opt = extend({}, opt);
    if(opt.url.indexOf('admin/') === -1){
        _opt.url = url + _opt.url;
    }
    return (dispatch, getState) => {
        let state = getState();
        let options = extend({}, DEFAULT, _opt);

        // todo..
        switch(opt.queryType){
            case 'create':
                options.body = stringifyJSON(extend({},state.create));
                break;
            case 'applist':
                options.body = extend({},state.applyList.param);
                break;
            case 'other':
            case 'application-json':
                options.body = stringifyJSON(options.body);
                break;
            case 'application-www':
                options.body = transformRequest(options.body);
                break;
            default:
                break;
        }

        if (options.method === 'GET') {
            options.body = extend({},options.body,{_:Date.now()});
            _opt.url = `${options.url}?${transformRequest(options.body)}`;
            options.body = void(0);
        }

        return fetch(_opt.url, options)
            .then((response) => {
                if (response.status >= 200 && response.status < 300 || response.status === 302) {
                    return response.json();
                } else {
                    let error = new Error('网络错误');
                    error.response = extend({},response,{ msg : '网络错误' });
                    throw error;
                }
            })
            .then((result) => {
                /*
                 HTTP/1.1 200 OK
                 {
                 "code": 1,
                 "msg": null,
                 "data": ...
                 }
                 错误请求返回
                 {
                 "code": 3,
                 "msg": "server err",
                 "data": null
                 }
                 */
                if (result.code === 1) {
                    return result;
                }else if(result.code === 2){
                    result.msg = '参数错误'
                }else if(result.code === 3){
                    result.msg = '服务器错误'
                }
                let error = new Error(result.msg);
                error.response = result;
                throw error;
            })
            .then(callback && callback.bind(this) || function(rs){return rs;})
            .catch((fail) => {
                dispatch(modal.error(fail.response || {msg:'未知错误,请联系程序猿 或 刷新页面'}));
                console.error(fail);
            });
    };
}