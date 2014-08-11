Full Tilt JS
============

#### The standalone device orientation sensor library ####

Full Tilt JS is a standalone JavaScript library that allows developers to use device orientation sensor data in web applications without having to resort to ugly hacks.

This library takes device orientation data and applies a consistent calibration frame to the data output. It also automatically normalizes device orientation data based on the current screen orientation so your applications keep working as expected if a use rotates their screen during usage of your appications.

Full Tilt JS ultimately provides developers with three different but complimentary device orientation sensor output representations – screen-adjusted Quaternions, Rotation Matrixes and Euler Angles – that can be used to create 2D or 3D experiences in web browsers that work consistently across all the mobile web platforms and all screen orientations (portrait and landscape modes).

* [Live Demo](http://richtr.github.io/Full-Tilt-JS/examples/vr_test.html)
* [Basic Usage](#basic-usage)
* [API](#api)
* [Reference Material](#reference-material)
* [License](#license)

## Basic Usage ##

Add [fulltilt.js](https://github.com/richtr/Full-Tilt-JS/blob/master/fulltilt.js) (or the [minified version of fulltilt.js](https://github.com/richtr/Full-Tilt-JS/blob/master/fulltilt.min.js)) to your project:

    <script src="fulltilt.js"></script>

Start listening for device orientation sensor changes by calling `FULLTILT.DeviceOrientation.start()` at the appropriate point in your web application:

    <script>
      // Start listening for device orientation event changes
      FULLTILT.DeviceOrientation.start();
    </script>

Whenever you need to obtain the current device orientation, call the appropriate method depending on the rotation representation you would like to use:

    <script>
      // Obtain the screen-adjusted normalized rotation as a Quaternion
      var quaternion = FULLTILT.DeviceOrientation.getDeviceQuaternion();
    </script>

    <script>
      // Obtain the screen-adjusted normalized rotation as a Rotation Matrix
      var rotmat = FULLTILT.DeviceOrientation.getDeviceRotation();
    </script>

    <script>
      // Obtain the screen-adjusted normalized rotation as Tait-Bryan Angles
      var euler = FULLTILT.DeviceOrientation.getDeviceEuler();
    </script>

At any time you can stop listening for device orientation sensor changes in your web application by calling `FULLTILT.DeviceOrientation.stop()`:

    <script>
      // Stop listening for device orientation event changes
      FULLTILT.DeviceOrientation.stop();
    </script>

A full example of usage can be found in the [provided example](https://github.com/richtr/Full-Tilt-JS/blob/master/examples/vr_test.html) ([view the example live here](http://richtr.github.io/Full-Tilt-JS/examples/vr_test.html)).

## API ##

### FULLTILT.DeviceOrientation ###

#### Methods ####

##### FULLTILT.DeviceOrientation.start() #####

Start the controller and register all required device orientation event listeners

Example:

    FULLTILT.DeviceOrientation.start();

##### FULLTILT.DeviceOrientation.stop() #####

Stop the controller and de-register all required device orientation event listeners

Example:

    FULLTILT.DeviceOrientation.stop();

##### FULLTILT.DeviceOrientation.getDeviceQuaternion() #####

Return the last available device orientation as a screen-adjusted Quaternion

Example:

    // Return an object of type FULLTILT.Quaternion
    var quat = FULLTILT.DeviceOrientation.getDeviceQuaternion();

##### FULLTILT.DeviceOrientation.getDeviceRotation() #####

Return the last available device orientation as a screen-adjusted Rotation Matrix

Example:

    // Return an object of type FULLTILT.RotationMatrix
    var rotmat = FULLTILT.DeviceOrientation.getDeviceRotation();

##### FULLTILT.DeviceOrientation.getDeviceEuler() #####

Return the last available device orientation as screen-adjusted Euler Angles

Example:

    // Return an object of type FULLTILT.Euler
    var angles = FULLTILT.DeviceOrientation.getDeviceEuler();

##### FULLTILT.DeviceOrientation.isAbsolute() #####

Returns `true` if the device orientation is reporting to be compass-orientated otherwise return `false` to suggest that the device orientation returned is arbitrarily (non-compass) oriented.

At present iOS device orientation should always return `false` while Android device orientation should always return `true`.

Example:

    // Check if the data is aligned to a real-world compass bearing
    var isCompassOriented = FULLTILT.DeviceOrientation.isAbsolute();

##### FULLTILT.DeviceOrientation.getRawDeviceOrientationData() #####

Return the last available original (unprocessed, non-screen-adjusted) device orientation event data provided by the web browser.

Example:

    // Return the original raw deviceorientation event object
    var deviceOrientationEvent = FULLTILT.DeviceOrientation.getRawDeviceOrientationData();

### FULLTILT.Quaternion ###

#### Constructor ####

##### new FULLTILT.Quaternion( [x], [y], [z] ) #####

Create a new `FULLTILT.Quaternion` object, (optionally) passing in your own `x`, `y` and `z` angles (in Radians).

Arguments:

* `x` - the initial rotation around the x-axis in Radians (optional)
* `y` - the initial rotation around the y-axis in Radians (optional)
* `z` - the initial rotation around the z-axis in Radians (optional)

Returns:

A new [`FULLTILT.Quaternion`](#FULLTILT.Quaternion) object.

Example:

    // Create a new FULLTILT.Quaternion object
    var quat = new FULLTILT.Quaternion( Math.PI / 2, 0, 0 );

#### Properties ####

##### .x #####

##### .y #####

##### .z #####

##### .w #####

#### Methods ####

##### .set( [x], [y], [z], [w] ) this #####

Sets the value of this quaternion.

##### .copy( [quat](#FULLTILT.Quaternion) ) this` #####

Copies the value of the supplied quaternion.

##### .multiply( [quat](#FULLTILT.Quaternion) ) this` #####

Multiplies the current object quaternion by the supplied quaternion.

##### .rotateX( radians ) this` #####

Rotate the current object quaternion around its x-axis by the supplied radians angle.

##### .rotateY( radians ) this` #####

Rotate the current object quaternion around its y-axis by the supplied radians angle.

##### .rotateZ( radians ) this` #####

Rotate the current object quaternion around its z-axis by the supplied radians angle.

### FULLTILT.RotationMatrix ###

#### Constructor ####

##### new FULLTILT.RotationMatrix( [x], [y], [z] ) #####

Create a new `FULLTILT.RotationMatrix` object, (optionally) passing in your own `x`, `y` and `z` angles (in Radians).

Arguments:

* `x` - the initial rotation around the x-axis in Radians (optional)
* `y` - the initial rotation around the y-axis in Radians (optional)
* `z` - the initial rotation around the z-axis in Radians (optional)

Returns:

A new [`FULLTILT.RotationMatrix`](#FULLTILT.RotationMatrix) object.

Example:

    // Create a new FULLTILT.RotationMatrix object
    var rotmat = new FULLTILT.RotationMatrix( Math.PI / 2, 0, 0 );

#### Properties ####

##### .elements #####

A ByteArray containing the 9 values of the rotation matrix

#### Methods ####

##### .set( m11, m12, m13, m21, m22, m23, m31, m32, m33 ) this #####

Sets the component values of this rotation matrix object.

##### .copy( [rotmat](#FULLTILT.RotationMatrix) ) this` #####

Copies the component values of the supplied rotation matrix.

##### .multiply( [rotmat](#FULLTILT.RotationMatrix) ) this` #####

Multiplies the current object rotation matrix by the supplied rotation matrix.

##### .rotateX( radians ) this` #####

Rotate the current object rotation matrix around its x-axis by the supplied radians angle.

##### .rotateY( radians ) this` #####

Rotate the current object rotation matrix around its y-axis by the supplied radians angle.

##### .rotateZ( radians ) this` #####

Rotate the current object rotation matrix around its z-axis by the supplied radians angle.


### FULLTILT.Euler ###

#### Constructor ####

##### new FULLTILT.Euler( [x], [y], [z] ) #####

Create a new `FULLTILT.Euler` object, (optionally) passing in your own `x`, `y` and `z` angles (in Radians).

Arguments:

* `x` - the initial rotation around the x-axis in Radians (optional)
* `y` - the initial rotation around the y-axis in Radians (optional)
* `z` - the initial rotation around the z-axis in Radians (optional)

Returns:

A new [`FULLTILT.Euler`](#FULLTILT.Euler) object.

Example:

    // Create a new FULLTILT.Euler object
    var euler = new FULLTILT.Euler( Math.PI / 2, 0, 0 );

#### Properties ####

##### .x #####

The computed rotation around the x-axis (in Degrees).

##### .y #####

The computed rotation around the y-axis (in Degrees).

##### .z #####

The computed rotation around the z-axis (in Degrees).

#### Methods ####

##### .set( x, y, z ) this #####

Sets the component values of this Euler object.

##### .copy( [euler](#FULLTILT.Euler) ) this` #####

Copies the component values of the supplied Euler object.

##### .rotateX( radians ) this` #####

Rotate the current object Euler angles around its x-axis by the supplied angle (in Radians).

##### .rotateY( radians ) this` #####

Rotate the current object Euler angles around its y-axis by the supplied radians angle (in Radians).

##### .rotateZ( radians ) this` #####

Rotate the current object Euler angles around its z-axis by the supplied radians angle (in Radians).

## Reference Material ##

* Article: [Practical application and usage of the W3C Device Orientation API](http://dev.opera.com/articles/view/w3c-device-orientation-usage/)
* [W3C Spec](http://w3c.github.io/deviceorientation/spec-source-orientation.html)

## License ##

MIT. Copyright (c) Rich Tibbett
