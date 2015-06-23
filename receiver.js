var http = require('http');
var events = require('events');
var child_process = require('child_process');

var broadcastEngine = new events.EventEmitter();
/*
var h264Engine = new events.EventEmitter();
var h264Encoder = child_process.spawn('ffmpeg', [
	'-re',
	'-y',
	'-i', 'pipe:0',
	'-preset', 'ultrafast',
	'-f', 'h264',
	'-vcodec', 'libx264',
	'pipe:1'
]);

h264Engine.on('close', function() {
	console.log('!?');
});

h264Encoder.stdout.on('data', function(data) {
	h264Engine.emit('data', data);
});
*/
var Cap = require('cap').Cap;
 
var c = new Cap(),
    filter = 'udp and dst port 2068',
    bufSize = 10 * 1024 * 1024,
    buffer = new Buffer(65535);

var linkType = c.open('eth0', filter, bufSize, buffer);

//process.stdout.write('--myboundary\nContent-Type: image/jpeg\n\n');

//h264Encoder.stdin.write('--myboundary\nContent-Type: image/jpeg\n\n');
 
var started = false;

var fps = 0;
function handleData(packet) {
	// Frame ID
	//console.log('frame:', packet.readUInt16BE(0));
	var frame = packet.readUInt16BE(0);
	
//	console.log(dropFrame, frame);
	// part
	var part = packet.readUInt16BE(2);
	var data = packet.slice(4, packet.length);

	if (part == 0) {
//		process.stdout.write('\r\n--myboundary\nContent-Type: image/jpeg\r\n\r\n');
		process.stdout.write(data.toString('binary'), 'binary');

//		h264Encoder.stdin.write('\r\n--myboundary\nContent-Type: image/jpeg\r\n\r\n');
//		h264Encoder.stdin.write(data.toString('binary'), 'binary');

		started = true;

		fps++;
	} else if (started) {
		process.stdout.write(data.toString('binary'), 'binary');

//		h264Encoder.stdin.write(data.toString('binary'), 'binary');
	}
}
/*
setInterval(function() {
//	console.log('fps:', fps);
	fps = 0;
}, 1000);
*/
//broadcastEngine.on('data', handleData);
 
c.on('packet', function(nbytes, trunc) {

	if (nbytes == 1070) {
		// 8 bytes data in the end of packet not part of payload, so 
		// we don't get data directly from payload. Becides, it has more
		// 4 bytes unknown data in there, we need to ignore it.
		var data = buffer.slice(42, nbytes - 4);

		broadcastEngine.emit('data', data);
	}
});

http.createServer(function(req, res) {
	res.writeHead(200, {
		'Content-Type': 'multipart/x-mixed-replace; boundary=myboundary',
//		'Content-Type': 'video/mp4',
		'Cache-Control': 'no-cache',
		'Connection': 'close',
		'Pragma': 'no-cache'
//		'Transfer-Encoding': 'chunked'
	});

	function handleData(packet) {
		// Frame ID
		//console.log('frame:', packet.readUInt16BE(0));
		
		// part
		var part = packet.readUInt16BE(2);
		var data = packet.slice(4, packet.length);

		if (part == 0) {
			res.write('\n--myboundary\nContent-Type: image/jpeg\n\n');
			res.write(data);
			started = true;
		} else if (started) {
			res.write(data);
		}
	}
/*
	h264Engine.on('data', function(data) {
		res.write(data);
	});
*/
	broadcastEngine.on('data', handleData);

	res.on('close', function() {
		broadcastEngine.removeListener('data', handleData);
	});
}).listen(9000);
