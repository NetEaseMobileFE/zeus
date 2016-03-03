/**
 * Created by jruif on 16/2/2.
 */
import * as type from './actionType';
export function login() {
  return {
    type: type.REQUEST,
    app: {
      name: 'netEase',
    },
  };
}

export function loadingStart() {

}

export function loadingEnd() {

}
