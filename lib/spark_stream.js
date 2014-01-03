var Duplex = require('stream').Duplex;

module.exports = function sparkStream(spark) {
  var stream = new Duplex({objectMode: true});

  stream._write = function (chunk, encoding, callback) {
    spark.write(chunk);
    callback();
  };

  stream._read = function() {};

  stream.on('error', function (msg) {
    client.stop();
  });

  spark.on('data', function (data) {
    stream.push(data);
  });

  spark.on('close', function () {
    stream.emit('close');
    stream.emit('end');
    stream.end()
  });

  return stream;
};

