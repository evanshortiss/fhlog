
var assert = require('assert')
  , Loggr = require('../../lib/LoggerFactory');

describe('Loggr', function () {

  it('#getLogger Should get a logger instance.', function () {
    assert.equal(typeof Loggr.getLogger(), 'object');
  });

  it('#upload Should return an error.', function (done) {
    Loggr.upload(function (err) {
      assert(err);
      done();
    });
  });

  it('#setUploadFn Should set the upload function.', function () {
    Loggr.setUploadFn(function (str, callback) {
      callback(null, null);
    });
  });

  it('#upload Should run successfully.', function (done) {
    Loggr.upload(function (err) {
      done(err);
    });
  });
});
