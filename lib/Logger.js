'use strict';

var Log = require('./Log')
  , persistence = require('./Persistence')
  , LEVELS = require('./Levels');

/**
 * @constructor
 * Wrapper for the console object.
 * Should behave the same as console.METHOD
 * @param {String}    [name]    Name of this logger to include in logs.
 * @param {Number}    [level]   Level to use for calls to .log
 * @param {Boolean}   [upload]  Determines if logs are uploaded.
 * @param {Boolean}   [silent]  Flag indicating if we print to stdout or not.
 */
function Logger (name, opts) {
  opts = opts || {};

  this._name = name || '';
  this._logLevel = opts.level || LEVELS.DBG;
  this._upload = opts.upload || false;
  this._silent = opts.silent || false;
  this._colourise = opts.colourise || true;
}
module.exports = Logger;

Logger.prototype.LEVELS = LEVELS;
Logger.LEVELS = LEVELS;


/**
 * @private
 * Log output to stdout with format: "2014-06-26T16:42:11.139Z LoggerName:"
 * @param   {Number}  level
 * @param   {Array}   args
 * @return  {String}
 */
Logger.prototype._log = function(level, args) {
  if (level < this.getLogLevel()) {
    // Don't log anything if the log level is set above the provided level
    return;
  }

  var l = new Log({
    colourise: this._colourise,
    level: level,
    name: this.getName()
  }, args);

  if (this._upload) {
    persistence.writeLog(l);
  }

  return l.print(!this.isSilent());
};


/**
 * @public
 * Toggle printing out logs to stdout.
 * @param {Boolean} silent
 */
Logger.prototype.setSilent = function (silent) {
  this._silent = silent || false;
};


/**
 * @public
 * Determine if this logger is printing to stdout.
 * @returns {Boolean}
 */
Logger.prototype.isSilent = function () {
  return this._silent;
};


/**
 * @public
 * Log a message at 'DEBUG' level
 * Log a string and return the string value of the provided log args.
 * This operates in the same manner as console.debug
 * @param [arguments] arguments The list of args to log.
 * @returns {String}
 */
Logger.prototype.debug = function () {
  return this._log(LEVELS.DBG, arguments);
};


/**
 * @public
 * Log a message at 'INFO' level
 * Log a string and return the string value of the provided log args.
 * This operates in the same manner as console.info
 * @param [arguments] arguments The list of args to log.
 * @returns {String}
 */
Logger.prototype.info = function () {
  return this._log(LEVELS.INF, arguments);
};


/**
 * @public
 * Log a message at 'WARN' level
 * Log a string and return the string value of the provided log args.
 * This operates in the same manner as console.warn
 * @param [arguments] arguments The list of args to log.
 * @returns {String}
 */
Logger.prototype.warn = function () {
  return this._log(LEVELS.WRN, arguments);
};


/**
 * @public
 * Log a message at 'ERROR' level
 * Log a string and return the string value of the provided log args.
 * This operates in the same manner as console.error
 * @param [arguments] arguments The list of args to log.
 * @returns {String}
 */
Logger.prototype.err = function () {
  return this._log(LEVELS.ERR, arguments);
};


/**
 * @public
 * Shim for the info Logger function.
 */
Logger.prototype.i = Logger.prototype.info;


/**
 * @public
 * Shim for the error Logger function.
 */
Logger.prototype.e = Logger.prototype.err;


/**
 * @public
 * Shim for the warn Logger function.
 */
Logger.prototype.w = Logger.prototype.warn;


/**
 * @public
 * Shim for the debug Logger function.
 */
Logger.prototype.d = Logger.prototype.debug;


/**
 * @public
 * Log a message at 'ERROR' level
 * Log a string and return the string value of the provided log args.
 * This operates in the same manner as console.error
 * @param [arguments] arguments The list of args to log.
 * @returns {String}
 */
Logger.prototype.error = Logger.prototype.err;


/**
 * @public
 * Set the level of this logger for calls to the .log instance method.
 * @param {Number} lvl
 */
Logger.prototype.setLogLevel = function (lvl) {
  this._logLevel = lvl;
};


/**
 * @public
 * Get the level of this logger used by calls to the .log instance method.
 * @returns {Number}
 */
Logger.prototype.getLogLevel = function () {
  return this._logLevel;
};


/**
 * @public
 * Get the name of this logger.
 * @returns {String}
 */
Logger.prototype.getName = function () {
  return this._name;
};


/**
 * @public
 * Set the name of this logger. It would be very unusual to use this.
 * @param {String} name
 */
Logger.prototype.setName = function(name) {
  this._name = name;
};
