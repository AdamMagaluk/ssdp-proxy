var dgram = require('dgram');
var Client = require('node-ssdp').Client;
var client = new Client();

if (!process.argv[2]) {
  console.error("Usage: ssdp-proxy <forward-address>");
  process.exit(1);
}

var forwardAddress = process.argv[2];
var urn = process.argv[3] || 'ssdp:all';
function sendSearch() {
  client.search(urn);
}
sendSearch();
setInterval(sendSearch, 5000);

client.sock.on('message', function(buf, rinfo) {
  forwardMsg(buf, rinfo);
});

function forwardMsg(buf, rinfo) {
  var socket = dgram.createSocket('udp4');
  console.log(buf.toString())
  socket.send(buf, 0, buf.length, 1900, forwardAddress, function(err) {
    if(err) {
      console.log('Failed to forward:', err);
    }
  });
}


