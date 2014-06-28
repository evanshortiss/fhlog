'use strict';

var util = require('util')
  , LEVELS = require('./Levels');


function Log(level, name, args) {
  args = Array.prototype.slice.call(args);

  var ts = Date.now()
    , prefix = new Date(ts).toJSON() + ' ' + name + ': ';

  // Normalise first arg to a include our string if necessary
  if (typeof args[0] === 'string') {
    args[0] = prefix + args[0];
  }

  // Format the string so we can save it and output it correctly
  this.text = util.format.apply(util, args);
  this.ts = ts;
  this.level = level;
}
module.exports = Log;


/**
 * Write the contents of this log to stdout/output
 * @return {String}
 */
Log.prototype.print = function () {
  var str = this.text;

  switch (this.level) {
    case LEVELS.DEBUG:
      console.debug(str);
      break;
    case LEVELS.INFO:
      console.info(str);
      break;
    case LEVELS.WARN:
      console.warn(str);
      break;
    case LEVELS.ERROR:
      console.error(str);
      break;
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
    level: this.level
  };
};
