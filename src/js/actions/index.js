/**
 * Created by jruif on 16/2/2.
 */
import * as type from './actionType';
import fetch from 'isomorphic-fetch';

export function login() {
  return {
    type: type.REQUEST,
    app: {
      name: 'netEase',
    },
  };
}
