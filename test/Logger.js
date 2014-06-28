var assert = require('assert')
  , proxyquire = require('proxyquire')
  , LEVELS = require('../lib/Levels')
  , Logger = proxyquire('../lib/Logger', {
    './Storage': {
      writeLog: function() {}
    }
  });

var TEST_NAME = 'abc123'
  , TEST_ARGS = ['I want %s', 'cake']
  , LOG_RES = 'I want cake';

var l = new Logger(TEST_NAME, LEVELS.INFO);

describe('Logger', function () {

  it('Should create a Logger object', function () {
    assert.equal(typeof l, 'object');
  });

  it('#info/warn/error Should return a formatted log string', function () {
    assert.notEqual(l.info.apply(l, TEST_ARGS).indexOf(LOG_RES), -1);
    assert.notEqual(l.warn.apply(l, TEST_ARGS).indexOf(LOG_RES), -1);
    assert.notEqual(l.error.apply(l, TEST_ARGS).indexOf(LOG_RES), -1);
  });

  it('#setName Should return a JSON Object with expected fields', function () {
    var originalName = l.getName()
      , newName = Math.random().toString();

    l.setName(newName);
    assert.notEqual(l.getName(), originalName);
  });

  it('#getName Should return the passed logger name', function () {
    var lgr = new Logger(TEST_NAME, LEVELS.INFO);
    assert.equal(TEST_NAME, lgr.getName());
  });

  it('#setName Should return a JSON Object with expected fields', function () {
    var originalName = l.getName()
      , newName = Math.random().toString();

    l.setName(newName);
    assert.notEqual(l.getName(), originalName);
  });

  it('#getLogLevel Should return the passed log level to constructor', function () {
    var lgr = new Logger(TEST_NAME, LEVELS.DEBUG);
    assert.equal(lgr.getLogLevel(), LEVELS.DEBUG);
  });

  it('#setName Should set log level and retrieve new value', function () {
    var setLogLevel = l.getName()
      , newName = Math.random().toString();

    var lgr = new Logger(TEST_NAME, LEVELS.INFO);
    lgr.setLogLevel(LEVELS.WARN);

    assert.equal(lgr.getLogLevel(), LEVELS.WARN);
  });
});
