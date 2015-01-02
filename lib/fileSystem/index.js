'use strict';

/**
 * This setup for fs is required as globally replacing fs with html5-fs
 * won't enable the project to use brfs to "read" files for bundling
 */

module.exports = require('fs');
