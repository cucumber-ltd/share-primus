var chai = require('chai')
chai.use(require('sinon-chai'));
var expect = chai.expect;
var EventEmitter = require('events').EventEmitter;
var sinon = require('sinon');
var Primus = require('primus');
var Spark = Primus.Spark;
var http = require('http');

var SparkStream = require('../lib/spark_stream');


describe('SparkStream', function () {
  it('is instantiable', function () {
    var spark = new Spark(new Primus(http.createServer()));
    expect(new SparkStream(spark)).to.be.an.instanceOf(SparkStream);
  });

  it('writes to the underlying spark', function () {
    var spark = new EventEmitter();
    spark.write = sinon.stub();
    var stream = new SparkStream(spark);
    stream.write('hello world');
    expect(spark.write).to.have.been.calledWith('hello world');
  });

  it('emits data from the underlying spark', function (done) {
    var spark = new EventEmitter();
    var stream = new SparkStream(spark);
    stream.on('data', function (data) {
      expect(data).to.be.eql('hello world');
      done();
    });
    spark.emit('data', 'hello world');
  });

  it('emits an end event when the spark stream closes', function (done) {
    var spark = new EventEmitter();
    var stream = new SparkStream(spark);

    stream.on('end', function () {
      done();
    });
    spark.emit('end');
  });
  it('emits a finish event when the spark stream closes', function (done) {
    var spark = new EventEmitter();
    var stream = new SparkStream(spark);

    stream.on('finish', function () {
      done();
    });
    spark.emit('end');
  });
  it('emits an error when the spark stream has an error', function (done) {
    var spark = new EventEmitter();
    var stream = new SparkStream(spark);

    stream.on('error', function (err) {
      expect(err).to.be.eql('error');
      done();
    });
    spark.emit('error', 'error');
  });
});
