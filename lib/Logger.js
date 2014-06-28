'use strict';

var Log = require('./Log')
  , Storage = require('./Storage')
  , LEVELS = require('./Levels');


/**
 * Wrapper for the console object.
 * Should behave the same as console.METHOD
 */
function Logger (name, level, upload) {
  this._logLevel = level || this.LEVELS.DEBUG;
  this._name = name || '';
  this._upload = upload || true;
}
module.exports = Logger;

Logger.prototype.LEVELS = LEVELS;
Logger.LEVELS = LEVELS;

/**
 * Log output to the console with format:
 * "2014-06-26T16:42:11.139Z LoggerName:"
 * @param   {Number}  level
 * @param   {Array}   args
 * @return  {String}
 */
Logger.prototype._log = function(level, args) {
  var l = new Log(level, this.getName(), args);

  if (this._upload) {
    Storage.writeLog(l);
  }

  return l.print();
};

// Log a message a current log level
Logger.prototype.log = function () {
  return this._log(this.getLogLevel(), arguments);
};

// Log a message at 'DEBUG' level
Logger.prototype.debug = function () {
  return this._log(LEVELS.DEBUG, arguments);
};

// Log a message at 'INFO' level
Logger.prototype.info = function () {
  return this._log(LEVELS.INFO, arguments);
};

// Log a message at 'WARN' level
Logger.prototype.warn = function () {
  return this._log(LEVELS.WARN, arguments);
};

// Log a message at 'ERROR' level
Logger.prototype.err = function () {
  return this._log(LEVELS.ERROR, arguments);
};
// Log a message at 'ERROR' level
Logger.prototype.error = Logger.prototype.err;


Logger.prototype.setLogLevel = function (newLevel) {
  this._logLevel = newLevel;
};

Logger.prototype.getLogLevel = function () {
  return this._logLevel;
};

Logger.prototype.getName = function () {
  return this._name;
};

Logger.prototype.setName = function(name) {
  this._name = name;
};
