'use strict';

var LEVELS = require('../Levels');

/**
 * Logs output using the browser's console object.
 * @private
 * @param {Number} level
 * @param {String} str
 */
module.exports = function (level, str) {
  var logFn = null;

  switch (level) {
    case LEVELS.DBG:
      logFn = console.debug || console.log;
      break;
    case LEVELS.INF:
      logFn = console.info || console.log;
      break;
    case LEVELS.WRN:
      logFn = console.warn || console.log;
      break;
    case LEVELS.ERR:
      logFn = console.error || console.log;
      break;
    default:
      logFn = console.log;
      break;
  }

  logFn.call(console, str);
};
