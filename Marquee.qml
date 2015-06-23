import QtQuick 2.3

Item{
	id: marquee;

	// Properties
	property string msg;
	property color fontColor: 'white';
	property int fontSize: 20;

	Text {
		id: marqueeText;
		anchors.verticalCenter: marquee.verticalCenter;
		height: marquee.height;
		font.family: 'Droid Sans Fallback';
		font.pointSize: marquee.fontSize;
		color: marquee.fontColor;
		text: marquee.msg;

		NumberAnimation {
			target: marqueeText;
			property: 'x';
			loops: Animation.Infinite;
			duration: marquee.width * 10;
			from: marquee.width;
			to: -marqueeText.width;
			running: true;
		}
	}
}
