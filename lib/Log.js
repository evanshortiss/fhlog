'use strict';

var util = require('util')
  , _ = require('lodash')
  , transport = require('./transport')
  , LEVELS = require('./Levels')
  , meta = require('./Meta');

// Enable colourisation - this isn't enabled for browsers
var colours = require('colors/safe');


/**
 * Get the level string for a log, e.g "INF", "DBG" etc.
 * Also adds colour to the when enabled.
 * @param  {Object} opts
 */
function getLevelStr (opts) {
  var lvlStr = _.invert(LEVELS)[opts.level]
    , useColours = opts.colourise || true;

  if (useColours) {
    switch (opts.level) {
      case LEVELS.DBG:
        lvlStr = colours.magenta(lvlStr);
        break;
      case LEVELS.INF:
        lvlStr = colours.green(lvlStr);
        break;
      case LEVELS.WRN:
        lvlStr = colours.yellow(lvlStr);
        break;
      case LEVELS.ERR:
        lvlStr = colours.red(lvlStr);
        break;
    }
  }

  return lvlStr;
}


/**
 * @public
 * @constructor
 * Creates a log instance with data required to log a string.
 */
function Log (opts, args) {
  args = Array.prototype.slice.call(args);

  var ts = Date.now()
    , lvlStr = getLevelStr(opts)
    , prefix = ''
    , name = opts.name;

  // Set text to be just the text user supplied
  this.text = util.format.apply(util, args);

  // Build log prefix
  prefix = util.format('%s %s %s: ', new Date(ts).toJSON(), lvlStr, name);

  // Normalise first arg to a include our string if necessary
  if (typeof args[0] === 'string') {
    args[0] = prefix + args[0];
  }

  // Set text to be just the text user supplied
  this.formattedText = util.format.apply(util, args);

  // Format the string so we can save it and output it correctly
  this.ts = ts;
  this.level = opts.level;
  this.name = name;
}
module.exports = Log;


/**
 * Write the contents of this log to output transport
 * @param   {Boolean} silent
 * @return  {String}
 */
Log.prototype.print = function (print) {
  if (print) {
    transport.log(this.level, this.formattedText);
  }

  return this.formattedText;
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
    level: this.level,
    meta: meta.get()
  };
};
