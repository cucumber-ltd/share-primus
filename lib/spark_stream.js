var Duplex = require('stream').Duplex;
var inherits = require('util').inherits;

// Workaround for https://github.com/primus/primus/issues/121


function SparkStream(spark) {
  if (!(this instanceof SparkStream)) return new SparkStream(spark);

  Duplex.call(this, {
    objectMode: true,
    allowHalfOpen: false
  });

  // Store a reference to the underlying spark stream
  this._spark = spark;

  // Listen to data events from the spark and push them
  // into the stream.
  spark.on('data', this.push.bind(this));

  // Listen to the close event of the spark stream.
  //spark.on('close', this.push.bind(this, null));
  spark.on('end', function () {
    this.resume();
    this.push(null);
  }.bind(this));

  // Emit error events
  spark.on('error', this.emit.bind(this, 'error'));
}

inherits(SparkStream, Duplex);

// Implement the `_write` method for the writable part of the
// Duplex stream.
SparkStream.prototype._write = function (chunk, encoding, cb) {
  this._spark.write(chunk);
  cb();
};

// Implement the `_read` method for th readable part of the
// Duplex stream.
SparkStream.prototype._read = function () {
};


module.exports = SparkStream;
