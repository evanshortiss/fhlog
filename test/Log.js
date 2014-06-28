var assert = require('assert')
  , LEVELS = require('../lib/Levels')
  , Log = require('../lib/Log');

var TEST_NAME = 'abc123'
  , TEST_ARGS = ['I want %s', 'cake'];

describe('Log', function () {

  it('Should create a log object', function () {
    var l = new Log(LEVELS.INFO, TEST_NAME, TEST_ARGS);

    assert.equal(typeof l, 'object');
  });

  it('#print Should return a formatted log string', function () {
    var l = new Log(LEVELS.INFO, TEST_NAME, TEST_ARGS);

    assert.notEqual(l.print().indexOf('I want cake'), -1);
  });

  it('#toJSON Should return a JSON Object with expected fields', function () {
    var l = new Log(LEVELS.INFO, TEST_NAME, TEST_ARGS)
      , res = l.toJSON();

    assert.equal(typeof res, 'object');
    assert.equal(typeof res.ts, 'number');
    assert.notEqual(res.text.indexOf('I want cake'), -1);
    assert.equal(res.level, LEVELS.INFO);
  });

  it('#getDate Should return today\'s date', function () {
    var l = new Log(LEVELS.INFO, TEST_NAME, TEST_ARGS);

    assert.equal(l.getDate(), new Date().toJSON().substr(0, 10));
  });

});
