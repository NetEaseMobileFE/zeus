/**
 * Created by jruif on 15/11/28.
 */
import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';
import applyList from './applyList';
import create from './create';
import detail from './detail';
import app from './app';
const rootReducer = combineReducers({
  routeReducer,
  applyList,
  create,
  details: detail,
  app,
});

export default rootReducer;
