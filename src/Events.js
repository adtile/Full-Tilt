////// Internal Event Handlers //////

function handleScreenOrientationChange () {

	if ( hasScreenOrientationAPI ) {

		screenOrientationAngle = ( window.screen.orientation.angle || 0 ) * degToRad;

	} else {

		screenOrientationAngle = ( window.orientation || 0 ) * degToRad;

	}

}

function handleDeviceOrientationChange ( event ) {

	deviceOrientationData = event;

	// Fire every callback function each time deviceorientation is updated
	for ( var i in orientationCallbacks ) {

		orientationCallbacks[ i ].call( this );

	}

}

function handleDeviceMotionChange ( event ) {

	deviceMotionData = event;

	// Fire every callback function each time devicemotion is updated
	for ( var i in motionCallbacks ) {

		motionCallbacks[ i ].call( this );

	}

}