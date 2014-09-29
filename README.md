Full Tilt JS
============

#### The standalone device orientation + motion sensor normalization and conversion library ####

Full Tilt JS is a standalone JavaScript library that normalizes device orientation and device motion sensor data in web applications within a consistent frame.

Full Tilt JS provides developers with three complementary device orientation sensor output representations – screen-adjusted Quaternions, Rotation Matrixes and Euler Angles – that can be used to create 2D or 3D experiences in web browsers that work consistently across all mobile web platforms and in all screen orientations.

This library also provides all the functions necessary to convert between different device orientation types. Orientation angle conversion is possible via this API from/to any [Euler Angles](http://en.wikipedia.org/wiki/Euler_angles), [Rotation Matrices](http://en.wikipedia.org/wiki/Rotation_matrix) and/or [Quaternions](http://en.wikipedia.org/wiki/Quaternion).

* [Demos](#demos)
* [Basic Usage](#basic-usage)
* [API Documentation](#api-documentation)
* [Reference Material](#reference-material)
* [License](#license)

## Demos ##

* [Virtual Reality](http://richtr.github.io/Full-Tilt-JS/examples/vr_test.html)
* [2D Box Control](http://richtr.github.io/Full-Tilt-JS/examples/box2d.html)
* [Basic 2D Compass](http://richtr.github.io/Full-Tilt-JS/examples/compass.html)
* [Full Tilt JS Data Inspector](http://richtr.github.io/Full-Tilt-JS/examples/data_display.html)

## Basic Usage ##

Add [fulltilt.js](https://github.com/richtr/Full-Tilt-JS/blob/master/fulltilt.js) (or the [minified version of fulltilt.js](https://github.com/richtr/Full-Tilt-JS/blob/master/fulltilt.min.js)) to your project:

    <script src="fulltilt.js"></script>

Start listening for device orientation sensor changes by calling `FULLTILT.DeviceOrientation.start()` or `FULLTILT.DeviceMotion.start()` at the appropriate point in your web application:

    // Start listening for raw device orientation event changes
    FULLTILT.DeviceOrientation.start();

Whenever you need to obtain the current device orientation or motion, call the appropriate method depending on the data you need:

    // Obtain the screen-adjusted normalized rotation as a Quaternion
    var quaternion = FULLTILT.DeviceOrientation.getScreenAdjustedQuaternion();

    // Obtain the screen-adjusted normalized rotation as a Rotation Matrix
    var matrix = FULLTILT.DeviceOrientation.getScreenAdjustedMatrix();

    // Obtain the screen-adjusted normalized rotation as Tait-Bryan Angles
    var euler = FULLTILT.DeviceOrientation.getScreenAdjustedEuler();

At any time you can stop listening for device orientation sensor changes in your web application by calling `FULLTILT.DeviceOrientation.stop()` or `FULLTILT.DeviceMotion.stop()`:

    // Stop listening for raw device orientation event changes
    FULLTILT.DeviceOrientation.stop();

A full example of usage can be found in the [provided example](https://github.com/richtr/Full-Tilt-JS/blob/master/examples/vr_test.html) ([view the example live here](http://richtr.github.io/Full-Tilt-JS/examples/vr_test.html)).

## API Documentation ##

### FULLTILT.DeviceOrientation ###

#### Methods ####

##### FULLTILT.DeviceOrientation.start( [ callback ] ) #####

Start the controller and register all required device orientation event listeners.

Optionally, you can pass in a JavaScript function that will be called each time a new DeviceOrientation event is fired by the current browser.

Example 1:

    FULLTILT.DeviceOrientation.start();

Example 2:

    FULLTILT.DeviceOrientation.start(function() {
      // DeviceOrientation updated

      var matrix = FULLTILT.DeviceOrientation.getScreenAdjustedMatrix();

      // Do something with rotation matrix `matrix`...
    });

##### FULLTILT.DeviceOrientation.stop() #####

Stop the controller and de-register all required device orientation event listeners

Example:

    FULLTILT.DeviceOrientation.stop();

##### FULLTILT.DeviceOrientation.getFixedFrameQuaternion() #####

Return the last available device orientation as a fixed-frame [Quaternion](#fulltiltquaternion) object.

Example:

    // Return an object of type FULLTILT.Quaternion (without screen rotation adjustments applied)
    var quat = FULLTILT.DeviceOrientation.getFixedFrameQuaternion();

##### FULLTILT.DeviceOrientation.getScreenAdjustedQuaternion() #####

Return the last available device orientation as a screen-adjusted [Quaternion](#fulltiltquaternion) object.

Example:

    // Return an object of type FULLTILT.Quaternion (with screen rotation adjustments applied)
    var quat = FULLTILT.DeviceOrientation.getScreenAdjustedQuaternion();

##### FULLTILT.DeviceOrientation.getFixedFrameMatrix() #####

Return the last available device orientation as a fixed-frame [RotationMatrix](#fulltiltrotationmatrix) object.

Example:

    // Return an object of type FULLTILT.RotationMatrix (without screen rotation adjustments applied)
    var matrix = FULLTILT.DeviceOrientation.getFixedFrameMatrix();

##### FULLTILT.DeviceOrientation.getScreenAdjustedMatrix() #####

Return the last available device orientation as a screen-adjusted [RotationMatrix](#fulltiltrotationmatrix) object.

Example:

    // Return an object of type FULLTILT.RotationMatrix (with screen rotation adjustments applied)
    var matrix = FULLTILT.DeviceOrientation.getScreenAdjustedMatrix();

##### FULLTILT.DeviceOrientation.getFixedFrameEuler() #####

Return the last available device orientation as a fixed-frame [Euler](#fulltilteuler) object.

Example:

    // Return an object of type FULLTILT.Euler (without screen rotation adjustments applied)
    var angles = FULLTILT.DeviceOrientation.getFixedFrameEuler();

##### FULLTILT.DeviceOrientation.getScreenAdjustedEuler() #####

Return the last available device orientation as a screen-adjusted [Euler](#fulltilteuler) object.

Example:

    // Return an object of type FULLTILT.Euler (with screen rotation adjustments applied)
    var angles = FULLTILT.DeviceOrientation.getScreenAdjustedEuler();

##### FULLTILT.DeviceOrientation.isAbsolute() #####

Returns `true` if the device orientation is reporting to be compass-orientated otherwise return `false` to suggest that the device orientation returned is arbitrarily (non-compass) oriented.

At present iOS device orientation should always return `false` while Android device orientation should always return `true`.

Example:

    // Check if the data is aligned to a real-world compass bearing
    var isCompassOriented = FULLTILT.DeviceOrientation.isAbsolute();

##### FULLTILT.DeviceOrientation.getLastRawEventData() #####

Return the last available original (unprocessed, non-screen-adjusted) device orientation event data provided by the web browser.

Example:

    // Return the original raw deviceorientation event object
    var deviceOrientationEvent = FULLTILT.DeviceOrientation.getLastRawEventData();

### FULLTILT.DeviceMotion ###

#### Methods ####

##### FULLTILT.DeviceMotion.start( [ callback ] ) #####

Start the controller and register all required device motion event listeners.

Optionally, you can pass in a JavaScript function that will be called each time a new DeviceMotion event is fired by the current browser.

Example 1:

    FULLTILT.DeviceMotion.start();

Example 2:

    FULLTILT.DeviceMotion.start(function() {
      // DeviceMotion updated

      var acc = FULLTILT.DeviceMotion.getScreenAdjustedAcceleration();

      // Do something with `acc`...
    });

##### FULLTILT.DeviceMotion.stop() #####

Stop the controller and de-register all required device motion event listeners

Example:

    FULLTILT.DeviceMotion.stop();

##### FULLTILT.DeviceMotion.getScreenAdjustedAcceleration() #####

Return the last available screen-adjusted acclerometer values.

Example:

    var acc = FULLTILT.DeviceMotion.getScreenAdjustedAcceleration();

##### FULLTILT.DeviceMotion.getScreenAdjustedAccelerationIncludingGravity() #####

Return the last available screen-adjusted acclerometer values including gravity components.

Example:

    var accGrav = FULLTILT.DeviceMotion.getScreenAdjustedAccelerationIncludingGravity();

##### FULLTILT.DeviceMotion.getScreenAdjustedRotationRate() #####

Return the last available screen-adjusted rotation rate values.

Example:

    var rotRate = FULLTILT.DeviceMotion.getScreenAdjustedRotationRate();

##### FULLTILT.DeviceMotion.getLastRawEventData() #####

Return the last available original (non-screen-adjusted) device motion event data provided by the web browser.

Example:

    // Return the original raw devicemotion event object
    var deviceMotionEvent = FULLTILT.DeviceMotion.getLastRawEventData();

### FULLTILT.Quaternion ###

#### Constructor ####

##### new FULLTILT.Quaternion( [x, y, z, w] ) #####

Create a new `FULLTILT.Quaternion` object.

Arguments:

* `x` - the initial x component (optional)
* `y` - the initial y component (optional)
* `z` - the initial z component (optional)
* `w` - the initial w component (optional)

Returns:

A new [`FULLTILT.Quaternion`](#fulltiltquaternion) object.

Example:

    // Create a new FULLTILT.Quaternion object
    var quat = new FULLTILT.Quaternion( 0, 0, 0, 1 );

is equivalent to:

    var quat = new FULLTILT.Quaternion();

#### Properties ####

##### .x #####

##### .y #####

##### .z #####

##### .w #####

#### Methods ####

##### .set( [x, y, z, w] ) this #####

Sets the raw values of the current [Quaternion](#fulltiltquaternion) object.

Example:

    var quat = new FULLTILT.Quaternion();
    quat.set(Math.sin(90), 0, 0, Math.cos(90));

##### .copy( [quaternion](#fulltiltquaternion) ) this` #####

Copies the value of the supplied [Quaternion](#fulltiltquaternion) object to the current object.

Example:

    var quat1 = new FULLTILT.Quaternion();
    var quat2 = new FULLTILT.Quaternion(0, Math.sin(45), 0, Math.cos(45));

    quat1.copy(quat2);

##### .setFromEuler( [euler](#fulltilteuler) ) this #####

Sets the component values of this quaternion object from the provided [Euler](#fulltilteuler) object.

Example:

    var quat = new FULLTILT.Quaternion();
    var euler = new FULLTILT.Euler(90, 0, -45);

    quat.setFromEuler(euler);

##### .setFromRotationMatrix( [matrix](#fulltiltrotationmatrix) ) this #####

Sets the component values of this quaternion object from the provided [RotationMatrix](#fulltiltrotationmatrix) object.

Example:

    var quat = new FULLTILT.Quaternion();
    var matrix = new FULLTILT.RotationMatrix(1,0,0,0,1,0,0,0,1);

    quat.setFromRotationMatrix(matrix);

##### .multiply( [quaternion](#fulltiltquaternion) ) this` #####

Multiplies the current object quaternion by the supplied quaternion.

Example:

    var quat1 = new FULLTILT.Quaternion(Math.sin(270), 0, 0, Math.cos(270));
    var quat2 = new FULLTILT.Quaternion(0, Math.sin(45), 0, Math.cos(45));

    quat1.multiply(quat2); // quat1 * quat2

##### .rotateX( radians ) this` #####

Rotate the current object quaternion around its x-axis by the supplied angle (in Radians).

Example:

    var quat = new FULLTILT.Quaternion(Math.sin(270), 0, 0, Math.cos(270));

    quat.rotateX(Math.PI / 2); // rotate this quaternion by 90 degrees along its X-axis

##### .rotateY( radians ) this` #####

Rotate the current object quaternion around its y-axis by the supplied angle (in Radians).

Example:

    var quat = new FULLTILT.Quaternion(0, Math.sin(45), 0, Math.cos(45));

    quat.rotateY(Math.PI / 4); // rotate this quaternion by 45 degrees along its Y-axis

##### .rotateZ( radians ) this` #####

Rotate the current object quaternion around its z-axis by the supplied angle (in Radians).

Example:

    var quat = new FULLTILT.Quaternion(0, 0, Math.sin(10), Math.cos(10));

    quat.rotateY( 20 * (Math.PI / 180) ); // rotate this quaternion by 20 degrees along its Z-axis

### FULLTILT.RotationMatrix ###

#### Constructor ####

##### new FULLTILT.RotationMatrix( [m11, m12, m13, m21, m22, m23, m31, m32, m33] ) #####

Create a new `FULLTILT.RotationMatrix` object.

Arguments:

The matrix component values to initially set for the object (optional).

Returns:

A new [`FULLTILT.RotationMatrix`](#fulltiltrotationmatrix) object.

Example:

    // Create a new FULLTILT.RotationMatrix object
    var matrix = new FULLTILT.RotationMatrix( 1, 0, 0, 0, 1, 0, 0, 0, 1 );

is equivalent to:

    var matrix = new FULLTILT.RotationMatrix();

#### Properties ####

##### .elements #####

A ByteArray containing the 9 values of the rotation matrix

#### Methods ####

##### .set( m11, m12, m13, m21, m22, m23, m31, m32, m33 ) this #####

Sets the raw values of this rotation matrix object.

Example:

    var matrix = new FULLTILT.RotationMatrix();

    matrix.set(1,0,0,0,1,0,0,0,1);

##### .copy( [matrix](#fulltiltrotationmatrix) ) this` #####

Copies the component values of the supplied rotation matrix.

Example:

    var matrix1 = new FULLTILT.RotationMatrix();
    var matrix2 = new FULLTILT.RotationMatrix();
    matrix2.setFromEuler(new FULLTILT.Euler(45.4, 0, 10.1));

    matrix1.copy(matrix2);

##### .setFromEuler( [euler](#fulltilteuler) ) this #####

Sets the component values of this rotation matrix object from the provided [Euler](#fulltilteuler) object.

Example:

    var matrix = new FULLTILT.RotationMatrix();
    var euler = new FULLTILT.Euler(290.00123, 10.752, 32.2313)

    matrix.setFromEuler(euler);

##### .setFromQuaternion( [quaternion](#fulltiltquaternion) ) this #####

Sets the component values of this rotation matrix object from the provided [Quaternion](#fulltiltquaternion) object.

Example:

    var matrix = new FULLTILT.RotationMatrix();
    var quaternion = new FULLTILT.Quaternion(0,0,0,1);

    matrix.setFromQuaternion(quaternion);

##### .multiply( [matrix](#fulltiltrotationmatrix) ) this` #####

Multiplies the current object rotation matrix by the supplied rotation matrix.

Example:

    var matrix1 = new FULLTILT.RotationMatrix();
    var matrix2 = new FULLTILT.RotationMatrix();
    matrix2.rotateX(90 * (Math.PI / 180));

    matrix1.multiply(matrix2); // matrix1 * matrix2

##### .rotateX( radians ) this` #####

Rotate the current object rotation matrix around its x-axis by the supplied angle (in Radians).

Example:

    var matrix = new FULLTILT.RotationMatrix();

    matrix.rotateX(270 * (Math.PI / 180)); // rotate matrix by 270 degrees around its Z-axis

##### .rotateY( radians ) this` #####

Rotate the current object rotation matrix around its y-axis by the supplied angle (in Radians).

Example:

    var matrix = new FULLTILT.RotationMatrix();

    matrix.rotateY(Math.PI / 2); // rotate matrix by 90 degrees around its Y-axis

##### .rotateZ( radians ) this` #####

Rotate the current object rotation matrix around its z-axis by the supplied angle (in Radians).

Example:

    var matrix = new FULLTILT.RotationMatrix();

    matrix.rotateZ(Math.sqrt(0.5)); // rotate matrix by Math.PI/2 around its Z-axis

### FULLTILT.Euler ###

#### Constructor ####

##### new FULLTILT.Euler( [alpha, beta, gamma] ) #####

Create a new `FULLTILT.Euler` object.

Arguments:

* `alpha` - the initial z-axis rotation in Degrees (optional)
* `beta`  - the initial x-axis rotation in Degrees (optional)
* `gamma` - the initial y-axis rotation in Degrees (optional)

Returns:

A new [`FULLTILT.Euler`](#fulltilteuler) object.

Example:

    // Create a new FULLTILT.Euler object
    var euler = new FULLTILT.Euler( 0, 0, 0 );

is equivalent to:

    var euler = new FULLTILT.Euler();

#### Properties ####

##### .alpha #####

The computed rotation around the z-axis (in Degrees).

##### .beta #####

The computed rotation around the x-axis (in Degrees).

##### .gamma #####

The computed rotation around the y-axis (in Degrees).

#### Methods ####

##### .set( [alpha, beta, gamma] ) this #####

Sets the component values of this Euler object.

Example:

    var euler = new FULLTILT.Euler();

    euler.set(270, 45, 45);

##### .copy( [euler](#fulltilteuler) ) this` #####

Copies the component values of the supplied Euler object.

Example:

    var euler1 = new FULLTILT.Euler();
    var euler2 = new FULLTILT.Euler();
    euler2.setFromQuaternion(new FULLTILT.Quaternion(0, Math.sin(45), 0, Math.cos(45)));

    euler1.copy(euler2);

##### .setFromQuaternion( [quaternion](#fulltiltquaternion) ) this #####

Sets the component values of this Euler object from the provided [Quaternion](#fulltiltquaternion) object.

Example:

    var euler = new FULLTILT.Euler();
    var quat = new FULLTILT.Quaternion(0,0,0,1);

    euler.setFromQuaternion(quat);

##### .setFromRotationMatrix( [matrix](#fulltiltrotationmatrix) ) this #####

Sets the component values of this Euler object from the provided [RotationMatrix](#fulltiltrotationmatrix) object.

Example:

    var euler = new FULLTILT.Euler();
    var matrix = new FULLTILT.RotationMatrix();
    matrix.rotateX(90 * (Math.PI / 180));

    euler.setFromRotationMatrix(matrix);

##### .rotateX( radians ) this` #####

Rotate the current object Euler angles around its x-axis by the supplied angle (in Radians).

Example:

    var euler = new FULLTILT.Euler();

    euler.rotateX(Math.sqrt(0.5)); // rotate by Math.PI/2 around the X axis.

##### .rotateY( radians ) this` #####

Rotate the current object Euler angles around its y-axis by the supplied angle (in Radians).

Example:

    var euler = new FULLTILT.Euler();

    euler.rotateY(Math.PI/4); // rotate by 45 degrees around the Y axis.

##### .rotateZ( radians ) this` #####

Rotate the current object Euler angles around its z-axis by the supplied angle (in Radians).

Example:

    var euler = new FULLTILT.Euler();

    euler.rotateZ(10 * (Math.PI / 180)); // rotate by 10 degrees around the Z axis.

## Reference Material ##

* Article: [Practical application and usage of the W3C Device Orientation API](http://dev.opera.com/articles/view/w3c-device-orientation-usage/)
* [W3C Spec](http://w3c.github.io/deviceorientation/spec-source-orientation.html)

## License ##

MIT. Copyright (c) Rich Tibbett.
