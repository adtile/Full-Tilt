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

			if(	sensors.orientation.data.alpha && sensors.orientation.data.alpha !== null &&
				sensors.orientation.data.beta && sensors.orientation.data.beta !== null &&
				sensors.orientation.data.gamma && sensors.orientation.data.gamma !== null
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

			if(sensors.motion.data.acceleration && sensors.motion.data.acceleration.x && sensors.motion.data.acceleration.y && sensors.motion.data.acceleration.z){
				control._accelerationAvailable = true;
			}

			if(sensors.motion.data.accelerationIncludingGravity && sensors.motion.data.accelerationIncludingGravity.x && sensors.motion.data.accelerationIncludingGravity.y && sensors.motion.data.accelerationIncludingGravity.z){
				control._accelerationIncludingGravityAvailable = true;
			}

			if(sensors.motion.data.rotationRate && sensors.motion.data.rotationRate.alpha && sensors.motion.data.rotationRate.beta && sensors.motion.data.rotationRate.gamma){
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