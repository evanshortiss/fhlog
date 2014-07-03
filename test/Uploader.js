'use strict';

var assert = require('assert')
  , Uploader = require('../lib/Uploader')

function testUploadFn (str, callback) {
  callback(null, true);
}

describe('Uploader', function () {

  it('#getUploadFn Should return null as it\'s not set yet', function () {
    assert.equal(Uploader.getUploadFn(), null);
  });

  it('#setUploadFn Should set the function used for uploading', function () {
    Uploader.setUploadFn(testUploadFn)
    assert.equal(Uploader.getUploadFn(), testUploadFn);
  });

});
