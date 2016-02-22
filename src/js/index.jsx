import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, Redirect, hashHistory } from 'react-router';
import configureStore from './configureStore';
import AppList from './components/AppList';
import DetailPage, { Participants, Activity, InviteCodes } from './components/detail';
import Create from './components/Create';
import NotFoundView from './components/NotFoundView';
import App from './components/App';
require('es6-promise').polyfill();

// 路由:https://github.com/rackt/react-router-redux
const store = configureStore({
  app: {
    name: 'jruif'
  }
});
render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={AppList}/>
        <Route path="appList" component={AppList}/>
        <Route path="match/:id" component={DetailPage}>
          <IndexRoute component={Activity}/>
          <Route path="detail" component={Activity}/>
          <Route path="codes" component={InviteCodes}/>
          <Route path="participants" component={Participants}/>
        </Route>
        <Route path="create" component={Create} />
        <Route path="modification/:id" component={Create} />
        <Route path="/404" component={NotFoundView} />
        <Redirect from="*" to="/404" />
      </Route>
    </Router>
  </Provider>
  , document.getElementById('root')
);
