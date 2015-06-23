var dgram = require('dgram');

var cmd = [
	0x54, 0x46, 0x36, 0x7A, 0x60,
	0x02, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x03, 0x03, 0x01, 0x00,
	0x26, 0x00, 0x00, 0x00, 0x00,
	0x02, 0x34, 0xC2
];

var cmdMsg = new Buffer(cmd);

var fs = require('fs');

// Listening
var socket = dgram.createSocket('udp4');
socket.bind(2068, function() {
	socket.addMembership('226.2.2.2', '192.168.168.100');
});

// Heartbeat
var ctrl = dgram.createSocket('udp4');
ctrl.bind(48689, function() {
	setInterval(function() {
		ctrl.send(cmdMsg, 0, cmdMsg.length, 48689, '192.168.168.55', function(err) {
			if (err)
				ctrl.close();
		});
	}, 3000);
});

