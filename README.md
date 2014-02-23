## Share-Primus

[Primus](https://github.com/primus/primus) bindings for [ShareJS](https://github.com/share/ShareJS).

Share-Primus is a client (browser side) extension to ShareJS that lets you use ShareJS with WebSockets, 
BrowserChannel, SockJS or any other streaming library supported by Primus.

Primus also has several useful plugins such as [Substream](https://github.com/primus/substream), which
makes it possible to use the same connection as a transport for several logical streams.

### Browser

Import the scripts:

```html
<script src="/primus/primus.js"></script>
<script src="text.js"></script>
<script src="share.uncompressed.js"></script>
<script src="share-primus.js"></script>
```

Create a connection and subscribe to a document:

```javascript
var primus = new Primus();

var sjs = new window.sharejs.Connection(primus);
var doc = sjs.get('test-collection', 'test-doc');
doc.subscribe();

doc.whenReady(function () {
  if (!doc.type) doc.create('text');
  doc.attachTextarea(document.getElementById('pad'));
});
```

### Server (Node.js)

```javascript
var primus = new Primus(server);
var shareClient = share.server.createClient({backend:backend});

primus.on('connection', function (spark) {
  shareClient.listen(sharePrimus.sparkStream(spark));
});
```

### Run Example

Start the server:

```
node example/server.js --transformer=websockets
```

You can also start the server with other streaming frameworks:

```
node example/server.js --transformer=[websockets|browserchannel|sockjs|engine.io|socket.io]
```

IMPORTANT! When you start the server the first time, Primus will tell you to `npm install`
the underlying streaming framework first. Pay close attention to the error message.

The example code is a little more sophisticated than the code above. 
It also sets up a substream for sending non-sharejs messages over the same connection.

Open a browser: http://localhost:7008/

