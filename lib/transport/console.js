'use strict';

var LEVELS = require('../Levels');

/**
 * Logs output using Node.js stdin/stderr stream.
 * @private
 * @param {Number} level
 * @param {String} str
 */
function nodeLog (level, str) {
  if (level === LEVELS.ERROR) {
    process.stderr.write(str + '\n');
  } else {
    process.stdout.write(str + '\n');
  }
}


/**
 * Logs output using the browser's console object.
 * @private
 * @param {Number} level
 * @param {String} str
 */
function browserLog (level, str) {
  var logFn = console.log;

  switch (level) {
    case LEVELS.DEBUG:
      // console.debug is not available in Node land
      logFn = console.debug || console.log;
      break;
    case LEVELS.INFO:
      // console.info is not available in Node land either
      logFn = console.info || console.log;
      break;
    case LEVELS.WARN:
      logFn = console.warn;
      break;
    case LEVELS.ERROR:
      logFn = console.error;
      break;
  }

  logFn.call(console, str);
}


if (typeof window === 'undefined') {
  module.exports = nodeLog;
} else {
  module.exports = browserLog;
}
