var md5 = require('MD5');

function Block(init) {
  init = init || {};
  this.hash = init.hash;
  this.contents = init.contents;
}

exports.fromBuffer = function(buf, cb) {
  // in case md5 needs to be done in a separate process
  cb(null, new Block({
    'contents': buf,
    'hash': md5(buf),
  }));
}