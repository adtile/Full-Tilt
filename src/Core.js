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

			resolve(control);

		}).catch(function() {

			control.stop();
			reject('DeviceMotion is not supported');

		});

	});

	return promise;

};
