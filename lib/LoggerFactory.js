'use strict';

var Logger = require('./Logger')
  , LEVELS = require('./Levels')
  , persistence = require('./Persistence')
  , meta = require('./Meta');


// Map of loggers created. Same name loggers exist only once.
var loggers = {};


/**
 * @public
 * The Log levels available for use.
 * @type {Object}
 */
exports.LEVELS = LEVELS;


/**
 * @public
 * Set the global log level for all log instances.
 * @param {[type]} level [description]
 */
exports.setGlobalLevel = function (level) {
  for (var i in loggers) {
    loggers[i].setLogLevel(level);
  }
};


/**
 * @public
 * Initialise the log library.
 * @param  {Object}   opts
 * @param  {Function} callback
 */
exports.init = function (opts, callback) {
  // Ensure metadata is set for each log
  meta.set(opts.meta || {});

  persistence.init(opts, callback);
};


/**
 * @public
 * Get a named logger instance creating it if it doesn't already exist.
 * @param   {String}    [name]
 * @param   {Object}    [opts]
 * @returns {Logger}
 */
exports.getLogger = function (name, opts) {
  name = name || '';

  if (loggers[name]) {
    return loggers[name];
  } else {
    loggers[name] = new Logger(name, opts);

    return loggers[name];
  }
};
