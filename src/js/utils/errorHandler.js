import * as modal from '../actions/modal';

export default function errorHanlder(dispatch, fail) {
  debugger
  dispatch(modal.error({ msg: `${fail.msg}` })); 
  if (fail.code === -1) {
    setTimeout(function() {
      // window.location.href = 'http://baoming.ws.netease.com/login/login'; 
    }, 300);
  }
  const error = new Error(fail);
  throw error;
}