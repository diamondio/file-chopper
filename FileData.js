
var FileBlock = require('./FileBlock');
var BYTES_IN_MB = 1000000;

function FileData(init) {
  init = init || {};
  this.blocks = init.blocks || [];
  this.contents = init.contents;
}
exports.FileData = FileData;

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
  var self = this;

  var populate = function(fd, buf) {
    // console.log(buf.length);
    if (buf.length < BYTES_IN_MB) {
      var new_block = FileBlock.fromBuffer(buf);
      cb(null, self.appendBlock(new_block));
    } else {
      var new_block = FileBlock.fromBuffer(buf.slice(0, BYTES_IN_MB));
      self.appendBlock(new_block);
      return populate(self, buf.slice(BYTES_IN_MB));
    }
  }

  return populate(self, self.contents);

}