/**
 * Created by jruif on 16/2/2.
 *
 * AJAX
 */
import fetch from 'isomorphic-fetch';
import extend from 'lodash.assign';

function transformRequest(obj) {
  let str = [];
  Object.keys(obj).forEach((key) => {
    str.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
  });
  return str.join('&');
}

export function ajax(opt) {
  const DEFAULT = {
    method: 'GET',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  let _opt = extend({}, opt);
  return () => {
    let options = extend({}, DEFAULT, _opt);
    // todo..
    if (options.method === 'GET') {
      if (_opt.body) {
        _opt.url = `options.url?t=${Date.now()}&${transformRequest(options.body)}`;
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
      .catch((fail) => {
        console.log(fail);
        let error = new Error(fail);
        throw error
      });
  };
}
