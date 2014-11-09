var format = require('util').format;
var http = require('http');
var express = require('express');
var livedb = require('livedb');
var share = require('share');
var sharePrimus = require('../lib');
var Primus = require('primus');
var argv = require('optimist').argv;

var app = express();
app.use(express.static(__dirname));
app.use(express.static(share.scriptsDir));
app.use(express.static(sharePrimus.scriptsDir));
var server = http.createServer(app);

var primus = new Primus(server, { transformer: argv.transformer });
primus.use('substream', require('substream'));

var db = new livedb.memory();
var backend = livedb.client(db);
var shareClient = share.server.createClient({backend:backend});

primus.on('connection', function (spark) {
  console.log('New client');
  var shareSpark = spark.substream('share');
  // Workaround for https://github.com/primus/primus/issues/121
  shareClient.listen(new sharePrimus.SparkStream(shareSpark));

  // Send some non-share messages over the same stream
  // Inspired by https://github.com/einaros/ws/blob/master/examples/serverstats/server.js
  var processSpark = spark.substream('process');
  var id = setInterval(function() {
    processSpark.write(JSON.stringify(process.memoryUsage()));
  }, 100);

  spark.on('end', function() {
  	console.log('Lost client');
  	clearInterval(id);
  });
});

var port = argv.port || 7008;
server.listen(port);
console.log(format("Listening on http://localhost:%d/", port));
