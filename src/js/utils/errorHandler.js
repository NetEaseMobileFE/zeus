import * as modal from '../actions/modal';

export default function errorHanlder(dispatch, fail) {
  dispatch(modal.error({ msg: `${fail.msg}` })); 
  if (fail.code === -1 && window.location.hostname !== 'localhost') {
    setTimeout(() => {
      window.location.href = 'http://baoming.ws.netease.com/login/login'; 
    }, 500);
  }
  const error = new Error(fail);
  throw error;
}
