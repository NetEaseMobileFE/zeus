import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, Redirect, IndexRedirect, hashHistory } from 'react-router';
import AppList from './components/AppList';
import DetailPage, { Participants, Activity, InviteCodes } from './components/detail';
import Users from './components/Users';
import Create from './components/Create';
import NotFoundView from './components/NotFoundView';
import App from './components/App';
import configureStore from './configureStore';
import checkLogin from './utils/checkLogin';
require('es6-promise').polyfill();

const userName = checkLogin();
if (!userName && window.location.hostname !== 'localhost') {
  window.location.href = 'http://baoming.ws.netease.com/login/login'; 
}

// 路由:https://github.com/rackt/react-router-redux
const store = configureStore({
  app: {
    name: userName
  }
});
/*
const rootRoute = [
  {
    path: '/',
    component: require('./components/App').default,
    indexRoute: { component: require('./components/AppList').default },
    childRoutes: [
      {
        path: 'appList',
        getComponent(location, cb) {
          require.ensure([], (require) => {
            cb(null, require('./components/AppList').default);
          });
        }
      }, {
        path: 'match/:id',
        getComponent(location, cb) {
          require.ensure([], (require) => {
            cb(null, require('./components/detail').default);
          });
        },
        childRoutes: require('./components/detail/routes')
      }, {
        path: 'users',
        getComponent(location, cb) {
          require.ensure([], (require) => {
            cb(null, require('./components/Users').default);
          });
        }
      }, {
        path: 'create',
        getComponent(location, cb) {
          require.ensure([], (require) => {
            cb(null, require('./components/Create').default);
          });
        }
      }, {
        path: 'modification/:id',
        getComponent(location, cb) {
          require.ensure([], (require) => {
            cb(null, require('./components/Create').default);
          });
        }
      }, {
        path: '404',
        getComponent(location, cb) {
          require.ensure([], (require) => {
            cb(null, require('./components/NotFoundView').default);
          });
        }
      }
    ]
  }
];
*/
render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRedirect to="/appList" />
        <Route path="appList" component={AppList}/>
        <Route path="match/:id" component={DetailPage}>
          <IndexRedirect to="detail" />
          <Route path="detail" component={Activity}/>
          <Route path="codes" component={InviteCodes}/>
          <Route path="participants" component={Participants}/>
        </Route>
        <Route path="users" component={Users} />
        <Route path="create" component={Create} />
        <Route path="modification/:id" component={Create} />
        <Route path="/404" component={NotFoundView} />
        <Redirect from="*" to="/404" />
      </Route>
    </Router>
  </Provider>
  , document.getElementById('root')
);
