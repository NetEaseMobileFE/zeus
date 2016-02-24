import fetch from 'isomorphic-fetch';
import extend from 'lodash.assign';
import checkLogin from './checkLogin';
function transformRequest(obj) {
  let str = [];
  Object.keys(obj).forEach((key) => {
    str.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
  });
  return str.join('&');
}

export default function ajax(opt, dispatch) {
  const userName = checkLogin();
  if (!userName && window.location.hostname !== 'localhost') {
    return Promise.reject({ code: -1, msg: '未登录，刷新页面' });
  }

  let options = extend({}, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    }
  }, opt);
  if (options.method === 'GET' && options.body) {
    options.url = `${options.url}?${transformRequest(options.body)}`;
    options.body = void(0);
  }

  if (options.method === 'POST' && typeof options.body === 'object') {
    options.body = transformRequest(options.body);
  }

  return fetch(options.url, options)
    .then((response) => {
      if (response.status >= 200 && response.status < 300 || response.status === 302) {
        return response.json();
      } else {
        return Promise.reject({ code: 6, msg: '网络错误' });
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
        return Promise.resolve(result);
      }
      return Promise.reject(result);
    })
    .catch((fail) => {
      return Promise.reject(fail);
    });
}
