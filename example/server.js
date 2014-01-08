var format = require('util').format;
var http = require('http');
var connect = require('connect');
var livedb = require('livedb');
var livedbMongo = require('livedb-mongo');
var share = require('share');
var sharePrimus = require('../lib');
var Primus = require('primus');
var argv = require('optimist').argv;

var app = connect(
  connect.static(__dirname),
  connect.static(share.scriptsDir),
  connect.static(sharePrimus.scriptsDir)
);
var server = http.createServer(app);
var primus = new Primus(server, { transformer: argv.transformer });
primus.use('substream', require('substream'));

var backend = livedb.client(livedbMongo('localhost:27017/test?auto_reconnect', {safe:false}));
var shareClient = share.server.createClient({backend:backend});
primus.on('connection', function (spark) {
  var shareSpark = spark.substream('share');
  // Workaround for https://github.com/primus/primus/issues/121
  shareClient.listen(sharePrimus.sparkStream(shareSpark));

  // Send some non-share messages over the same stream
  // Inspired by https://github.com/einaros/ws/blob/master/examples/serverstats/server.js
  console.log('New client');
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

