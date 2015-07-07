var fs = require('fs');
var block = require('./Block')

var BYTES_IN_MB = 1000000;

function FileData(init) {
  init = init || {};
  this.blocks = init.blocks || [];
  this.contents = init.contents;
}

FileData.prototype.appendBlock = function(block_hash) {
  this.blocks.push(block_hash);
  return this;
}

FileData.prototype.getBlockHashes = function() {
  return this.blocks.map(function(block) {
    return block.hash;
  });
}

FileData.prototype.setBlocks = function(cb) {
  var thisFd = this;

  var populate = function(fd, buf) {
    // console.log(buf.length);
    if (buf.length < BYTES_IN_MB) {
      var new_block = block.fromBuffer(buf);
      cb(null, thisFd.appendBlock(new_block));
    } else {
      var new_block = block.fromBuffer(buf.slice(0, BYTES_IN_MB));
      thisFd.appendBlock(new_block);
      return populate(thisFd, buf.slice(BYTES_IN_MB));
    }
  }

  return populate(thisFd, thisFd.contents);

}

exports.fromBuffer = function(buf, cb) {
  new FileData({
    'contents': buf,
  }).setBlocks(cb);
}

exports.fromPath = function(path, cb) {
  fs.readFile(path, function(err, data) {
    if (err) return cb(err);
    exports.fromBuffer(data, cb);
  });
}