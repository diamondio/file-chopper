var crypto = require('crypto');

function md5(buf) {
  return crypto.createHash('md5').update(buf).digest("hex");
}

function Block(init) {
  init = init || {};
  this.hash = init.hash;
  this.contents = init.contents;
}

exports.fromBuffer = function(buf, cb) {
  return new Block({
    'contents': buf,
    'hash': md5(buf),
  });
}

exports.Block = Block;