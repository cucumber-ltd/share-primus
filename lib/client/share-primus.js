(function (window) {
  'use strict';

  // Map Primus ready states to ShareJS ready states.
  var STATES = {};
  STATES[Primus.CLOSED] = 'disconnected';
  STATES[Primus.OPENING] = 'connecting';
  STATES[Primus.OPEN] = 'connected';

  // Override Connection's bindToSocket method with an implementation
  // that understands Primus Stream.
  window.sharejs.Connection.prototype.bindToSocket = function(stream) {
    var connection = this;

    setState(stream.readyState);
    this.canSend = this.state === 'connected'; // Primus can't send in connecting state.

    // Tiny facade so Connection can still send() messages.
    this.socket = {
      send: function(msg) {
        try {
          stream.write(msg);
        } catch(e) {
          connection.emit('error', e);
        }
      }
    };

    stream.on('data', function(msg) {
      try {
        connection.handleMessage(msg);
      } catch (e) {
        connection.emit('error', e);
      }
    });

    stream.on('readyStateChange', function() {
      setState(stream.readyState);
    });

    function setState(readyState) {
      var shareState = STATES[readyState];
      connection._setState(shareState);
    }
  };
})(window);
