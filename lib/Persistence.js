'use strict';

var safejson = require('safejson')
  , async = require('async')
  , path = require('path')
  , fs = require('./fileSystem')
  , _ = require('lodash');


// Priority based queue to store log file ops.
// Writes are highest priority, we don't want to lose logs!
var opQ = async.priorityQueue(runQueueTask, 1);

// Function that must be set to upload logs to a remote endpoint
var uploadFn = null;

// Tracks if this component has been initialisd
var initialised = false;

var LOG_DIR = './fhlogs'
  , FILE_EXT = '.txt'
  , TASK_PRIORITY = {
    WRITE: 1,
    UPLOAD: 2,
  }
  , DEFAULT_STORAGE_QUOTA = 25 * Math.pow(1024, 3) // Max log storage is 25MB
  , MAX_FILE_SIZE = 10 * Math.pow(1024, 2); // Max file size is 10KB


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
    } else if (!files || files.length === 0) {
      return callback(null, Date.now().toString().concat(FILE_EXT));
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
    } else if (!files || files.length === 0) {
      return callback(null, Date.now().toString().concat(FILE_EXT));
    } else {
      var file = _.max(files, function (f) {
        var n = (f && typeof f.name === 'string') ? f.name : f;

        // Remove extension to get just the timestamp
        var ts = n.replace(FILE_EXT, '');

        return parseInt(ts, 10);
      });

      var n = (file && typeof file.name === 'string') ? file.name : file;

      callback(null, n);
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
    fs.writeFile(filepath, '[]', function (err) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, name);
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
  return function writeLogFile (name, qcb) {
    var dir = path.join(LOG_DIR, name);

    function readFile (cb) {
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
    ], qcb);
  };
}


/**
 * Read a log file with the given name
 * @param  {String}   name
 * @param  {Function} callback
 */
function getLogsObject (name, callback) {
  fs.readFile(path.join(LOG_DIR, name), function (err, data) {
    if (err) {
      return callback(err, null);
    }

    safejson.parse(data, function (err, logArray) {
      if (err) {
        return callback(err, null);
      }

      callback(null, {
        logs: logArray
      });
    });
  });
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
 * Initialise this component for uploads.
 * @param  {Object}   opts
 * @param  {Function} callback
 */
exports.init = function (opts, callback) {
  var quota = opts.stroageQuota || DEFAULT_STORAGE_QUOTA;
  uploadFn = opts.uploadFn || null;

  function afterInit (err) {
    if (err) {
      return callback(err, null);
    }

    initialised = true;

    fs.exists(LOG_DIR, function (exists) {
      if (exists) {
        return callback(null, null);
      }

      fs.mkdir(LOG_DIR, callback);
    });
  }

  if (fs.init) {
    fs.init(quota, afterInit);
  } else {
    afterInit();
  }
};


/**
 * Write a log to storage for uploading later.
 * @param  {Log} log
 * @param  {Function} callback
 */
exports.writeLog = function (log, callback) {
  if (!initialised) {
    if (callback) {
      return callback('Cannot write log to storage. The file system never ' +
        ' initialised.', null);
    } else {
      return console.log('fhlog: Cannot write logs as FileSystem' +
        ' wasn\'t initialised');
    }
  }

  // TODO: Idea. Maybe queue Log objects and do this write on an interval?
  // Basically write in batches every second to avoid to many I/O ops

  function writeOp (qcb) {
    async.waterfall([
      getMostRecentFilename,
      getRequiredFilename,
      getWriteFunction(log)
    ], qcb);
  }

  // Queue this operation with the highest priority
  opQ.push({
    fn: writeOp
  }, TASK_PRIORITY.WRITE, callback);
};


/**
 * Upload the stored logs, using a FIFO strategy.
 * @param {Function} callback
 */
exports.uploadLogs = function (callback) {

  function uploadOp (qcb) {
    async.waterfall([
      getOldestFilename,
      getLogsObject,
      safejson.stringify,
      uploadFn,
      getOldestFilename,
      deleteFile
    ], qcb);
  }

  opQ.push({
    fn: uploadOp
  }, TASK_PRIORITY.UPLOAD, callback);
};
