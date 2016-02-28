module.exports = [
  {
    path: 'detail',
    getComponents(location, cb) {
      require.ensure([], (require) => {
        cb(null, require('./Activity'));
      });
    }
  }, {
    path: 'codes',
    getComponents(location, cb) {
      require.ensure([], (require) => {
        cb(null, require('./InviteCodes'));
      });
    }
  }, {
    path: 'participants',
    getComponents(location, cb) {
      require.ensure([], (require) => {
        cb(null, require('./Participants'));
      });
    }
  }
];
