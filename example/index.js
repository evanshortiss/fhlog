'use strict'

var Logger = require('../lib/LoggerFactory'); // May also use window.fhlog

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
