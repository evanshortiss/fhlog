'use strict';

var assert = require('assert')
  , LEVELS = require('../lib/Levels')
  , Logger = require('../lib/Logger')
  , LoggerFactory = require('../lib/LoggerFactory');

var TEST_NAME = 'abc123';

describe('LoggerFactory', function () {

  describe('#getLogger', function () {
    it('Should get a Logger object without a name.', function () {
      assert.equal(typeof LoggerFactory.getLogger(), 'object');
      assert.equal(LoggerFactory.getLogger() instanceof Logger, true);
      assert.equal(LoggerFactory.getLogger().getName(), '');
    });

    it('Should get a Logger object with a name.', function () {
      assert.equal(typeof LoggerFactory.getLogger(TEST_NAME), 'object');
      assert.equal(LoggerFactory.getLogger(TEST_NAME) instanceof Logger, true);
      assert.equal(LoggerFactory.getLogger(TEST_NAME).getName(), TEST_NAME);
    });
  });

});
