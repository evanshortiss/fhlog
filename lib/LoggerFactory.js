'use strict';

var Logger = require('./Logger')
  , LEVELS = require('./Levels')
  , persistence = require('./Persistence')
  , meta = require('./Meta')
  , pkg = require('./Package')
  , _ = require('lodash');


// Map of loggers created. Same name loggers exist only once.
var loggers = {};


/**
 * Get the current running version of this module.
 * @return {String} The sermver version tag.
 */
exports.getVersion = function () {
  return pkg.get('version');
};


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
 * @public
 * Get a named logger instance creating it if it doesn't already exist.
 * @param   {String}    [name]
 * @param   {Object}    [opts]
 * @returns {Logger}
 */
exports.getLogger = exports.get = function (name, opts) {
  name = name || '';

  if (loggers[name]) {
    return loggers[name];
  } else {
    loggers[name] = new Logger(name, opts);

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
