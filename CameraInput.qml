import QtQuick 2.2
import QtAV 1.3 as QtAV

Item {

	QtAV.MediaPlayer {
		id: player;
		useWallclockAsTimestamps: true;
		source: '/dev/video0';
		autoPlay: true;
		onStopped: {
			this.play();
		}
		onError: {
			// Retry
			this.play();
		}
	}

	QtAV.VideoOutput {
		id: videoOutput;
		source: player;
		anchors.fill: parent;
/*
		transform: Rotation {
			origin.x: videoOutput.width;
			origin.y: videoOutput.height;
			axis { x: 0; y: 1; z: 0 }
			angle: -30;
		}
*/
	}
}
