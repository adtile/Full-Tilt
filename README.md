\_o/ Full Tilt \o\_
================

#### Standalone device orientation + device motion normalization and conversion JavaScript library ####

Full Tilt is a standalone JavaScript library that normalizes device orientation and device motion sensor data in web applications within a consistent frame.

Full Tilt provides developers with three complementary device orientation sensor output representations – screen-adjusted Quaternions, Rotation Matrixes and Euler Angles – that can be used to create 2D or 3D experiences in web browsers that work consistently across all mobile web platforms and in all screen orientations.

This library also provides all the functions necessary to convert between different device orientation types. Orientation angle conversion is possible via this API from/to any [Euler Angles](http://en.wikipedia.org/wiki/Euler_angles), [Rotation Matrices](http://en.wikipedia.org/wiki/Rotation_matrix) and/or [Quaternions](http://en.wikipedia.org/wiki/Quaternion).

* [Demos](#demos)
* [Usage](#usage)
* [API Documentation](https://github.com/richtr/Full-Tilt/wiki/Full-Tilt-API-Documentation)
* [References](#references)

## Demos ##

* [Virtual Reality](http://richtr.github.io/Full-Tilt/examples/vr_test.html)
* [2D Box Control](http://richtr.github.io/Full-Tilt/examples/box2d.html)
* [Basic 2D Compass](http://richtr.github.io/Full-Tilt/examples/compass.html)
* [Full Tilt Data Inspector](http://richtr.github.io/Full-Tilt/examples/data_display.html)

## Usage ##

Add [fulltilt.js](https://github.com/richtr/Full-Tilt/blob/master/dist/fulltilt.js) (or the [minified version of fulltilt.js](https://github.com/richtr/Full-Tilt/blob/master/dist/fulltilt.min.js)) to your project.

You can also install the latest version of this library with [Bower](http://bower.io/) as follows:

```bash
$> bower install fulltilt # type in your project root folder
```

```html
<script src="path/to/bower_components/fulltilt/dist/fulltilt.min.js"></script>
```

You can request device orientation and motion sensor changes by requesting a Promise object with either `FULLTILT.getDeviceOrientation()` or `FULLTILT.getDeviceMotion()`.

If the requested sensor is supported on the current device then this Promise object will resolve to `FULLTILT.DeviceOrientation` and `FULLTILT.DeviceMotion` as appropriate. This returned object can then be used to interact with the device's sensors via the FULLTILT APIs.

If the requested sensor is not supported on the current device then this Promise object will reject with a simple error message string. In such circumstances it is recommended to provide manual fallback controls so users can still interact with your web page appropriately.

You can stop listening for sensor changes in your web application by calling `.stop()` on an existing `FULLTILT.DeviceOrientation` or `FULLTILT.DeviceMotion` object at any time.

Here is a quick example of how to use Full Tilt:

```html
<script>
  // Create a new FULLTILT Promise for e.g. *compass*-based deviceorientation data
  var promise = new FULLTILT.getDeviceOrientation({ 'type': 'world' });

	// FULLTILT.DeviceOrientation instance placeholder
	var deviceOrientation;

  promise
		.then(function(controller) {
			// Store the returned FULLTILT.DeviceOrientation object
			deviceOrientation = controller;
	  })
		.catch(function(message) {
			console.error(message);

			// Optionally set up fallback controls...
			// initManualControls();
		});

  (function draw() {

		// If we have a valid FULLTILT.DeviceOrientation object then use it
		if (deviceOrientation) {

	    // Obtain the *screen-adjusted* normalized device rotation
	    // as Quaternion, Rotation Matrix and Euler Angles objects
			// from our FULLTILT.DeviceOrientation object
	    var quaternion = deviceOrientation.getScreenAdjustedQuaternion();
	    var matrix = deviceOrientation.getScreenAdjustedMatrix();
	    var euler = deviceOrientation.getScreenAdjustedEuler();

	    // Do something with our quaternion, matrix, euler objects...
	    console.debug(quaternion);
	    console.debug(matrix);
	    console.debug(euler);

		}

    // Execute function on each browser animation frame
    requestAnimationFrame(draw);

  })();
</script>
```

[API documentation](https://github.com/richtr/Full-Tilt/wiki/Full-Tilt-API-Documentation) is available on the project wiki and [usage examples](https://github.com/richtr/Full-Tilt/tree/master/examples) are also provided.

## References ##

* [Full Tilt API Documentation](https://github.com/richtr/Full-Tilt/wiki/Full-Tilt-API-Documentation)
* Article: [Practical application and usage of the W3C Device Orientation API](http://dev.opera.com/articles/view/w3c-device-orientation-usage/)
* [W3C DeviceOrientation Events Spec](http://w3c.github.io/deviceorientation/spec-source-orientation.html)
