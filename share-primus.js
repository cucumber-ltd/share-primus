(function (window) {
  'use strict';

  // Map Primus ready states to ShareJS ready states.
  var READY_MAP = {};
  READY_MAP[Primus.OPENING] = 'connecting';
  // Can't set it to 'disconnected' because sharejs doesn't like transiation
  // from  'disconnected' -> 'connected' without a 'connecting' in between.
  // Since primus doesn't emit an event for 'connecting' or readyState change,
  // we'll pretend for Sharejs that we're connecting.
  READY_MAP[Primus.CLOSED] = 'connecting';
  READY_MAP[Primus.OPEN] = 'connected';

  window.sharejs.Connection.prototype.bindToSocket = function(stream) {
    var connection = this;

    this.state = READY_MAP[stream.readyState];
    this.canSend = this.state === 'connected'; // Primus can't send in connecting state
    
    this.socket = {
      send: function(msg) {
        console.log('c->s', JSON.stringify(msg));
        stream.write(msg);
      }
    };

    stream.on('open', function() {
      connection._setState('connected');
    });

    stream.on('reconnect', function() {
      connection._setState('connecting');
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

