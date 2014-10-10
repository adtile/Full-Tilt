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

Add [fulltilt.js](https://github.com/richtr/Full-Tilt/blob/master/dist/fulltilt.js) (or the [minified version of fulltilt.js](https://github.com/richtr/Full-Tilt/blob/master/dist/fulltilt.min.js)) to your project:

```html
<script src="fulltilt.js"></script>
```

Start listening for device orientation sensor changes by creating a new `FULLTILT.DeviceOrientation` or `FULLTILT.DeviceMotion` object, calling `.start()` on that new object and then calling a method.

You can stop listening for sensor changes in your web application by calling `.stop()` on an existing `FULLTILT.DeviceOrientation` or `FULLTILT.DeviceMotion` object at any time.

Here is a quick example of how to use Full Tilt:

```html
<script>
  // Create new FULLTILT library for *compass*-based deviceorientation
  var controls = new FULLTILT.DeviceOrientation({ 'type': 'world' });

  // Start collecting raw deviceorientation data
  controls.start();

  function getDeviceOrientation() {
    // Obtain the *screen-adjusted* normalized device rotation
    // as Quaternion, Rotation Matrix and Euler Angles objects
    var quaternion = controls.getScreenAdjustedQuaternion();
    var matrix = controls.getScreenAdjustedMatrix();
    var euler = controls.getScreenAdjustedEuler();

    // Print these equivalent values to the console
    console.debug(quaternion);
    console.debug(matrix);
    console.debug(euler);

    // Queue up for next animation frame
    requestAnimationFrame(getDeviceOrientation);
  }

  getDeviceOrientation();
</script>
```

[API documentation](https://github.com/richtr/Full-Tilt/wiki/Full-Tilt-API-Documentation) is available on the project wiki and [usage examples](https://github.com/richtr/Full-Tilt/tree/master/examples) are also provided.

## References ##

* [Full Tilt API Documentation](https://github.com/richtr/Full-Tilt/wiki/Full-Tilt-API-Documentation)
* Article: [Practical application and usage of the W3C Device Orientation API](http://dev.opera.com/articles/view/w3c-device-orientation-usage/)
* [W3C DeviceOrientation Events Spec](http://w3c.github.io/deviceorientation/spec-source-orientation.html)
