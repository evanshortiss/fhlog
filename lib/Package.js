'use strict';

// This is replaced using the brfs transform
var fs = require('fs');

var pkg = fs.readFileSync(__dirname + '/../package.json', 'utf8');

pkg = JSON.parse(pkg);

exports.get = function (key) {
  return pkg[key];
};
