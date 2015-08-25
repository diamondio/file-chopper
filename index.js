var fs = require('fs');
var aws = require('aws-sdk');
var async = require('async');

var FileBlock = require('./FileBlock');
var FileData = require('./FileData');
var config = require('./config');

var s3 = new aws.S3();

exports.fromBuffer = function(buf, cb) {
  new FileData.FileData({
    'contents': buf,
  }).setBlocks(cb);
}

exports.fromPath = function(path, cb) {
  fs.readFile(path, function(err, data) {
    if (err) return cb(err);
    exports.fromBuffer(data, cb);
  });
}

exports.uploadBuffer = function(buf, cb) {
  var block = FileBlock.fromBuffer(buf);

  s3.upload({
    'Bucket': config.BLOCKSTORE_BUCKET_NAME,
    'Key': block.hash,
    'Body': block.contents
  }, function(err) {
    if (err) return cb(err);
    return cb(null);
  });
}

exports.uploadFile = function(filename, buf, cb) {
  s3.upload({
    'Bucket': config.FILESTORE_BUCKET_NAME,
    'Key': filename,
    'Body': buf
  }, function(err) {
    if (err) return cb(err);
    return cb(null);
  });
}

exports.fetchBuffer = function(hash, cb) {
  s3.getObject({
    'Bucket': config.BLOCKSTORE_BUCKET_NAME,
    'Key': hash,
  }, function(err, data) {
    if (err) return cb(err);
    cb(null, data.Body);
  });
}

exports.fetchBuffers = function(hashes, cb) {
  async.map(hashes, exports.fetchBuffer, function(err, res) {
    if (err) return cb(err);
    return cb(null, Buffer.concat(res));
  });
}

exports.test = function (cb) {
  s3.listBuckets(function(err, data) {
    if (err) {
      throw 'unable to list s3 buckets, check credentials'
    }
    else {
      for (var index in data.Buckets) {
        var bucket = data.Buckets[index];
        if (bucket.Name === config.BLOCKSTORE_BUCKET_NAME) {
          return console.log('s3 ok');
        }
      }
      throw 'unable to find config.BLOCKSTORE_BUCKET_NAME' + config.BLOCKSTORE_BUCKET_NAME;
    }
  });
}