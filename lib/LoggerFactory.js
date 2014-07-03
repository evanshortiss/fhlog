'use strict';

var LEVELS = require('./Levels')
  , Logger = require('./Logger')
  , Uploader = require('./Uploader');


// Map of loggers created. Same name loggers exist only once.
var loggers = {};

function LoggerFactory () {
  this.LEVELS = LEVELS;
}

module.exports = new LoggerFactory();

/**
 * Get a named logger instance.
 * @param {String}    [name]
 * @param {Number}    [level]
 * @param {Boolean}   [upload]
 */
LoggerFactory.prototype.getLogger = function (name, level, upload) {
  if (upload) {
    Uploader.startInterval();
  }

  if (loggers[name]) {
    return loggers[name];
  } else {
    loggers[name] = new Logger(name, level, upload);

    return loggers[name];
  }
};


/**
 * Set the function that will be used for log uplaod
 * @param {Function}
 */
LoggerFactory.prototype.setUploadFn = Uploader.setUploadFn;


/**
 * Invoke an upload of logs.
 * @param {Function} [callback]
 */
LoggerFactory.prototype.upload = Uploader.upload;
