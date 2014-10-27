// Math.sign polyfill
function sign(x) {
	x = +x; // convert to a number
	if (x === 0 || isNaN(x))
		return x;
	return x > 0 ? 1 : -1;
}

///// Promise-based Sensor Data checker //////

function SensorCheck(sensorData) {

	var promise = new Promise(function(resolve, reject) {

		var runCheck = function (tries) {

			setTimeout(function() {

				if (sensorData) {

					resolve();

				} else if (tries >= 5) {

					reject();

				} else {

					runCheck(++tries);

				}

			}, 50);

		};

		runCheck(0);

	});

	return promise;

}