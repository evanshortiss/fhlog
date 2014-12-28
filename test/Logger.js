'use strict';

var assert = require('assert')
  , LEVELS = require('../lib/Levels')
  , Logger = require('../lib/Logger');

var TEST_NAME = 'abc123'
  , TEST_ARGS = ['Is maith liom %s', 'cáca milis']
  , LOG_RES = 'Is maith liom cáca milis';

var l = new Logger(TEST_NAME, LEVELS.INF);

describe('Logger', function () {

  it('Should create a Logger object', function () {
    assert.equal(typeof l, 'object');
  });

  it('#info/warn/error Should return a formatted log string', function () {
    assert.notEqual(l.info.apply(l, TEST_ARGS).indexOf(LOG_RES), -1);
    assert.notEqual(l.warn.apply(l, TEST_ARGS).indexOf(LOG_RES), -1);
    assert.notEqual(l.error.apply(l, TEST_ARGS).indexOf(LOG_RES), -1);
    assert.notEqual(l.err.apply(l, TEST_ARGS).indexOf(LOG_RES), -1);
  });

  it('#setName Should change the logger name', function () {
    var originalName = l.getName()
      , newName = Math.random().toString();

    l.setName(newName);
    assert.notEqual(l.getName(), originalName);
  });

  it('#getName Should return the passed logger name', function () {
    var lgr = new Logger(TEST_NAME, LEVELS.INF);
    assert.equal(TEST_NAME, lgr.getName());
  });

  it('#getLogLevel Should return the passed log level to constructor', function () {
    var lgr = new Logger(TEST_NAME, {
      level:LEVELS.DBG
    });
    assert.equal(lgr.getLogLevel(), LEVELS.DBG);
  });

  it('#setName Should set log level and retrieve new value', function () {
    var setLogLevel = l.getName()
      , newName = Math.random().toString();

    var lgr = new Logger(TEST_NAME, LEVELS.INF);
    lgr.setLogLevel(LEVELS.WRN);

    assert.equal(lgr.getLogLevel(), LEVELS.WRN);
  });
});
