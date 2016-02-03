/**
 * Created by jruif on 15/11/28.
 */
import { createStore, applyMiddleware, compose } from 'redux';
import { browserHistory } from 'react-router';
import { syncHistory } from 'react-router-redux';
import rootReducer from './reducers';
import thunkMiddleware from 'redux-thunk';

export default function configureStore(initialState) {
    const store = compose(
      applyMiddleware(syncHistory(browserHistory), thunkMiddleware)
    )(createStore)(rootReducer, initialState);
    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('./reducers', () => {
          const nextReducer = require('./reducers');
          store.replaceReducer(nextReducer);
        });
    }
    return store;
}
