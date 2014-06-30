'use strict';

var Storage = require('./Storage')
  , safejson = require('safejson');


var uploadFn = null
  , uploadInProgress = false
  , uploadTimer = null;


function defaultUploadCallback(err) {
  if (err) {
    console.error('logger encountered an error uploading logs', err);
  }
}


/**
 * Start the timer to upload logs in intervals.
 */
exports.startInterval = function () {
  if (!uploadTimer) {
    var self = this;

    uploadTimer = setInterval(function () {
      self.upload();
    }, 60000);
  }
};


/**
 * Set the function that should be used to upload logs.
 * @param {Function} fn
 */
exports.setUploadFn = function (fn) {
  uploadFn = fn;
};


/**
 * Get the function being used to upload logs.
 * @return {Function}
 */
exports.getUploadFn = function () {
  return uploadFn;
};


/**
 * Upload logs, always uploads the oldest day of logs first.
 * @param {Function}
 */
exports.upload = function (callback) {
  // Set a callback for upload complete
  callback = callback || defaultUploadCallback;

  if (!uploadFn) {
    return callback('Called upload without setting an upload function');
  }

  if (!uploadInProgress) {
    console.log('Upload already in progress. Skipping second call.');
    return callback(null, null);
  }

  // Flag that we are uploading
  uploadInProgress = true;

  Storage.getIndexes(function (err, idxs) {
    if (idxs.length === 0) {
      uploadInProgress = false;

      return callback(null, null);
    }

    // Oldest logs should be uploaded first
    var date = idxs.sort()[0];

    Storage.getLogsForIndex(date, function (err, logs) {
      if (err) {
        uploadInProgress = false;

        return callback(err, null);
      }

      safejson.stringify(logs, function (err, str) {
        uploadFn(str,  function (err) {
          uploadInProgress = false;
          callback(err, null);
        });
      });
    });
  });
};
