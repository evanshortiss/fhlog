fhlog
======

JavaScript log library with namespaced and timestamped logs. Can be used in 
Node.js and the Browser. 

This project is still in early stages of development.


## Sample Code
```javascript
var Logger = require('fhlog'); // May also use window.fhlog

// Create a logger for "Stats" component
var stats = Logger.getLogger('Stats', Logger.LEVELS.DEBUG);

// Log levels
stats.log('I\'ll log at DEBUG level!');
stats.debug('I\'ll log at DEBUG level too!');
stats.info('I\'ll log at INFO level!');
stats.warn('I\'ll log at WANR level!');
stats.error('I\'ll log at ERROR level!');

// Getters / Setters
stats.getName() // returns 'Stats'
stats.setName('New Name!') // You probably won't need to use this really

stats.setLevel(Logger.LEVELS.WARN);
stats.getLevel(); // Returns level as a Number
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
Logger.getLogger('Stats', Logger.LEVELS.DEBUG, true);

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