module.exports = [
  {
    path: 'appList',
    getComponent(location, cb) {
      require.ensure([], (require) => {
        cb(null, require('./components/AppList').default);
      });
    }
  }, 
  require('./components/detail/routes'),
  {
    path: 'users',
    getComponent(location, cb) {
      require.ensure([], (require) => {
        cb(null, require('./components/Users').default);
      });
    },
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
