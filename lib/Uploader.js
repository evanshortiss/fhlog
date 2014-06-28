'use strict';

var Storage = require('./Storage')
  , safejson = require('safejson');

// Function used to upload logs
var uploadFn = null;


/**
 * Set the function that should be used to upload logs.
 * @param {Function} fn
 */
exports.setUploadFn = function (fn) {
  uploadFn = fn;
};


/**
 * Upload logs, always uploads the oldest logs.
 * @param {Function}  callback
 */
exports.upload = function (callback) {
  Storage.getIndexes(function (err, idxs) {
    if (idxs.length === 0) {
      return callback(null, null);
    }

    // Oldest logs should be uploaded first
    var date = idxs.sort()[0];

    Storage.getLogsForIndex(date, function (err, logs) {
      if (err) {
        return callback(err, null);
      }

      safejson.stringify(logs, function (err, str) {
        uploadFn(str, callback);
      });
    });
  });
};
