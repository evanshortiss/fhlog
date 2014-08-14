'use strict';

var util = require('util')
  , transport = require('./transport')
  , LEVELS = require('./Levels');


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
 * Write the contents of this log to output transport
 * @return {String}
 */
Log.prototype.print = function () {
  transport.log(this.level, this.text);

  return this.text;
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
