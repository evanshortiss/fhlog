'use strict';

// Filthy hack for node.js testing, in the future storage should be shelled
// out to storage adapter classes and this acts as an interface only
var w = {};
if (typeof window !== 'undefined') {
  w = window;
}

var ls = w.localStorage
  , safejson = require('safejson');

var INDEX_KEY = '_log_indexes_';


/**
 * Generate an index from a given Log Object.
 * @param {Log} log
 */
function genIndex (log) {
  return '_logs_' + log.getDate();
}


/**
 * Get all indexes (days of logs)
 * @param {Function}
 */
var getIndexes = exports.getIndexes = function (callback) {
  var indexes = ls.getItem(INDEX_KEY);

  safejson.parse(indexes, function (err, res) {
    if (err) {
      return callback(err, null);
    } else {
      res = res || [];
      return callback(null, res);
    }
  });
};


/**
 * Update log indexes based on a new log.
 * @param {Log}       log
 * @param {Function}  callback
 */
function updateIndexes (log, callback) {
  getIndexes(function (err, indexes) {
    var idx = genIndex(log);

    // Do we update indexes?
    if (indexes.indexOf(idx) === -1) {
      indexes.push(idx);

      safejson.stringify(indexes, function (err, idxs) {
        try {
          ls.setItem(idx, idxs);
          return callback(null, indexes);
        } catch (e) {
          return callback(e, null);
        }
      });
    } else {
      return callback(null, null);
    }
  });
}


/**
 * Get all logs for a date/index
 * @param {String}    index
 * @param {Function}  callback
 */
var getLogsForIndex = exports.getLogsForIndex = function (index, callback) {
  safejson.parse(ls.getItem(index), function (err, logs) {
    if (err) {
      return callback(err, null);
    } else {
      // If this date isn't created yet, do so now
      logs = logs || [];

      return callback(null, logs);
    }
  });
};


/**
 * Save logs for the given date (index)
 * @param {String}
 * @param {Array}
 * @param {Function}
 */
function saveLogsForIndex (logsIndex, logs, callback) {
  safejson.stringify(logs, function (err, res) {
    if (err) {
      return callback(err, null);
    } else {
      ls.setItem(logsIndex, res);

      return callback(null, logs);
    }
  });
}


/**
 * Write a log to permanent storage
 * @param {Log}
 * @param {Function}
 */
exports.writeLog = function (log, callback) {
  updateIndexes(log, function (err) {
    if (err) {
      return callback(err, null);
    }

    var logsIndex = genIndex(log);

    getLogsForIndex(logsIndex, function (err, logs) {
      logs.push(log.toJSON());

      saveLogsForIndex(logsIndex, logs, callback);
    });
  });
};
