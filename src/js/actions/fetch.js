/**
 * Created by jruif on 16/2/2.
 *
 * 异步加载action
 * 与服务器异步通信最好能使用一个接口
 */
import fetch from 'isomorphic-fetch'
import extend from 'lodash.assign'

function transformRequest(obj) {
    var str = [];
    Object.keys(obj).forEach(elm =>
        str.push(encodeURIComponent(elm) + "=" + encodeURIComponent(obj[elm])));
    return str.join("&");
}

export function Ajax(opt) {
    var DEFAULT = {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    opt = opt || {};
    return function (dispatch, getState) {
        let state = getState(),
            options = extend({},DEFAULT,opt);
        // todo..
        if (options.method === 'GET') {
            if (opt.body) {
                opt.url = options.url + '?t=' + Date.now() + '&' + transformRequest(options.body)
            }
            options.body = void(0);
        }
        return fetch(opt.url, options)
                .then(function(response){
                    if(response.status >=200 && response.status<300 || response.status===302){
                        return response.json()
                    }else{
                        let error = new Error('网络错误');
                        error.response = response;
                        throw error;
                    }
                })
                .then(function (result) {
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
                //.then(result => dispatch(receive(state.question, result)))
                .catch(function(fail){
                    console.log(fail);
                    dispatch(error(fail));
                });
    }
}