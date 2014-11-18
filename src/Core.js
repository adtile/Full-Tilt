///// FULLTILT API Root Object /////

var FULLTILT = {};

FULLTILT.version = "0.5.1";

///// FULLTILT API Root Methods /////

FULLTILT.getDeviceOrientation = function(options) {

	var promise = new Promise(function(resolve, reject) {

		var control = new FULLTILT.DeviceOrientation(options);

		control.start();

		var orientationSensorCheck = new SensorCheck(sensors.orientation);

		orientationSensorCheck.then(function() {

			if(	deviceOrientationData.alpha && deviceOrientationData.alpha !== null &&
				deviceOrientationData.beta && deviceOrientationData.beta !== null &&
				deviceOrientationData.gamma && deviceOrientationData.gamma !== null
				){
				
				control._isAvailable = true;
			}

			resolve(control);

		}).catch(function() {

			control.stop();
			reject('DeviceOrientation is not supported');

		});

	});

	return promise;

};

FULLTILT.getDeviceMotion = function(options) {

	var promise = new Promise(function(resolve, reject) {

		var control = new FULLTILT.DeviceMotion(options);

		control.start();

		var motionSensorCheck = new SensorCheck(sensors.motion);

		motionSensorCheck.then(function() {

			if(deviceMotionData.acceleration && deviceMotionData.acceleration.x && deviceMotionData.acceleration.y && deviceMotionData.acceleration.z){
				control._accelerationAvailable = true;
			}

			if(deviceMotionData.accelerationIncludingGravity && deviceMotionData.accelerationIncludingGravity.x && deviceMotionData.accelerationIncludingGravity.y && deviceMotionData.accelerationIncludingGravity.z){
				control._accelerationIncludingGravityAvailable = true;
			}

			if(deviceMotionData.rotationRate && deviceMotionData.rotationRate.alpha && deviceMotionData.rotationRate.beta && deviceMotionData.rotationRate.gamma){
				control._rotationRateAvailable = true;
			}

			resolve(control);

		}).catch(function() {

			control.stop();
			reject('DeviceMotion is not supported');

		});

	});

	return promise;

};