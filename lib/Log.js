'use strict';

var util = require('util')
  , LEVELS = require('./Levels');

/**
 * @public
 * @constructor
 *
 */
function Log(level, name, args) {
  args = Array.prototype.slice.call(args);

  var ts = Date.now()
    , lvlStr = ''
    , prefix = '';

  switch (level) {
    case LEVELS.DEBUG:
      lvlStr = 'DEBUG';
      break;
    case LEVELS.INFO:
      lvlStr = 'INFO';
      break;
    case LEVELS.WARN:
      lvlStr = 'WARN';
      break;
    case LEVELS.ERROR:
      lvlStr = 'ERROR';
      break;
  }

  // Build log prefix
  prefix = util.format('%s %s %s: ', new Date(ts).toJSON(), lvlStr, name);

  // Normalise first arg to a include our string if necessary
  if (typeof args[0] === 'string') {
    args[0] = prefix + args[0];
  }

  // Format the string so we can save it and output it correctly
  this.text = util.format.apply(util, args);
  this.ts = ts;
  this.level = level;
  this.name = name;
}
module.exports = Log;


/**
 * @public
 * Write the contents of this log to stdout.
 * @param   {Boolean} print Determines if the log is written to stdout
 * @return  {String}
 */
Log.prototype.print = function (print) {
  var str = this.text
    , logFn = console.log;

  switch (this.level) {
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

  if (print) {
    logFn.call(console, str);
  }

  return str;
};


/**
 * Get the date that this log was created.
 * @return {String}
 */
Log.prototype.getDate = function () {
  return new Date(this.ts).toJSON().substr(0, 10);
};


/**
 * Return a JSON object representing this log.
 * @return {Object}
 */
Log.prototype.toJSON = function () {
  return {
    ts: this.ts,
    text: this.text,
    name: this.name,
    level: this.level
  };
};
