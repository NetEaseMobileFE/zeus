/**
 * Created by jruif on 15/11/28.
 */
import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';
import applyList from './applyList';
import create from './create';
import app from './app';
import modal from './modal';
const rootReducer = combineReducers({
  routeReducer,
  applyList,
  create,
  app,
  modal
});

export default rootReducer;
