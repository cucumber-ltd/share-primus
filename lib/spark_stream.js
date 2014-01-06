var Duplex = require('stream').Duplex;

module.exports = function sparkStream(spark) {
  var stream = new Duplex({objectMode: true});

  stream._write = function (chunk, encoding, callback) {
    console.log('s->c', JSON.stringify(chunk));
    spark.write(chunk);
    callback();
  };

  stream._read = function() {};

  stream.on('error', function (msg) {
    client.stop();
  });

  spark.on('data', function (data) {
    console.log('c->s', JSON.stringify(data));
    stream.push(data);
  });

  spark.on('close', function () {
    stream.emit('close');
    stream.emit('end');
    stream.end()
  });

  return stream;
};

