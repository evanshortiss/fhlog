'use strict';

var persistence = require('../lib/Persistence')
  , Log = require('../lib/Log')
  , assert = require('assert');

describe('Persistence Component', function() {

  this.timeout(10000);

  var wl = new Log({
    level: 0,
    name: 'TestLogger'
  }, ['The test log text.']);

  describe('#init', function() {
    it('Should initialise without an error', function(done) {
      persistence.init({}, done);
    });
  });

  describe('#writeLog', function() {
    it('Should call the callback without an error', function(done) {
      persistence.writeLog(wl, done);
    });
  });

});
