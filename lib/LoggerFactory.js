'use strict';

var Logger = require('./Logger')
  , Uploader = require('./Uploader')
  , LEVELS = require('./Levels');


// Map of loggers created. Same name loggers exist only once.
var loggers = {};

/**
 * @constructor
 * @private
 * Used to create instances
 */
function LoggerFactory () {
  this.LEVELS = LEVELS;
}

module.exports = new LoggerFactory();

LoggerFactory.prototype.setGlobalLevel = function (level) {
  for (var i in loggers) {
    loggers[i].setLogLevel(level);
  }
};

/**
 * @public
 * Get a named logger instance creating it if it doesn't already exist.
 * @param   {String}    [name]
 * @param   {Number}    [level]
 * @param   {Boolean}   [upload]
 * @param   {Boolean}   [silent]
 * @returns {Logger}
 */
LoggerFactory.prototype.getLogger = function (name, opts) {
  name = name || '';

  if (opts && opts.upload) {
    Uploader.startInterval();
  }

  if (loggers[name]) {
    return loggers[name];
  } else {
    loggers[name] = new Logger(name, opts);

    return loggers[name];
  }
};


/**
 * @public
 * Set the function that will be used to upload logs.
 * @param {Function} uploadFn
 */
LoggerFactory.prototype.setUploadFn = Uploader.setUploadFn;


/**
 * @public
 * Force logs to upload at this time.
 * @param {Function} [callback]
 */
LoggerFactory.prototype.upload = Uploader.upload;
