'use strict';

var assert = require('assert')
  , LEVELS = require('../lib/Levels')
  , Log = require('../lib/Log');

var TEST_NAME = 'abc123'
  , TEST_ARGS = ['Is maith liom %s', 'cáca milis']
  , LOG_RES = 'Is maith liom cáca milis';

describe('Log', function () {

  it('Should create a log object', function () {
    var l = new Log({
      level: LEVELS.INF,
      name: TEST_NAME
    }, TEST_ARGS);

    assert.equal(typeof l, 'object');
  });

  it('#print Should return a formatted log string', function () {
    var l = new Log({
      level: LEVELS.INF,
      name: TEST_NAME
    }, TEST_ARGS);

    assert.notEqual(l.print().indexOf(LOG_RES), -1);
  });

  it('#toJSON Should return a JSON Object with expected fields', function () {
    var l = new Log({
      level: LEVELS.INF,
      name: TEST_NAME
    }, TEST_ARGS)
      , res = l.toJSON();

    assert.equal(typeof res, 'object');
    assert.equal(typeof res.ts, 'number');
    assert.equal(res.name, TEST_NAME);
    assert.notEqual(res.text.indexOf(LOG_RES), -1);
    assert.equal(res.level, LEVELS.INF);
  });

  it('#getDate Should return today\'s date', function () {
    var l = new Log({
      level: LEVELS.INF
    }, TEST_NAME, TEST_ARGS);

    assert.equal(l.getDate(), new Date().toJSON().substr(0, 10));
  });

});
