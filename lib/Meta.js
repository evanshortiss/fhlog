'use strict';

var meta = {};

/**
 * Checks that metadata supplied is the correct format.
 * @param  {Object} m
 */
function verifyMeta (m) {
  if (typeof m !== 'object') {
    throw new Error('Meta for logs must be a serialisable object.');
  }

  try {
    JSON.stringify(m);
  } catch (e) {
    throw new Error('Meta for logs must be a serialisable object.');
  }
}


/**
 * Replace the entire meta object with an object.
 * @param  {Object} m
 */
function replace (m) {
  verifyMeta(m);

  meta = m;
}


/**
 * Remove a key from the metadata.
 * @param  {String} key Key to remove from meta object
 * @return {Bool}       Success or failure flag
 */
function remove(key) {
  return delete meta[key];
}


/**
 * Get the stored metadata
 * @return {Object}
 */
function get () {
  return meta;
}


/**
 * Set the stored metadata.
 * This must be a serialisable JSON object
 * @param {Object} m
 */
function set (key, val) {
  meta[key] = val;
}

module.exports = {
  replace: replace,
  remove: remove,
  get: get,
  set: set
};
