// Github: http://github.com/ncr/node.ws.js
// Compatible with node v0.1.91
// Author: Jacek Becela
// License: MIT
// Based on: http://github.com/Guille/node.websocket.js

function nano(template, data) {
  return template.replace(/\{([\w\.]*)}/g, function (str, key) {
    var keys = key.split("."), value = data[keys.shift()];
    keys.forEach(function (key) { value = value[key] });
    return value;
  });
}

var sys = require("sys"),
  net = require("net"),
  headerExpressions = [
    /^GET (\/[^\s]*) HTTP\/1\.1$/,
    /^Upgrade: WebSocket$/,
    /^Connection: Upgrade$/,
    /^Host: (.+)$/,
    /^Origin: (.+)$/
  ],
  handshakeTemplate = [
    'HTTP/1.1 101 Web Socket Protocol Handshake', 
    'Upgrade: WebSocket', 
    'Connection: Upgrade',
    'WebSocket-Origin: {origin}',
    'WebSocket-Location: ws://{host}{resource}',
    '',
    ''
  ].join("\r\n"),
  policy_file = '<cross-domain-policy><allow-access-from domain="*" to-ports="*" /></cross-domain-policy>';

exports.createServer = function (websocketListener) {
  return net.createServer(function (socket) {
    socket.setTimeout(0);
    socket.setNoDelay(true);
    socket.setEncoding("utf8");

    var emitter = new process.EventEmitter(),
      handshaked = false,
      buffer = "";
      
    function handle(data) {
      buffer += data;
      
      var chunks = buffer.split("\ufffd"),
        count = chunks.length - 1; // last is "" or a partial packet
        
      for(var i = 0; i < count; i++) {
        var chunk = chunks[i];
        if(chunk[0] == "\u0000") {
          emitter.emit("data", chunk.slice(1));
        } else {
          socket.end();
          return;
        }
      }
      
      buffer = chunks[count];
    }

    function handshake(data) {
      var headers = data.split("\r\n");

      if(/<policy-file-request.*>/.exec(headers[0])) {
        socket.write(policy_file);
        socket.end();
        return;
      }

      var matches = [], match;
      for (var i = 0, l = headerExpressions.length; i < l; i++) {
        match = headerExpressions[i].exec(headers[i]);

        if (match) {
          if(match.length > 1) {
            matches.push(match[1]);
          }
        } else {
          socket.end();
          return;
        }
      }

      socket.write(nano(handshakeTemplate, {
        resource: matches[0],
        host:     matches[1],
        origin:   matches[2],
      }));

      handshaked = true;
      emitter.emit("connect", matches[0]);
    }

    socket.addListener("data", function (data) {
      if(handshaked) {
        handle(data);
      } else {
        handshake(data);
      }
    }).addListener("end", function () {
      socket.end();
    }).addListener("close", function () {
      if (handshaked) { // don't emit close from policy-requests
        emitter.emit("close");
      }
    });

    emitter.remoteAddress = socket.remoteAddress;
    
    emitter.write = function (data) {
      try {
        socket.write('\u0000', 'binary');
        socket.write(data, 'utf8');
        socket.write('\uffff', 'binary');
      } catch(e) { 
        // Socket not open for writing, 
        // should get "close" event just before.
        socket.end();
      }
    }
    
    emitter.end = function () {
      socket.end();
    }
    
    websocketListener(emitter); // emits: "connect", "data", "close", provides: write(data), end()
  });
}
