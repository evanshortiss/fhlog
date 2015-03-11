'use strict';

var LEVELS = require('../Levels');

/**
 * Logs output using Node.js stdin/stderr stream.
 * @private
 * @param {Number} level
 * @param {String} str
 */
module.exports = function (level, str) {
  if (level === LEVELS.ERR) {
    process.stderr.write(str + '\n');
  } else {
    process.stdout.write(str + '\n');
  }
};
