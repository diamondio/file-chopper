var crypto = require('crypto');

/*
Wrapper around a Buffer which allows you to caclulate md5 hash
*/

function md5(buf) {
  return crypto.createHash('md5').update(buf).digest("hex");
}

function FileBlock(init) {
  init = init || {};
  this.hash = init.hash;
  this.contents = init.contents;
}

exports.fromBuffer = function(buf, cb) {
  return new FileBlock({
    'contents': buf,
    'hash': md5(buf),
  });
}

exports.FileBlock = FileBlock;
