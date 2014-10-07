Full Tilt JS
============

#### Standalone device orientation + device motion normalization and conversion library ####

Full Tilt JS is a standalone JavaScript library that normalizes device orientation and device motion sensor data in web applications within a consistent frame.

Full Tilt JS provides developers with three complementary device orientation sensor output representations – screen-adjusted Quaternions, Rotation Matrixes and Euler Angles – that can be used to create 2D or 3D experiences in web browsers that work consistently across all mobile web platforms and in all screen orientations.

This library also provides all the functions necessary to convert between different device orientation types. Orientation angle conversion is possible via this API from/to any [Euler Angles](http://en.wikipedia.org/wiki/Euler_angles), [Rotation Matrices](http://en.wikipedia.org/wiki/Rotation_matrix) and/or [Quaternions](http://en.wikipedia.org/wiki/Quaternion).

* [Demos](#demos)
* [Usage](#usage)
* [API Documentation](https://github.com/richtr/Full-Tilt-JS/wiki/Full-Tilt-JS-API-Documentation)
* [References](#references)
* [License](#license)

## Demos ##

* [Virtual Reality](http://richtr.github.io/Full-Tilt-JS/examples/vr_test.html)
* [2D Box Control](http://richtr.github.io/Full-Tilt-JS/examples/box2d.html)
* [Basic 2D Compass](http://richtr.github.io/Full-Tilt-JS/examples/compass.html)
* [Full Tilt JS Data Inspector](http://richtr.github.io/Full-Tilt-JS/examples/data_display.html)

## Usage ##

Add [fulltilt.js](https://github.com/richtr/Full-Tilt-JS/blob/master/fulltilt.js) (or the [minified version of fulltilt.js](https://github.com/richtr/Full-Tilt-JS/blob/master/fulltilt.min.js)) to your project:

```html
<script src="fulltilt.js"></script>
```

Start listening for device orientation sensor changes by calling `FULLTILT.DeviceOrientation.start()` or `FULLTILT.DeviceMotion.start()` at the appropriate point in your web application:

```javascript
// Start listening for raw device orientation event changes
FULLTILT.DeviceOrientation.start();
```

Whenever you need to obtain the current device orientation or motion, call the appropriate method depending on the data you need:

```javascript
// Obtain the screen-adjusted normalized rotation as a Quaternion
var quaternion = FULLTILT.DeviceOrientation.getScreenAdjustedQuaternion();

// Obtain the screen-adjusted normalized rotation as a Rotation Matrix
var matrix = FULLTILT.DeviceOrientation.getScreenAdjustedMatrix();

// Obtain the screen-adjusted normalized rotation as Tait-Bryan Angles
var euler = FULLTILT.DeviceOrientation.getScreenAdjustedEuler();
```

At any time you can stop listening for device orientation sensor changes in your web application by calling `FULLTILT.DeviceOrientation.stop()` or `FULLTILT.DeviceMotion.stop()`:

```javascript
// Stop listening for raw device orientation event changes
FULLTILT.DeviceOrientation.stop();
```

[Click here for full API documentation](https://github.com/richtr/Full-Tilt-JS/wiki/Full-Tilt-JS-API-Documentation).

## References ##

* [Full Tilt JS API Documentation](https://github.com/richtr/Full-Tilt-JS/wiki/Full-Tilt-JS-API-Documentation)
* Article: [Practical application and usage of the W3C Device Orientation API](http://dev.opera.com/articles/view/w3c-device-orientation-usage/)
* [W3C DeviceOrientation Events Spec](http://w3c.github.io/deviceorientation/spec-source-orientation.html)

## License ##

MIT. Copyright (c) Rich Tibbett.
