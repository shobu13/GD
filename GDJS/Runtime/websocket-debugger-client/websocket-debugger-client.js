gdjs.WebsocketDebuggerClient = function(runtimegame) {
  this._runtimegame = runtimegame;

  if (typeof WebSocket !== 'undefined') {
    var that = this;
    var ws = (this._ws = new WebSocket('ws://127.0.0.1:3030/'));

    ws.onopen = function open() {
      console.info('Debugger connection open');
    };

    ws.onclose = function close() {
      console.info('Debugger connection closed');
    };

    ws.onerror = function errored(error) {
      console.warn('Debugger client error:', error);
    };

    ws.onmessage = function incoming(message) {
      var data = null;
      try {
        data = JSON.parse(message.data);
      } catch (e) {
        console.info('Debugger received a badly formatted message');
      }

      if (data && data.command) {
        if (data.command === 'play') {
          runtimegame.pause(false);
        } else if (data.command === 'pause') {
          runtimegame.pause(true);
          that.sendRuntimeGameDump();
        } else {
          console.info(
            'Unknown command "' + data.command + '" received by the debugger.'
          );
        }
      } else {
        console.info('Debugger received a message with badly formatted data.');
      }
    };
  } else {
    console.log("WebSocket is not defined, debugger won't work");
  }
};

gdjs.DebuggerClient = gdjs.WebsocketDebuggerClient; //Register the class to let the engine use it.

gdjs.WebsocketDebuggerClient.prototype.sendRuntimeGameDump = function() {
  if (!this._ws) {
    console.warn('No connection to debugger opened to send RuntimeGame dump');
    return;
  }

  var that = this;
  var message = {
    command: 'dump',
    payload: this._runtimegame,
  };

  // This stringify message, including message, avoiding circular references.
  var cache = []; // Cache should be used only once.
  var stringifiedMessage = JSON.stringify(message, function(key, value) {
    if (value === that._runtimegame.getGameData())
      return '[Game data removed from the debugger]';

    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return;
      }
      cache.push(value);
    }
    return value;
  });
  cache = null; // Enable garbage collection

  this._ws.send(stringifiedMessage);
};
