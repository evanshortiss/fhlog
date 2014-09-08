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
    case LEVELS.DEBUG:
      logFn = console.debug || console.log;
      break;
    case LEVELS.INFO:
      logFn = console.info || console.log;
      break;
    case LEVELS.WARN:
      logFn = console.warn;
      break;
    case LEVELS.ERROR:
      logFn = console.error;
      break;
    default:
      logFn = console.log;
      break;
  }

  logFn.call(console, str);
};
