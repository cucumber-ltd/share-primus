var format = require('util').format;
var http = require('http');
var connect = require('connect');
var livedb = require('livedb');
var livedbMongo = require('livedb-mongo');
var share = require('share');
var sharePrimus = require('../lib');
var Primus = require('primus');

console.log(share.scriptsDir)

var app = connect(
  connect.static(__dirname),
  connect.static(share.scriptsDir),
  connect.static(sharePrimus.scriptsDir)
);
var server = http.createServer(app);
var primus = new Primus(server);

var backend = livedb.client(livedbMongo('localhost:27017/test?auto_reconnect', {safe:false}));
var shareClient = share.server.createClient({backend:backend});

primus.on('connection', function (spark) {
  shareClient.listen(sharePrimus.sparkStream(spark));
});

var port = 7008;
server.listen(port);
console.log(format("Listening on http://localhost:%d/", port));

