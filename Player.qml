import QtQuick 2.3
import QtQuick.Controls 1.2
import Poppler 1.0

ApplicationWindow {
	id: app;
	width: 1024;
	height: 768;
	color: '#000000';
	visible: true;

	VideoInput {
		id: videoInput1;
		anchors.fill: parent;
		layer.enabled: true;
		layer.effect: Effect {
			id: root
			parameters: ListModel {
				ListElement {
					name: 'amplitude'
					value: 0.5
				}
			}

			// Transform slider values, and bind result to shader uniforms
			property real granularity: parameters.get(0).value * 20
			property real weight: parameters.get(0).value

			property real centerX;
			property real centerY;
			property real time

			SequentialAnimation {
				running: true
				loops: Animation.Infinite
				ScriptAction {
					script: {
						centerX = Math.random()
						centerY = Math.random()
					}
				}
				NumberAnimation {
					target: root
					property: 'time'
					from: 0
					to: 1
					duration: 1000
				}
			}
		}
	}

	Poppler {
		path: '/home/fred/FOP.pdf';
		width: parent.width * 0.25;
		height: parent.height * 0.25;
		anchors.right: parent.right;

		Image {
			anchors.fill: parent;
			asynchronous: true;
			source: 'image://poppler/page/1';
			sourceSize.width: parent.width;
			sourceSize.height: parent.height;
		}
	}

	CameraInput {
		id: camera;
		width: parent.width * 0.25;
		height: parent.height * 0.25;
		anchors.bottom: parent.bottom;
		anchors.right: parent.right;
	}

	Marquee {
		width: app.width;
		anchors.left: app.left;
		anchors.right: app.right;
		anchors.bottom: parent.bottom;
		height: app.height * 0.1;
		msg: '最新消息：等了十幾年的使徒沒來。'
	}
}
