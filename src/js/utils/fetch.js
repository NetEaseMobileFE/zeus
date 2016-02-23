import fetch from 'isomorphic-fetch';
import extend from 'lodash.assign';
import modal from '../actions/modal';

function transformRequest(obj) {
  let str = [];
  Object.keys(obj).forEach((key) => {
    str.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
  });
  return str.join('&');
}
function errorHanlder(fail, dispatch) {
  if (typeof dispatch === 'function') {
    dispatch(modal.error({ msg: `${fail.msg || '未知错误'}` })); 
  } else {
    alert(`${fail.msg || '未知错误'}`);
  }
  if (fail.code === 0) {
    setTimeout(function() {
      // window.location.href = 'http://baoming.ws.netease.com/login/login';
    }, 200);
  }
}
function checkLogin() {
  const cookies = '; ' + document.cookie;
  const name = 'userId';
  const parts = cookies.split('; ' + name + '=');
  let value = '';
  if (parts.length == 2) {
    value = parts.pop().split(';').shift(); 
  }
  return value;
}

export default function ajax(opt, dispatch) {

  const userName = checkLogin();
  if (!userName && window.location.hostname !== 'localhost') {
    errorHanlder({ code: 0, msg: '未登录，刷新页面' }, dispatch);
    return Promise.reject({ code: 0, msg: '未登录，刷新页面' });
  }

  let options = extend({}, {
    method: 'GET',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    }
  }, opt);
  if (options.method === 'GET' && options.body) {
    options.url = `${options.url}?${transformRequest(options.body)}`;
    options.body = void(0);
  }

  if (options.method === 'POST' && options.body) {
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
      errorHanlder(fail, dispatch);
      return Promise.reject(fail);
    });
}
