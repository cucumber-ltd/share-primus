var Duplex = require('stream').Duplex;

// Workaround for https://github.com/primus/primus/issues/121
module.exports = function sparkStream(spark) {
  var stream = new Duplex({objectMode: true});

  stream._write = function (chunk, encoding, callback) {
    spark.write(chunk);
    callback();
  };

  stream._read = function() {};

  stream.on('error', function () {
    client.stop();
  });

  spark.on('data', function (data) {
    stream.push(data);
  });

  spark.on('close', function () {
    stream.emit('close');
    stream.emit('end');
    stream.end();
  });

  return stream;
};

