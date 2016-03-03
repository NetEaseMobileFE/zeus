/**
 * Created by jruif on 16/2/29.
 */

let $_ = {};

// $_.isObject(obj) => true / false
const type = ['Object', 'Function', 'Number', 'String', 'Array'];
type.map((elm) => {
  $_[`is${elm}`] = (obj) => {
    return Object.prototype.toString.call(obj) === `[object ${elm}]`;
  };
});

export function transformRequest(obj) {
  let str = [];
  Object.keys(obj).forEach((key) => {
    str.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
  });
  return str.join('&');
}

export function stringifyJSON(obj) {
  let _obj = obj;
  Object.keys(_obj).forEach((key) => {
    let param = _obj[key];
    if ($_.isObject(param) || $_.isArray(param)) {
      param = JSON.stringify(param);
      _obj[key] = param;
    }
  });
  return JSON.stringify(_obj);
}
