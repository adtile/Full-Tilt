///// FULLTILT API Root Object /////

var FULLTILT = {};

FULLTILT.version = "0.5.3";

///// FULLTILT API Root Methods /////

FULLTILT.getDeviceOrientation = function(options) {

	var promise = new Promise(function(resolve, reject) {

		var control = new FULLTILT.DeviceOrientation(options);

		control.start();

		var orientationSensorCheck = new SensorCheck(sensors.orientation);

		orientationSensorCheck.then(function() {

			control._alphaAvailable = (sensors.orientation.data.alpha && sensors.orientation.data.alpha !== null);
			control._betaAvailable = (sensors.orientation.data.beta && sensors.orientation.data.beta !== null);
			control._gammaAvailable = (sensors.orientation.data.gamma && sensors.orientation.data.gamma !== null);

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

			control._accelerationXAvailable = (sensors.motion.data.acceleration && sensors.motion.data.acceleration.x);
			control._accelerationYAvailable = (sensors.motion.data.acceleration && sensors.motion.data.acceleration.y);
			control._accelerationZAvailable = (sensors.motion.data.acceleration && sensors.motion.data.acceleration.z);

			control._accelerationIncludingGravityXAvailable = (sensors.motion.data.accelerationIncludingGravity && sensors.motion.data.accelerationIncludingGravity.x);
			control._accelerationIncludingGravityYAvailable = (sensors.motion.data.accelerationIncludingGravity && sensors.motion.data.accelerationIncludingGravity.y);
			control._accelerationIncludingGravityZAvailable = (sensors.motion.data.accelerationIncludingGravity && sensors.motion.data.accelerationIncludingGravity.z);

			control._rotationRateAlphaAvailable = (sensors.motion.data.rotationRate && sensors.motion.data.rotationRate.alpha);
			control._rotationRateBetaAvailable = (sensors.motion.data.rotationRate && sensors.motion.data.rotationRate.beta);
			control._rotationRateGammaAvailable = (sensors.motion.data.rotationRate && sensors.motion.data.rotationRate.gamma);

			resolve(control);

		}).catch(function() {

			control.stop();
			reject('DeviceMotion is not supported');

		});

	});

	return promise;

};
