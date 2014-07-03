Logger
======

JavaScript log library with namespaced and timestamped logs. Can be used in 
Node.js and the Browser.


## Sample Code
```javascript
var Loggr = require('logger'); // May also use window.Loggr

// Create a logger for "Stats" component
var stats = Loggr.getLogger('Stats', Logger.LEVELS.DEBUG);

// Log levels
stats.log('I\'ll log at DEBUG level!');
stats.debug('I\'ll log at DEBUG level too!');
stats.info('I\'ll log at INFO level!');
stats.warn('I\'ll log at WANR level!');
stats.error('I\'ll log at ERROR level!');

// Getters / Setters
stats.getName() // returns 'Stats'
stats.setName('New Name!') // You probably won't need to use this really

stats.setLevel(Loggr.LEVELS.WARN);
stats.getLevel(); // Returns level as a Number
```
