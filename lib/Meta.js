'use strict';

var meta = {};

function verifyMeta (m) {
  try {
    JSON.stringify(m);
  } catch (e) {
    throw new Error('Meta for logs must be a serialisable object.');
  }
}

function get () {
  return meta;
}

function set (m) {
  verifyMeta(m);

  meta = m;
}

module.exports = {
  get: get,
  set: set
};
