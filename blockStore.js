var aws = require('aws-sdk');
var Block = require('./Block');

var s3 = new aws.S3();

exports.upload = function(block, cb) {
  s3.upload({
    'Bucket': 'baynet-blocks',
    'Key': block.hash,
    'Body': block.contents
  }, function(err) {
    if (err) return cb(err);
    return cb(null);
  });
}

exports.uploadBuffer = function(buf, cb) {
  var block = Block.fromBuffer(buf);
  exports.upload(block, function(err) {
    if (err) return cb(err);
    cb(null, block.hash);
  });
}

exports.fetch = function(hash, cb) {
  s3.getObject({
    'Bucket': 'baynet-blocks',
    'Key': thisBlock.hash,
  }, function(err, data) {
    if (err) return cb(err);
    cb(null, new Block.Block({
      'hash': hash,
      'contents': data.Body
    }));
  });
}

s3.listBuckets(function(err, data) {
  if (err) {
    throw 'unable to list s3 buckets, check credentials'
  }
  else {
    for (var index in data.Buckets) {
      var bucket = data.Buckets[index];
      if (bucket.Name === 'baynet-blocks') {
        return console.log('s3 ok');
      }
    }
    throw 'unable to find bucket baynet-blocks';
  }
});