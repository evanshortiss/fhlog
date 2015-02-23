fhlog
======

Another loggging library!? Yes. But this one is different. It's written with 
both the client and server in mind. It has the same API when runnning on the 
client or server (Node.js), supports being _required_ in Node/Browserified 
apps, and also can be installed using Bower; great news if you want to use the 
same log library on both the client and server! It's also possible to use with 
AngularJS' dependency injection.

## Sample Code
```javascript

var Logger = require('fhlog'); // May also use window.fhlog

Logger.init({
	meta: {
		deviceId: '123321123321'
	}
}, function (err) {

	if (err) {
		// Custom logic to handle it
	}

	// Create a logger for "Stats" component and set the level to DEBUG
	var stats = Logger.getLogger('Stats', {
	    level: Logger.LEVELS.DBG,
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

	stats.d('I won\'t be written to console/stdout. My level is too low.');
	stats.i('I won\'t be written to console/stdout either!');
	stats.w('I\'ll log at WARN level!');
	stats.e('I\'ll log at ERROR level!');

	// Getters / Setters
	stats.getName() // returns 'Stats'
	stats.setName('New Name!') // You probably won't need to use this really

	stats.setLogLevel(Logger.LEVELS.DBG);
	var curLvl = stats.getLogLevel();
	stats.info('My log level is %d', curLvl);

});

```

## Sample Output
If we run the above example the following output is generated.

```

2014-10-01T17:27:57.188Z DBG Stats: I'll log at DEBUG level!
2014-10-01T17:27:57.197Z INF Stats: I'll log at INFO level!
2014-10-01T17:27:57.197Z WRN Stats: I'll log at WARN level!
2014-10-01T17:27:57.197Z ERR Stats: I'll log at ERROR level!
2014-10-01T17:27:57.198Z WRN Stats: I'll log at WARN level!
2014-10-01T17:27:57.198Z ERR Stats: I'll log at ERROR level!
2014-10-01T17:27:57.198Z INF New Name!: My log level is 0

```

## Using with Angular
Works just like it usually does, but can be injected as a service instance into 
other components. Just add it as a dependency of your module.

```javascript
angular.module('MyApp', ['fhlog']);

angular.module('MyApp').service('Heroes', function (fhlog) {
	var log = fhlog.getLogger('Heroes Service');

	var heroes = ['Batman', 'Spiderman', 'Thor'];

	this.get = function () {
		log.d('Getting heroes!');
		return heroes;
	};
})
```

## Uploading Logs to a Server
This feature is not thoroughly tested yet, so be mindful of that. 
Currently it will only work on Chrome, Opera and Cordova applications that 
support the FileSystem API.

Logs can easily be uploaded to a server. Just call the _init_ method on the 
Logger and set an _uploadFn_. This function must accept a string parameter and 
a callback you need to call once the upload process completes or fails. 
The callback function takes a single parameter, an error, if one occured. 
An example is below.

```javascript

function myUploadFn (jsonLogArray, callback) {
	// Do your upload logic...
	if (uploadError) {
		callback(uploadError);
	} else {
		callback(null);
	}
}

// Initialise the logger with an upload function
Logger.init({
	uploadFn: myUploadFn
})

// Anything logged using this logger will be uploaded
// if its logged using INF or higher, they'll also be written
// to the terminal/console
Logger.getLogger('Stats', {
	level: Logger.LEVELS.INF
	upload: true,
	silent: false
});


```

## API

### LoggerFactory
This is the primary interface exposed when you _require_ this module, or on the 
_window.fhlog_ object if you're not using Browserify or Node.js.

##### setDefault(key, val)
Set a default value to use for a paramter when getting a logger. For example 
you might want all loggers to not use colours so you could do this.

```javascript
var fhlog = require('fhlog');

fhlog.setDefault('colourise', false);
```

##### LEVELS
Exposes a way to set log levels. Contains the following keys for use as shown 
in previous examples.

* DBG
* INF
* WRN
* ERR

##### meta
An interface to set/get/remove/replace data in the metadata included with 
each log upload. Check out the Meta section below for more info/

##### init(opts, callback)
Initialise the LoggerFactory (fhlog). You don't need to call this at present 
but it is highly recomended that you do. The options object passed can 
contain:

* meta - Extra data to upload with each log, e.g a uqique device ID or 
username. This must be an object.
* uploadFn - A function that will handle uploading the JSON string of logs.
* storageQuota - The amount of bytes allocated to store log data. This will 
gradually fill up as you use Logger instances that have the _upload_ flag set 
to _true_ but will also decrease as these logs are uploaded.

```javascript
var Logger = require('fhlog');

Logger.init({
	uploadFn: myUploadFn,
	meta: {
		deviceId: '123321123321'
	},
	stroageQuota: 50 * Math.pow(1024, 3) // 50MB of logs can be stored
});

```

##### setGlobalLevel(level)
Set all loggers to the provided level.

##### get/getLogger(name, opts)
Get a logger prefixed with the given _name_. Valid options for the _opts_ are:

* level - Defaults to _LEVELS.DBG_.
* upload - Defaults to _false_.
* silent - Defaults to _false_.
* colourise - Defaults to _true_. Colours don't work in the browser so this is 
ignored.


### Meta
Meta stores data that will be included with each log message that's uploaded. 
For example a device ID or the username that is current logged in. It shouldn't 
be used to hold large payloads and should be strictly minimal metadata.

Meta is a JSON object so it contains key pair data. All added data must be 
valid serialisable JSON as it will be stringified for upload.

##### get(key)
Get the value stored in metadata for _key_;

##### set(key, val)
Store the value _val_ in metadata under the given _key_.

##### remove(key)
Remove the metadata stored for key.

##### replace(obj)
Replace everything in metadata with the provided Object _obj_. This can be an 
empty object. This will throw an exception if the object is not serialisable.


### Logger
Logger instances are returned by _LoggerFactory.getLogger_ 
(or _window.fhlog.getLogger_).

##### LEVELS
The levels the Logger can be set to. Same as _LoggerFactory.LEVELS_

##### setSilent(Boolean)
Set this Logger to suppress printing logs to th _console_ or _stdout/sterr_

##### isSilent()
Detect if this Logger is silent or not. Returns a Boolean

##### debug(str[, args]) / d(str[, args])
Print a log at DBG level. Works like regular console.debug.

##### info(str[, args]) / i(str[, args])
Print a log at INF level. Works like regular console.info.

##### warn(str[, args]) / w(str[, args])
Print a log at WRN level. Works like regular console.warn.

##### error(str[, args]) / e(str[, args])
Print a log at ERR level. Works like regular console.error.

##### err(str)
Shorthand for the _error_ method. *Deprecated*.

##### setLogLevel(LogLevel)
Set the level of this logger.

##### getLogLevel(str)
Get the level of this logger.

##### getName(str)
Get the name of this logger.

##### setName(str)
Set the name of this logger.


## Contributing
Contributions are always welcome! There is no formal style guide, just follow 
the style already present in the codebase and be sure to run the tests.

Running the tests will execute them in the Chrome browser and Node.js. You need 
to accept a FileSystem storage request during this time in Chrome.
