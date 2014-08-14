'use strict';


exports.transports = {
  'console': require('./console')
};

// Transports to use, default inclues console
var activeTransports = [exports.transports.console];

/**
 * Log the provided log to the active transports.
 * @public
 * @param {Number} level
 * @param {String} str
 */
exports.log = function (level, str) {
  for (var i in activeTransports) {
    activeTransports[i](level, str);
  }
};
