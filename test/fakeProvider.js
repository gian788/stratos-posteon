module.exports = function (simulateError, cb) {
  if (!cb) {
    cb = simulateError;
    simulateError = undefined;
  }
  return {
    name: 'fake',
    /*wrapped*/
    send: function (credential, options, callback) {
      if (!cb) {
        callback(null, {status: 'success'});
      } else if (simulateError) {
        cb(new Error('Send Error'));
      } else {
        cb();
      }
    }
  };
};
