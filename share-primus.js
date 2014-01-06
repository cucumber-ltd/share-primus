(function (window) {
  'use strict';

  window.sharejs.Connection.prototype.bindToSocket = function(stream) {
    var connection = this;

    this.state = 'connected';
    this.canSend = true;
    
    this.socket = {
      send: function(msg) {
        console.log('c->s', JSON.stringify(msg));
        stream.write(msg);
      }
    };

    stream.on('open', function() {
      console.log('OPEN');
      connection._setState('connected');
    });

    stream.on('close', function() {
      connection._setState('disconnected');
    });

    stream.on('data', function(msg) {
      console.log('s->c', JSON.stringify(msg));
      try {
        connection.handleMessage(msg);
      } catch (e) {
        connection.emit('error', e);
        throw e
      }
    });
  };
})(window);

