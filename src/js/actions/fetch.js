/**
 * Created by jruif on 16/2/2.
 *
 * 异步加载action
 * 与服务器异步通信最好能使用一个接口
 */
import fetch from 'isomorphic-fetch';
import extend from 'lodash.assign';

let url = '/admin/competition';
let $_ = {};

// $_.isObject(obj) => true / false
!function(){
    var type = ['Object','Function','Number','String','Array'];
    type.map((elm)=>{
        $_[`is${elm}`] = function(obj){
            return Object.prototype.toString.call(obj) === `[object ${elm}]`;
        }
    });
}();

function transformRequest(obj) {
    let str = [];
    Object.keys(obj).forEach((key) => {
        str.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
    });
    return str.join('&');
}

function stringifyJSON(obj){
    Object.keys(obj).forEach((key) => {
        let param = obj[key];
        if($_.isObject(param) || $_.isArray(param)){
            param = JSON.stringify(param);
            obj[key] = param;
        }
    });
    return JSON.stringify(obj);
}

export function ajax(opt) {
    const DEFAULT = {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    };
    let _opt = extend({}, opt);
    if(opt.url.indexOf(url) === -1){
        _opt.url = url + _opt.url;
    }
    return (dispatch, getState) => {
        let state = getState();
        let options = extend({}, DEFAULT, _opt);
        // todo..
        options.body = stringifyJSON(extend({},state.create));
        if (options.method === 'GET') {
            if (_opt.body) {
                _opt.url = `${options.url}?${transformRequest(options.body)}`;
            }
            options.body = void(0);
        }
        return fetch(_opt.url, options)
            .then((response) => {
                if (response.status >= 200 && response.status < 300 || response.status === 302) {
                    return response.json();
                } else {
                    let error = new Error('网络错误');
                    error.response = response;
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
                }
                let error = new Error(result.msg);
                error.response = result;
                throw error;
            })
            // .then(result => dispatch(receive(state.question, result)))
            .catch((fail) => {
                let error = new Error(fail);
                console.log(error);
            });
    };
}