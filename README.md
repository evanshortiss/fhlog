fhlog
======

Another loggging library!? Yes. But this one is different. It's written with 
both the client and server in mind. It has the same API when runnning on the 
client or server, supports being _require_d in Node/Browserified apps, and also
can be installed using Bower; great news if you want to use the same log 
library on both the client and server!




## Sample Code
```javascript
'use strict'

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