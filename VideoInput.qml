import QtQuick 2.2
import QtAV 1.3 as QtAV

Item {

	QtAV.MediaPlayer {
		id: player;
		useWallclockAsTimestamps: true;
		abortOnTimeout: true;
		source: 'http://localhost:9000';
		autoPlay: true;
		onStopped: {
			this.play();
			console.log('STOPPED');
		}
		onError: {
			// Retry
			this.play();
			console.log(error, errorString);
		}
	}

	QtAV.VideoOutput {
		id: videoOutput;
		source: player;
		anchors.fill: parent;
	}
}
