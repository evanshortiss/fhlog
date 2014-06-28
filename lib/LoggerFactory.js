'use strict';

var util = require('util')
  , CronJob = require('cron').CronJob
  , events = require('events')
  , Logger = require('./Logger')
  , Uploader = require('./Uploader');


// Map of loggers created. Same name loggers exist only once.
var loggers = {}
  , cron = null;

function LoggerFactory () {
  // Setup a cron to upload
  cron = new CronJob('* * * * *', this.upload, null, true, null);

  this.EVENTS = {
    UPLOAD_SUCCESS: 'UPLOAD_SUCCESS',
    UPLOAD_ERROR: 'UPLOAD_ERROR'
  };

}
util.inherits(LoggerFactory, events.EventEmitter);

module.exports = new LoggerFactory();

/**
 * Get a named logger instance.
 * @param {String}    [name]
 * @param {Number}    [level]
 * @param {Boolean}   [upload]
 */
LoggerFactory.prototype.getLogger = function (name, level, upload) {
  return loggers[name] = new Logger(name, level, upload);
};


/**
 * Set the function that will be used for log uplaod
 * @param {Function}
 */
Logger.prototype.setUploadFn = Uploader.setUploadFn;


/**
 * Invoke an upload of logs.
 * @param {Function} [callback]
 */
LoggerFactory.prototype.upload = function (callback) {
  var self = this;

  Uploader.upload(function (err) {
    if (callback) {
      callback(err);
    }

    if (err) {
      self.emit(self.EVENTS.UPLOAD_SUCCESS);
    } else {
      self.emit(self.EVENTS.UPLOAD_ERROR);
    }
  });
};
