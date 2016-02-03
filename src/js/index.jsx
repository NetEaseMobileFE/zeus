import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, Redirect, browserHistory } from 'react-router';
import configureStore from './configureStore';
import AppList from './components/AppList';
import DetailPage from './components/DetailPage';
import Create from './components/Create';
import NotFoundView from './components/NotFoundView';
import App from './components/App';

// 路由:https://github.com/rackt/react-router-redux
const store = configureStore({
  app: {
    name: 'jruif'
  },
  create: {
    formType: '1'
  }
});
render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={AppList}/>
        <Route path="appList" component={AppList}/>
        <Route path="appList/:id" component={DetailPage} />
        <Route path="create" component={Create} />
        <Route path="/404" component={NotFoundView} />
        <Redirect from="*" to="/404" />
      </Route>
    </Router>
  </Provider>
  , document.getElementById('root')
);
