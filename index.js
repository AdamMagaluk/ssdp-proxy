var dgram = require('dgram');
var Client = require('node-ssdp').Client;
var client = new Client();

if (!process.argv[2]) {
  console.error("Usage: ssdp-proxy <forward-address>");
  process.exit(1);
}

var forwardAddress = process.argv[2];

function sendSearch() {
  client.search('ssdp:all');
}
sendSearch();
setInterval(sendSearch, 5000);

var s = dgram.createSocket('udp4');
s.on('error', function(err) {
  console.error('Socket Error:', err);
  process.exit(1);
});

s.on('close', function() {
  console.log('Socket Close');
  process.exit(0);
});

s.bind(1900, function() {
  s.addMembership('239.255.255.250');
});

s.on('message', function(msg, rinfo) {
  forwardMsg(msg);
});

function forwardMsg(buf) {
  var socket = dgram.createSocket('udp4');
  socket.send(buf, 0, buf.length, 1900, forwardAddress, function(err) {
    if(err) {
      console.log('Failed to forward:', err);
    }
    console.log('Forwarded')
  });
}


