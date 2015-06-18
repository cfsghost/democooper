var dgram = require('dgram');

var socket = dgram.createSocket('udp4');

socket.bind(2068);

socket.on('message', function(msg, info) {
	console.log(msg);
});
