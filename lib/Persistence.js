'use strict';

var safejson = require('safejson')
  , async = require('async')
  , path = require('path')
  , fs = require('html5-fs')
  , _ = require('lodash');

// Priority based queue to store log file ops.
// Writes are highest priority, we don't want to lose logs!
var opQ = async.priorityQueue(runQueueTask, 1);

// Function that must be set to upload logs to a remote endpoint
var uploadFn = null;

var LOG_DIR = './fhlogs'
  , FILE_EXT = '.txt'
  , TASK_PRIORITY = {
    WRITE: 1,
    UPLOAD: 2,
  }
  , DEFAULT_STORAGE_QUOTA = 25 * Math.pow(3, 1024) // Max log storage is 25MB
  , MAX_FILE_SIZE = 10 * Math.pow(2, 1024); // Max file size is 10KB


function runQueueTask (task, callback) {
  // TODO: Handle errors passed to the callback
  task.fn(callback);
}


/**
 * Get a list of all the current log files
 * @param  {Function} callback
 */
function getLogFiles (callback) {
  fs.readdir(LOG_DIR, callback);
}


/**
 * Get the name of the most recent log file
 * @param  {Array}    files
 * @param  {Function} callback
 */
function getOldestFilename (callback) {
  getLogFiles(function (err, files) {
    if (err) {
      callback(err, null);
    } else {
      var file = _.min(files, function (f) {
        // Remove extension to get just the timestamp
        var ts = f.name.replace(FILE_EXT, '');

        return parseInt(ts, 10);
      });

      callback(null, file.name);
    }
  });
}


/**
 * Get the name of the most recent log file
 * @param  {Array}    files
 * @param  {Function} callback
 */
function getMostRecentFilename (callback) {
  getLogFiles(function (err, files) {
    if (err) {
      callback(err, null);
    } else {
      var file = _.max(files, function (f) {
        // Remove extension to get just the timestamp
        var ts = f.name.replace(FILE_EXT, '');

        return parseInt(ts, 10);
      });

      callback(null, file.name);
    }
  });
}


/**
 * Determine the file to write the current log file to
 * @param  {String}   name
 * @param  {Function} callback
 */
function getRequiredFilename (name, callback) {
  var filepath = path.join(LOG_DIR, name);

  function getStats () {
    fs.stat(filepath, function (err, stats) {
      if (err) {
        callback(err, null);
      } else if (stats && stats.size >= MAX_FILE_SIZE) {
        createFile();
      } else {
        callback(null, name);
      }
    });
  }

  function createFile () {
    var newName = Date.now().toString().concat(FILE_EXT);
    filepath = path.join(LOG_DIR, newName);

    fs.writeFile(filepath, '[]', function (err) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, newName);
      }
    });
  }

  fs.exists(filepath, function (exists) {
    if (exists) {
      getStats();
    } else {
      createFile();
    }
  });
}


/**
 * Generates a function that will perform logic required
 * to update a log file with a new log entry.
 * @param  {Log} log [description]
 */
function getWriteFunction(log) {
  return function writeLogFile (name, cb) {
    var dir = path.join(LOG_DIR, name);

    function readFile (name, cb) {
      fs.readFile(dir, cb);
    }

    function updateLogs (logs, cb) {
      logs.push(log.toJSON());
      cb(null, logs);
    }

    function writeFile (str, cb) {
      fs.writeFile(dir, str, cb);
    }

    async.waterfall([
      readFile,
      safejson.parse,
      updateLogs,
      safejson.stringify,
      writeFile
    ], cb);
  };
}


/**
 * Read a log file with the given name
 * @param  {String}   name
 * @param  {Function} callback
 */
function readLogFile(name, callback) {
  fs.readFile(path.join(LOG_DIR, name), callback);
}


/**
 * Delete a log file with the given name
 * @param  {String}   name
 * @param  {Function} callback
 */
function deleteFile(name, callback) {
  fs.unlink(path.join(LOG_DIR, name), callback);
}


/**
 * [init description]
 * @param  {[type]}   opts     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.init = function (opts, callback) {
  var quota = opts.stroageQuota || DEFAULT_STORAGE_QUOTA;
  uploadFn = opts.uploadFn || null;

  fs.init(quota, callback);
};


/**
 * Write a log to storage for uploading later.
 * @param  {Log} log
 */
exports.writeLog = function (log) {

  // TODO: Idea. Maybe queue Log objects and do this write on an interval?
  // Basically write in batches every second to avoid to many I/O ops

  function writeOp (callback) {
    async.waterfall([
      getMostRecentFilename,
      getRequiredFilename,
      getWriteFunction(log)
    ], callback);
  }

  // Queue this operation with the highest priority
  opQ.push({
    fn: writeOp
  }, TASK_PRIORITY.WRITE);
};


/**
 * Upload the stored logs, using a FIFO strategy.
 */
exports.uploadLogs = function () {

  function uploadOp (callback) {
    async.waterfall([
      getOldestFilename,
      readLogFile,
      uploadFn,
      getOldestFilename,
      deleteFile
    ], callback);
  }

  opQ.push({
    fn: uploadOp
  }, TASK_PRIORITY.UPLOAD);
};
