'use strict';

var Logger = require('./Logger')
  , LEVELS = require('./Levels')
  , persistence = require('./Persistence')
  , meta = require('./Meta')
  , _ = require('lodash');

var loggers = {}    // Loggers created. Same name loggers exist only once.
  , defaults = {};  // Defaults to apply to each logger at creation


/**
 * @public
 * The Log levels available for use.
 * @type {Object}
 */
exports.LEVELS = LEVELS;


/**
 * @public
 * Metadata interface
 * @type {Object}
 */
exports.meta = meta;


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
 * Set a default property to apply to all loggers
 * @param {String} name The property to create a default for
 * @param {String} val  The default value
 */
exports.setDefault = function (name, val) {
  defaults[name] = val;
};


/**
 * Forces all loggers into silent mode.
 */
exports.silenceIsGolden = exports.silenceAll = function () {
  _.each(loggers, function (l) {
    l.setSilent(true);
  });
};


/**
 * Forces all loggers out of silent mode.
 */
exports.permissionToSpeakGranted = exports.unsilenceAll = function () {
  _.each(loggers, function (l) {
    l.setSilent(false);
  });
};


/**
 * @public
 * Get a named logger instance creating it if it doesn't already exist.
 * @param   {String}    [name]
 * @param   {Object}    [opts]
 * @returns {Logger}
 */
exports.getLogger = exports.get = function (name, opts) {
  name = name || '';
  opts = opts || {};

  if (loggers[name]) {
    return loggers[name];
  } else {
    // Get a logger with user opts and defaults, current opts take priority
    loggers[name] = new Logger(name, _.assign(defaults, opts));

    return loggers[name];
  }
};

// Register as an Angular module if possible
if (typeof window !== 'undefined' && window.angular && window.angular.module) {
  angular.module('fhlog', [])
    .service('fhlog', function () {
      // Return the service with the properties of the LoggerFactory appended
      return _.assign(this, exports);
    });
}
