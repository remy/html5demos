var sys = require("sys"),
  ws = require("./ws");

function broadcast(data, from) {
  clients.forEach(function (client) {
    if (client != from) {
      try {
        client.write(data);
      } catch (e) {
        clients.remove(client);
      }
    }
  });
}

Array.prototype.remove = function(e) {
  for (var i = 0; i < this.length; i++)
    if (e == this[i]) return this.splice(i, 1);
}

var clients = [];

ws.createServer(function (websocket) {
  clients.push(websocket);

  websocket.addListener("connect", function (resource) { 
    // emitted after handshake
    sys.debug("connect: " + resource);
    broadcast(clients.length+'');
  }).addListener("data", function (data) { 
    // send data to attached clients
    sys.puts('sending data...');
    broadcast(data, websocket);
  }).addListener("close", function () { 
    // emitted when server or client closes connection
    sys.debug("close");
    clients.remove(websocket);
    broadcast(clients.length+'');
  });
}).listen(parseInt(process.ARGV[2]) || 8000);

