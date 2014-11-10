fhlog
======

Another loggging library!? Yes. But this one is different. It's written with 
both the client and server in mind. It has the same API when runnning on the 
client or server (Node.js), supports being _require_d in Node/Browserified 
apps, and also can be installed using Bower; great news if you want to use the 
same log library on both the client and server!


## Sample Code
```javascript

var Logger = require('fhlog'); // May also use window.fhlog

// Create a logger for "Stats" component and set the level to DEBUG
var stats = Logger.getLogger('Stats', {
    level: Logger.LEVELS.DEBUG,
    // upload: true/false - Should these be uploaded?
    // silent: true/false - Silence all output from this logger?
});

// Log levels
stats.debug('I\'ll log at DEBUG level!');
stats.info('I\'ll log at INFO level!');
stats.warn('I\'ll log at WARN level!');
stats.error('I\'ll log at ERROR level!');

// Setting a logger level
stats.setLogLevel(Logger.LEVELS.WARN);

stats.debug('I won\'t be written to console/stdout. My level is too low.');
stats.info('I won\'t be written to console/stdout either!');
stats.warn('I\'ll log at WARN level!');
stats.error('I\'ll log at ERROR level!');

// Getters / Setters
stats.getName() // returns 'Stats'
stats.setName('New Name!') // You probably won't need to use this really

stats.setLogLevel(Logger.LEVELS.DEBUG);
var curLvl = stats.getLogLevel();
stats.info('My log level is %d', curLvl);

```

## Sample Output
If we run the above example the following output is generated.

```

2014-10-01T17:27:57.188Z DEBUG Stats: I'll log at DEBUG level!
2014-10-01T17:27:57.197Z INFO Stats: I'll log at INFO level!
2014-10-01T17:27:57.197Z WARN Stats: I'll log at WARN level!
2014-10-01T17:27:57.197Z ERROR Stats: I'll log at ERROR level!
2014-10-01T17:27:57.198Z WARN Stats: I'll log at WARN level!
2014-10-01T17:27:57.198Z ERROR Stats: I'll log at ERROR level!
2014-10-01T17:27:57.198Z INFO New Name!: My log level is 0

```

## Uploading Logs to a Server
Logs can easily be uploaded to a server. When creating a logger pass a third
parameter as *true*. You must also call *setUploadFn* on the Logger object and 
provide a function that accepts two parameters, a string and a callback 
function. The callback function is setup to follow the Node.js convention of 
taking two parameters; the first being an error if one occured, otherwise it's
null, the second being a result. Currently Logger doesn't look at the result, 
but if an error occurs it will need to be notified via that first parameter 
otherwise your logs will be deleted without having reached your server!

```javascript

Logger.getLogger('Stats', {
	level: Logger.LEVELS.DEBUG
}, true);

// Logs is a JSON String containing an Array of Objects
Logger.setUploadFn(function (logs, callback) {
	$.ajax({
		url: 'someurl.com/logs',
		contentType: 'application/json',
		data: logs
	})
	.success(function() {
		callback(null, null);
	})
	.error(function() {
		callback('CRAP!', null);
	});
});

```

This tells Logger to store and upload logs associated with this logger. Logs 
are stored in window.localStorage (DOM Storage). Once logs are uploaded they 
are deleted from localStorage. Indexing is used to ensure parsing logs for 
upload is as performant as possible as localStorage is blocking for I/O.

## API

### LoggerFactory
This is the primary interface exposed when you require this module, or on the 
_window_ object if you're not using Browserify or Node.js.

#### LEVELS
Exposes a way to set log levels. Contains the following keys for use as shown 
in previous examples.

* DEBUG
* INFO
* WARN
* ERROR

#### setGlobalLevel(level)
Set all loggers to the provided level.

#### getLogger(name, opts)
Get a logger prefixed with the given _name_. Valid options for the _opts_ are:

* level - Defaults to _LEVELS.DEBUG_.
* upload - Defaults to _false_.
* silent - Defaults to _false_.
* colourise - Defaults to _true_. Colours don't work in the browser.

#### setUploadFn(function)
Set the function used to upload logs to a server. This is demonstrated above.

#### upload(callback)
Force the logs to be uploaded. By default they upload once per minute.


### Logger
Logger instances are returned by _LoggerFactory.getLogger_ 
(or _window.fhlog.getLogger_).

#### LEVELS
The levels the Logger can be set to. Same as _LoggerFactory.LEVELS_

#### setSilent(Boolean)
Set this Logger to suppress printing logs to th _console_ or _stdout/sterr_

#### isSilent()
Detect if this Logger is silent or not. Returns a Boolean

#### debug(str)
Print a log at DEBUG level. Works just like regular console.log.

#### info(str)
Print a log at INFO level. Works just like regular console.log.

#### warn(str)
Print a log at WARN level. Works just like regular console.log.

#### error(str)
Print a log at ERROR level. Works just like regular console.log.

#### err(str)
Shorthand for the _error_ method.

#### setLogLevel(LogLevel)
Set the level of this logger.

#### getLogLevel(str)
Get the level of this logger.

#### getName(str)
Get the name of this logger.

#### setName(str)
Set the name of this logger.
