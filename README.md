Full Tilt
==========

#### Standalone device orientation + motion detection, normalization and conversion library ####

Full Tilt is a Promise-based JavaScript library that detects support for device orientation and device motion sensor data and then normalizes that data across different platforms for web applications to use within their own 'world' or 'game' based frames.

Full Tilt provides developers with three complementary device orientation sensor output representations – screen-adjusted Quaternions, Rotation Matrixes and Euler Angles – that can be used to create 2D or 3D experiences in web browsers that work consistently across all mobile web platforms and in all screen orientations.

This library also provides all the functions necessary to convert between different device orientation types. Orientation angle conversion is possible via this API from/to Device Orientation and Motion API-derived [Euler Angles](http://en.wikipedia.org/wiki/Euler_angles), [Rotation Matrices](http://en.wikipedia.org/wiki/Rotation_matrix) and/or [Quaternions](http://en.wikipedia.org/wiki/Quaternion) (i.e. from raw sensor inputs that supply intrinsic Tait-Bryan angles of type Z-X'-Y').

* [Installation](#installation)
* [Usage](#usage)
* [Documentation](https://github.com/richtr/Full-Tilt/wiki/Full-Tilt-API-Documentation)

## Installation ##

This library is available on [Bower](http://bower.io/) as **fulltilt**:

```bash
$> bower install fulltilt
```

You will also need a Promise polyfill for older browsers.

```bash
$> bower install es6-promise
```

Alternatively, you can manually add [fulltilt.js](https://github.com/richtr/Full-Tilt/blob/master/dist/fulltilt.js) (or the [minified version of fulltilt.js](https://github.com/richtr/Full-Tilt/blob/master/dist/fulltilt.min.js)) to your project.

## Usage ##

You can request device orientation and motion sensor changes by requesting a Promise object with either [`FULLTILT.getDeviceOrientation()`](https://github.com/richtr/Full-Tilt/wiki/Full-Tilt-API-Documentation#fulltiltgetdeviceorientation--options--) or [`FULLTILT.getDeviceMotion()`](https://github.com/richtr/Full-Tilt/wiki/Full-Tilt-API-Documentation#fulltiltgetdevicemotion--options--).

If the requested sensor is supported on the current device then this Promise object will resolve to [`FULLTILT.DeviceOrientation`](https://github.com/richtr/Full-Tilt/wiki/Full-Tilt-API-Documentation#fulltiltdeviceorientation) and [`FULLTILT.DeviceMotion`](https://github.com/richtr/Full-Tilt/wiki/Full-Tilt-API-Documentation#fulltiltdevicemotion) as appropriate. This returned object can then be used to interact with the device's sensors via the FULLTILT APIs.

If the requested sensor is not supported on the current device then this Promise object will reject with a simple error message string. In such circumstances it is recommended to provide manual fallback controls so users can still interact with your web page appropriately.

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

Full [API documentation](https://github.com/richtr/Full-Tilt/wiki/Full-Tilt-API-Documentation) is available on the project wiki and [usage examples](https://github.com/richtr/Full-Tilt/tree/master/examples) are also provided.

## References ##

* [Full Tilt API Documentation](https://github.com/richtr/Full-Tilt/wiki/Full-Tilt-API-Documentation)
* [W3C DeviceOrientation Events Spec](http://w3c.github.io/deviceorientation/spec-source-orientation.html)
