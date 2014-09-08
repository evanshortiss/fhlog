!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.fhlog=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

module.exports = {
  'DEBUG': 0,
  'INFO': 1,
  'WARN': 2,
  'ERROR': 3
};

},{}],2:[function(_dereq_,module,exports){
'use strict';

var util = _dereq_('util')
  , transport = _dereq_('./transport')
  , LEVELS = _dereq_('./Levels');

/**
 * @public
 * @constructor
 *
 */
function Log(level, name, args) {
  args = Array.prototype.slice.call(args);

  var ts = Date.now()
    , lvlStr = ''
    , prefix = '';

  switch (level) {
    case LEVELS.DEBUG:
      lvlStr = 'DEBUG';
      break;
    case LEVELS.INFO:
      lvlStr = 'INFO';
      break;
    case LEVELS.WARN:
      lvlStr = 'WARN';
      break;
    case LEVELS.ERROR:
      lvlStr = 'ERROR';
      break;
  }

  // Build log prefix
  prefix = util.format('%s %s %s: ', new Date(ts).toJSON(), lvlStr, name);

  // Normalise first arg to a include our string if necessary
  if (typeof args[0] === 'string') {
    args[0] = prefix + args[0];
  }

  // Format the string so we can save it and output it correctly
  this.text = util.format.apply(util, args);
  this.ts = ts;
  this.level = level;
  this.name = name;
}
module.exports = Log;


/**
 * Write the contents of this log to output transport
 * @param   {Boolean} silent
 * @return  {String}
 */
Log.prototype.print = function (print) {
  if (print) {
    transport.log(this.level, this.text);
  }

  return this.text;
};


/**
 * Get the date that this log was created.
 * @return {String}
 */
Log.prototype.getDate = function () {
  return new Date(this.ts).toJSON().substr(0, 10);
};


/**
 * Return a JSON object representing this log.
 * @return {Object}
 */
Log.prototype.toJSON = function () {
  return {
    ts: this.ts,
    text: this.text,
    name: this.name,
    level: this.level
  };
};

},{"./Levels":1,"./transport":8,"util":12}],3:[function(_dereq_,module,exports){
(function (process){
'use strict';

var Log = _dereq_('./Log')
  , LEVELS = _dereq_('./Levels');

if (process && typeof window === 'undefined') {
  var Storage = _dereq_('./Storage');
}

/**
 * @constructor
 * Wrapper for the console object.
 * Should behave the same as console.METHOD
 * @param {String}    [name]    Name of this logger to include in logs.
 * @param {Number}    [level]   Level to use for calls to .log
 * @param {Boolean}   [upload]  Determines if logs are uploaded.
 * @param {Boolean}   [silent]  Flag indicating if we print to stdout or not.
 */
function Logger (name, level, upload, silent) {
  this._logLevel = level || this.LEVELS.DEBUG;
  this._name = name || '';
  this._upload = upload || false;
  this._silent = silent || false;
}
module.exports = Logger;

Logger.prototype.LEVELS = LEVELS;
Logger.LEVELS = LEVELS;


/**
 * @private
 * Log output to stdout with format: "2014-06-26T16:42:11.139Z LoggerName:"
 * @param   {Number}  level
 * @param   {Array}   args
 * @return  {String}
 */
Logger.prototype._log = function(level, args) {
  var l = new Log(level, this.getName(), args);

  if (Storage && this._upload) {
    Storage.writeLog(l);
  }

  return l.print(!this.isSilent());
};


/**
 * @public
 * Toggle printing out logs to stdout.
 * @param {Boolean} silent
 */
Logger.prototype.setSilent = function (silent) {
  this._silent = silent || false;
};


/**
 * @public
 * Determine if this logger is printing to stdout.
 * @returns {Boolean}
 */
Logger.prototype.isSilent = function () {
  return this._silent;
};


/**
 * @public
 * Log a message a current log level
 * Log a string and return the string value of the provided log args.
 * This operates in the same manner as console.
 * @param [arguments] arguments The list of args to log.
 * @returns {String}
 */
Logger.prototype.log = function () {
  return this._log(this.getLogLevel(), arguments);
};


/**
 * @public
 * Log a message at 'DEBUG' level
 * Log a string and return the string value of the provided log args.
 * This operates in the same manner as console.debug
 * @param [arguments] arguments The list of args to log.
 * @returns {String}
 */
Logger.prototype.debug = function () {
  return this._log(LEVELS.DEBUG, arguments);
};


/**
 * @public
 * Log a message at 'INFO' level
 * Log a string and return the string value of the provided log args.
 * This operates in the same manner as console.info
 * @param [arguments] arguments The list of args to log.
 * @returns {String}
 */
Logger.prototype.info = function () {
  return this._log(LEVELS.INFO, arguments);
};


/**
 * @public
 * Log a message at 'WARN' level
 * Log a string and return the string value of the provided log args.
 * This operates in the same manner as console.warn
 * @param [arguments] arguments The list of args to log.
 * @returns {String}
 */
Logger.prototype.warn = function () {
  return this._log(LEVELS.WARN, arguments);
};


/**
 * @public
 * Log a message at 'ERROR' level
 * Log a string and return the string value of the provided log args.
 * This operates in the same manner as console.error
 * @param [arguments] arguments The list of args to log.
 * @returns {String}
 */
Logger.prototype.err = function () {
  return this._log(LEVELS.ERROR, arguments);
};


/**
 * @public
 * Log a message at 'ERROR' level
 * Log a string and return the string value of the provided log args.
 * This operates in the same manner as console.error
 * @param [arguments] arguments The list of args to log.
 * @returns {String}
 */
Logger.prototype.error = Logger.prototype.err;


/**
 * @public
 * Set the level of this logger for calls to the .log instance method.
 * @param {Number} lvl
 */
Logger.prototype.setLogLevel = function (lvl) {
  this._logLevel = lvl;
};


/**
 * @public
 * Get the level of this logger used by calls to the .log instance method.
 * @returns {Number}
 */
Logger.prototype.getLogLevel = function () {
  return this._logLevel;
};


/**
 * @public
 * Get the name of this logger.
 * @returns {String}
 */
Logger.prototype.getName = function () {
  return this._name;
};


/**
 * @public
 * Set the name of this logger. It would be very unusual to use this.
 * @param {String} name
 */
Logger.prototype.setName = function(name) {
  this._name = name;
};

}).call(this,_dereq_("FWaASH"))
},{"./Levels":1,"./Log":2,"./Storage":5,"FWaASH":10}],4:[function(_dereq_,module,exports){
'use strict';

var Logger = _dereq_('./Logger')
  , Uploader = _dereq_('./Uploader')
  , LEVELS = _dereq_('./Levels');


// Map of loggers created. Same name loggers exist only once.
var loggers = {};

/**
 * @constructor
 * @private
 * Used to create instances
 */
function LoggerFactory () {
  this.LEVELS = LEVELS;
}

module.exports = new LoggerFactory();

/**
 * @public
 * Get a named logger instance creating it if it doesn't already exist.
 * @param   {String}    [name]
 * @param   {Number}    [level]
 * @param   {Boolean}   [upload]
 * @param   {Boolean}   [silent]
 * @returns {Logger}
 */
LoggerFactory.prototype.getLogger = function (name, level, upload, silent) {
  name = name || '';

  if (upload) {
    Uploader.startInterval();
  }

  if (loggers[name]) {
    return loggers[name];
  } else {
    loggers[name] = new Logger(name, level, upload, silent);

    return loggers[name];
  }
};


/**
 * @public
 * Set the function that will be used to upload logs.
 * @param {Function} uploadFn
 */
LoggerFactory.prototype.setUploadFn = Uploader.setUploadFn;


/**
 * @public
 * Force logs to upload at this time.
 * @param {Function} [callback]
 */
LoggerFactory.prototype.upload = Uploader.upload;

},{"./Levels":1,"./Logger":3,"./Uploader":6}],5:[function(_dereq_,module,exports){
'use strict';

// Filthy hack for node.js testing, in the future storage should be shelled
// out to storage adapter classes and this acts as an interface only
var w = {};
if (typeof window !== 'undefined') {
  w = window;
}

var ls = w.localStorage
  , safejson = _dereq_('safejson');

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

},{"safejson":13}],6:[function(_dereq_,module,exports){
'use strict';

var Storage = _dereq_('./Storage')
  , safejson = _dereq_('safejson');


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

},{"./Storage":5,"safejson":13}],7:[function(_dereq_,module,exports){
'use strict';

var LEVELS = _dereq_('../Levels');

/**
 * Logs output using the browser's console object.
 * @private
 * @param {Number} level
 * @param {String} str
 */
module.exports = function (level, str) {
  var logFn = null;

  switch (level) {
    case LEVELS.DEBUG:
      logFn = console.debug || console.log;
      break;
    case LEVELS.INFO:
      logFn = console.info || console.log;
      break;
    case LEVELS.WARN:
      logFn = console.warn;
      break;
    case LEVELS.ERROR:
      logFn = console.error;
      break;
    default:
      logFn = console.log;
      break;
  }

  logFn.call(console, str);
};

},{"../Levels":1}],8:[function(_dereq_,module,exports){
'use strict';


exports.transports = {
  'console': _dereq_('./console')
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

},{"./console":7}],9:[function(_dereq_,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],10:[function(_dereq_,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],11:[function(_dereq_,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],12:[function(_dereq_,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = _dereq_('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = _dereq_('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,_dereq_("FWaASH"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":11,"FWaASH":10,"inherits":9}],13:[function(_dereq_,module,exports){
(function (process){
// Determines wether actions should be deferred for processing
exports.defer = false;


/**
 * Defer a function call momentairly.
 * @param {Function} fn
 */
function deferred(fn) {
  if (exports.defer === true) {
    process.nextTick(fn);
  } else {
    fn();
  }
}


/**
 * Stringify JSON and catch any possible exceptions.
 * @param {Object}    json
 * @param {Function}  [replacer]
 * @param {Number}    [spaces]
 * @param {Function}  callback
 */
exports.stringify = function (/*json, replacer, spaces, callback*/) {
  var args = Array.prototype.slice.call(arguments)
    , callback = args.splice(args.length - 1, args.length)[0];

  deferred(function() {
    try {
      return callback(null, JSON.stringify.apply(null, args));
    } catch (e) {
      return callback(e, null);
    }
  });
};


/**
 * Parse string of JSON and catch any possible exceptions.
 * @param {String}    json
 * @param {Function}  [reviver]
 * @param {Function}  callback
 */
exports.parse = function (/*json, reviver, callback*/) {
  var args = Array.prototype.slice.call(arguments)
    , callback = args.splice(args.length - 1, args.length)[0];

  deferred(function() {
    try {
      return callback(null, JSON.parse.apply(null, args));
    } catch (e) {
      return callback(e, null);
    }
  });
};
}).call(this,_dereq_("FWaASH"))
},{"FWaASH":10}]},{},[4])
(4)
});