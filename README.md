## Share-Primus

[Primus](https://github.com/primus/primus) bindings for [ShareJS](https://github.com/share/ShareJS).

This lets you use ShareJS with WebSockets, BrowserChannel, SockJS and any protocol supported by Primus.

### Browser

Import the scripts:

```html
<script src="text.js"></script>
<script src="share.uncompressed.js"></script>
<script src="share-primus.js"></script>
<script src="/primus/primus.js"></script>
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

See the example for full details.

### Run Example

```
node example/server.js --transformer=[websockets|browserchannel]
```

