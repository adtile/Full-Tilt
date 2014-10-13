/**
 *
 * FULL TILT
 * http://github.com/richtr/Full-Tilt
 *
 * A standalone DeviceOrientation + DeviceMotion JavaScript library that
 * normalises orientation sensor input, applies relevant screen orientation
 * transforms, returns Euler Angle, Quaternion and Rotation
 * Matrix representations back to web developers and provides conversion
 * between all supported orientation representation types.
 *
 * Copyright: 2014 Rich Tibbett
 * License:   MIT
 *
 */

(function ( window ) {

// Only initialize the FULLTILT API if it is not already attached to the DOM
if ( window.FULLTILT !== undefined && window.FULLTILT !== null ) {
	return;
}

var M_PI   = Math.PI;
var M_PI_2 = M_PI / 2;
var M_2_PI = 2 * M_PI;

// Degree to Radian conversion
var degToRad = M_PI / 180;
var radToDeg = 180 / M_PI;

// Internal device orientation + motion variables
var orientationActive = false, motionActive = false, screenActive = false;
var orientationCallbacks = [], motionCallbacks = [];
var deviceOrientationData = {}, deviceMotionData = {};

// Internal screen orientation variables
var hasScreenOrientationAPI = window.screen && window.screen.orientation && window.screen.orientation.angle !== undefined && window.screen.orientation.angle !== null ? true : false;
var screenOrientationAngle = ( hasScreenOrientationAPI ? window.screen.orientation.angle : ( window.orientation || 0 ) ) * degToRad;

var SCREEN_ROTATION_0        = 0,
    SCREEN_ROTATION_90       = M_PI_2,
    SCREEN_ROTATION_180      = M_PI,
    SCREEN_ROTATION_270      = M_2_PI / 3,
    SCREEN_ROTATION_MINUS_90 = - M_PI_2;

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

////// Internal Event Handlers //////

function handleScreenOrientationChange () {

	if ( hasScreenOrientationAPI ) {

		screenOrientationAngle = ( window.screen.orientation.angle || 0 ) * degToRad;

	} else {

		screenOrientationAngle = ( window.orientation || 0 ) * degToRad;

	}

}

function handleDeviceOrientationChange ( event ) {

	deviceOrientationData = event;

	// Fire every callback function each time deviceorientation is updated
	for ( var i in orientationCallbacks ) {

		orientationCallbacks[ i ].call( this );

	}

}

function handleDeviceMotionChange ( event ) {

	deviceMotionData = event;

	// Fire every callback function each time devicemotion is updated
	for ( var i in motionCallbacks ) {

		motionCallbacks[ i ].call( this );

	}

}

///// FULLTILT API Root Object /////

var FULLTILT = {};

FULLTILT.version = "0.5.0";

///// FULLTILT API Root Methods /////

FULLTILT.getDeviceOrientation = function(options) {

	var promise = new Promise(function(resolve, reject) {

		var control = new FULLTILT.DeviceOrientation(options);

		control.start();

		var orientationSensorCheck = new SensorCheck(deviceOrientationData);

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

		var motionSensorCheck = new SensorCheck(deviceMotionData);

		motionSensorCheck.then(function() {

			resolve(control);

		}).catch(function() {

			control.stop();
			reject('DeviceMotion is not supported');

		});

	});

	return promise;

};

////// FULLTILT.Quaternion //////

FULLTILT.Quaternion = function ( x, y, z, w ) {

	var quat, outQuat;

	this.set = function ( x, y, z, w ) {

		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
		this.w = w || 1;

	};

	this.copy = function ( quaternion ) {

		this.x = quaternion.x;
		this.y = quaternion.y;
		this.z = quaternion.z;
		this.w = quaternion.w;

	};

	this.setFromEuler = (function () {

		var _x, _y, _z;
		var _x_2, _y_2, _z_2;
		var cX, cY, cZ, sX, sY, sZ;

		return function ( euler ) {

			euler = euler || {};

			_z = ( euler.alpha || 0 ) * degToRad;
			_x = ( euler.beta || 0 ) * degToRad;
			_y = ( euler.gamma || 0 ) * degToRad;

			_z_2 = _z / 2;
			_x_2 = _x / 2;
			_y_2 = _y / 2;

			cX = Math.cos( _x_2 );
			cY = Math.cos( _y_2 );
			cZ = Math.cos( _z_2 );
			sX = Math.sin( _x_2 );
			sY = Math.sin( _y_2 );
			sZ = Math.sin( _z_2 );

			this.set(
				sX * cY * cZ - cX * sY * sZ, // x
				cX * sY * cZ + sX * cY * sZ, // y
				cX * cY * sZ + sX * sY * cZ, // z
				cX * cY * cZ - sX * sY * sZ  // w
			);

			this.normalize();

			return this;

		};

	})();

	this.setFromRotationMatrix = (function () {

		var R;

		return function( matrix ) {

			R = matrix.elements;

			this.set(
				0.5 * Math.sqrt( 1 + R[0] - R[4] - R[8] ) * sign( R[7] - R[5] ), // x
				0.5 * Math.sqrt( 1 - R[0] + R[4] - R[8] ) * sign( R[2] - R[6] ), // y
				0.5 * Math.sqrt( 1 - R[0] - R[4] + R[8] ) * sign( R[3] - R[1] ), // z
				0.5 * Math.sqrt( 1 + R[0] + R[4] + R[8] )                        // w
			);

			return this;

		};

	})();

	this.multiply = function ( quaternion ) {

		outQuat = FULLTILT.Quaternion.prototype.multiplyQuaternions( this, quaternion );
		this.copy( outQuat );

		return this;

	};

	this.rotateX = function ( angle ) {

		outQuat = FULLTILT.Quaternion.prototype.rotateByAxisAngle( this, [ 1, 0, 0 ], angle );
		this.copy( outQuat );

		return this;

	};

	this.rotateY = function ( angle ) {

		outQuat = FULLTILT.Quaternion.prototype.rotateByAxisAngle( this, [ 0, 1, 0 ], angle );
		this.copy( outQuat );

		return this;

	};

	this.rotateZ = function ( angle ) {

		outQuat = FULLTILT.Quaternion.prototype.rotateByAxisAngle( this, [ 0, 0, 1 ], angle );
		this.copy( outQuat );

		return this;

	};

	this.normalize = function () {

		return FULLTILT.Quaternion.prototype.normalize( this );

	};

	// Initialize object values
	this.set( x, y, z, w );

};

FULLTILT.Quaternion.prototype = {

	constructor: FULLTILT.Quaternion,

	multiplyQuaternions: function () {

		var multipliedQuat = new FULLTILT.Quaternion();

		return function ( a, b ) {

			var qax = a.x, qay = a.y, qaz = a.z, qaw = a.w;
			var qbx = b.x, qby = b.y, qbz = b.z, qbw = b.w;

			multipliedQuat.set(
				qax * qbw + qaw * qbx + qay * qbz - qaz * qby, // x
				qay * qbw + qaw * qby + qaz * qbx - qax * qbz, // y
				qaz * qbw + qaw * qbz + qax * qby - qay * qbx, // z
				qaw * qbw - qax * qbx - qay * qby - qaz * qbz  // w
			);

			return multipliedQuat;

		};

	}(),

	normalize: function( q ) {

		var len = Math.sqrt( q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w );

		if ( len === 0 ) {

			q.x = 0;
			q.y = 0;
			q.z = 0;
			q.w = 1;

		} else {

			len = 1 / len;

			q.x *= len;
			q.y *= len;
			q.z *= len;
			q.w *= len;

		}

		return q;

	},

	rotateByAxisAngle: function () {

		var outputQuaternion = new FULLTILT.Quaternion();
		var transformQuaternion = new FULLTILT.Quaternion();

		var halfAngle, sA;

		return function ( targetQuaternion, axis, angle ) {

			halfAngle = ( angle || 0 ) / 2;
			sA = Math.sin( halfAngle );

			transformQuaternion.set(
				( axis[ 0 ] || 0 ) * sA, // x
				( axis[ 1 ] || 0 ) * sA, // y
				( axis[ 2 ] || 0 ) * sA, // z
				Math.cos( halfAngle )    // w
			);

			// Multiply quaternion by q
			outputQuaternion = FULLTILT.Quaternion.prototype.multiplyQuaternions( targetQuaternion, transformQuaternion );

			return FULLTILT.Quaternion.prototype.normalize( outputQuaternion );

		};

	}()

};

////// FULLTILT.RotationMatrix //////

FULLTILT.RotationMatrix = function ( m11, m12, m13, m21, m22, m23, m31, m32, m33 ) {

	var outMatrix;

	this.elements = new Float32Array( 9 );

	this.identity = function () {

		this.set(
			1, 0, 0,
			0, 1, 0,
			0, 0, 1
		);

		return this;

	};

	this.set = function ( m11, m12, m13, m21, m22, m23, m31, m32, m33 ) {

		this.elements[ 0 ] = m11 || 1;
		this.elements[ 1 ] = m12 || 0;
		this.elements[ 2 ] = m13 || 0;
		this.elements[ 3 ] = m21 || 0;
		this.elements[ 4 ] = m22 || 1;
		this.elements[ 5 ] = m23 || 0;
		this.elements[ 6 ] = m31 || 0;
		this.elements[ 7 ] = m32 || 0;
		this.elements[ 8 ] = m33 || 1;

	};

	this.copy = function ( matrix ) {

		this.elements[ 0 ] = matrix.elements[ 0 ];
		this.elements[ 1 ] = matrix.elements[ 1 ];
		this.elements[ 2 ] = matrix.elements[ 2 ];
		this.elements[ 3 ] = matrix.elements[ 3 ];
		this.elements[ 4 ] = matrix.elements[ 4 ];
		this.elements[ 5 ] = matrix.elements[ 5 ];
		this.elements[ 6 ] = matrix.elements[ 6 ];
		this.elements[ 7 ] = matrix.elements[ 7 ];
		this.elements[ 8 ] = matrix.elements[ 8 ];

	};

	this.setFromEuler = (function() {

		var _x, _y, _z;
		var cX, cY, cZ, sX, sY, sZ;

		return function ( euler ) {

			euler = euler || {};

			_z = ( euler.alpha || 0 ) * degToRad;
			_x = ( euler.beta || 0 ) * degToRad;
			_y = ( euler.gamma || 0 ) * degToRad;

			cX = Math.cos( _x );
			cY = Math.cos( _y );
			cZ = Math.cos( _z );
			sX = Math.sin( _x );
			sY = Math.sin( _y );
			sZ = Math.sin( _z );

			//
			// ZXY-ordered rotation matrix construction.
			//

			this.set(
				cZ * cY - sZ * sX * sY, // 1,1
				- cX * sZ,              // 1,2
				cY * sZ * sX + cZ * sY, // 1,3

				cY * sZ + cZ * sX * sY, // 2,1
				cZ * cX,                // 2,2
				sZ * sY - cZ * cY * sX, // 2,3

				- cX * sY,              // 3,1
				sX,                     // 3,2
				cX * cY                 // 3,3
			);

			this.normalize();

			return this;

		};

	})();

	this.setFromQuaternion = (function() {

		var sqw, sqx, sqy, sqz;

		return function( q ) {

			sqw = q.w * q.w;
			sqx = q.x * q.x;
			sqy = q.y * q.y;
			sqz = q.z * q.z;

			this.set(
				sqw + sqx - sqy - sqz,       // 1,1
				2 * (q.x * q.y - q.w * q.z), // 1,2
				2 * (q.x * q.z + q.w * q.y), // 1,3

				2 * (q.x * q.y + q.w * q.z), // 2,1
				sqw - sqx + sqy - sqz,       // 2,2
				2 * (q.y * q.z - q.w * q.x), // 2,3

				2 * (q.x * q.z - q.w * q.y), // 3,1
				2 * (q.y * q.z + q.w * q.x), // 3,2
				sqw - sqx - sqy + sqz        // 3,3
			);

			return this;

		};

	})();

	this.multiply = function ( m ) {

		outMatrix = FULLTILT.RotationMatrix.prototype.multiplyMatrices( this, m );
		this.copy( outMatrix );

		return this;

	};

	this.rotateX = function ( angle ) {

		outMatrix = FULLTILT.RotationMatrix.prototype.rotateByAxisAngle( this, [ 1, 0, 0 ], angle );
		this.copy( outMatrix );

		return this;

	};

	this.rotateY = function ( angle ) {

		outMatrix = FULLTILT.RotationMatrix.prototype.rotateByAxisAngle( this, [ 0, 1, 0 ], angle );
		this.copy( outMatrix );

		return this;

	};

	this.rotateZ = function ( angle ) {

		outMatrix = FULLTILT.RotationMatrix.prototype.rotateByAxisAngle( this, [ 0, 0, 1 ], angle );
		this.copy( outMatrix );

		return this;

	};

	this.normalize = function () {

		return FULLTILT.RotationMatrix.prototype.normalize( this );

	};

	// Initialize object values
	this.set( m11, m12, m13, m21, m22, m23, m31, m32, m33 );

};

FULLTILT.RotationMatrix.prototype = {

	constructor: FULLTILT.RotationMatrix,

	multiplyMatrices: function () {

		var matrix = new FULLTILT.RotationMatrix();

		var aE, bE;

		return function ( a, b ) {

			aE = a.elements;
			bE = b.elements;

			matrix.set(
				aE[0] * bE[0] + aE[1] * bE[3] + aE[2] * bE[6],
				aE[0] * bE[1] + aE[1] * bE[4] + aE[2] * bE[7],
				aE[0] * bE[2] + aE[1] * bE[5] + aE[2] * bE[8],

				aE[3] * bE[0] + aE[4] * bE[3] + aE[5] * bE[6],
				aE[3] * bE[1] + aE[4] * bE[4] + aE[5] * bE[7],
				aE[3] * bE[2] + aE[4] * bE[5] + aE[5] * bE[8],

				aE[6] * bE[0] + aE[7] * bE[3] + aE[8] * bE[6],
				aE[6] * bE[1] + aE[7] * bE[4] + aE[8] * bE[7],
				aE[6] * bE[2] + aE[7] * bE[5] + aE[8] * bE[8]
			);

			return matrix;

		};

	}(),

	normalize: function( matrix ) {

		var R = matrix.elements;

		// Calculate matrix determinant
		var determinant = R[0] * R[4] * R[8] - R[0] * R[5] * R[7] - R[1] * R[3] * R[8] + R[1] * R[5] * R[6] + R[2] * R[3] * R[7] - R[2] * R[4] * R[6];

		// Normalize matrix values
		R[0] /= determinant;
		R[1] /= determinant;
		R[2] /= determinant;
		R[3] /= determinant;
		R[4] /= determinant;
		R[5] /= determinant;
		R[6] /= determinant;
		R[7] /= determinant;
		R[8] /= determinant;

		matrix.elements = R;

		return matrix;

	},

	rotateByAxisAngle: function () {

		var outputMatrix = new FULLTILT.RotationMatrix();
		var transformMatrix = new FULLTILT.RotationMatrix();

		var sA, cA;
		var validAxis = false;

		return function ( targetRotationMatrix, axis, angle ) {

			transformMatrix.identity(); // reset transform matrix

			validAxis = false;

			sA = Math.sin( angle );
			cA = Math.cos( angle );

			if ( axis[ 0 ] === 1 && axis[ 1 ] === 0 && axis[ 2 ] === 0 ) { // x

				validAxis = true;

				transformMatrix.elements[4] = cA;
				transformMatrix.elements[5] = -sA;
				transformMatrix.elements[7] = sA;
				transformMatrix.elements[8] = cA;

	 		} else if ( axis[ 1 ] === 1 && axis[ 0 ] === 0 && axis[ 2 ] === 0 ) { // y

				validAxis = true;

				transformMatrix.elements[0] = cA;
				transformMatrix.elements[2] = sA;
				transformMatrix.elements[6] = -sA;
				transformMatrix.elements[8] = cA;

	 		} else if ( axis[ 2 ] === 1 && axis[ 0 ] === 0 && axis[ 1 ] === 0 ) { // z

				validAxis = true;

				transformMatrix.elements[0] = cA;
				transformMatrix.elements[1] = -sA;
				transformMatrix.elements[3] = sA;
				transformMatrix.elements[4] = cA;

	 		}

			if ( validAxis ) {

				outputMatrix = FULLTILT.RotationMatrix.prototype.multiplyMatrices( targetRotationMatrix, transformMatrix );

				outputMatrix = FULLTILT.RotationMatrix.prototype.normalize( outputMatrix );

			} else {

				outputMatrix = targetRotationMatrix;

			}

			return outputMatrix;

		};

	}()

};

////// FULLTILT.Euler //////

FULLTILT.Euler = function ( alpha, beta, gamma ) {

	this.set = function ( alpha, beta, gamma ) {

		this.alpha = alpha || 0;
		this.beta  = beta  || 0;
		this.gamma = gamma || 0;

	};

	this.copy = function ( inEuler ) {

		this.alpha = inEuler.alpha;
		this.beta  = inEuler.beta;
		this.gamma = inEuler.gamma;

	};

	this.setFromRotationMatrix = (function () {

		var R, _alpha, _beta, _gamma;

		return function ( matrix ) {

			R = matrix.elements;

			if (R[8] > 0) { // cos(beta) > 0

				_alpha = Math.atan2(-R[1], R[4]);
				_beta  = Math.asin(R[7]); // beta (-pi/2, pi/2)
				_gamma = Math.atan2(-R[6], R[8]); // gamma (-pi/2, pi/2)

			} else if (R[8] < 0) {  // cos(beta) < 0

				_alpha = Math.atan2(R[1], -R[4]);
				_beta  = -Math.asin(R[7]);
				_beta  += (_beta >= 0) ? - M_PI : M_PI; // beta [-pi,-pi/2) U (pi/2,pi)
				_gamma = Math.atan2(R[6], -R[8]); // gamma (-pi/2, pi/2)

			} else { // R[8] == 0

				if (R[6] > 0) {  // cos(gamma) == 0, cos(beta) > 0

					_alpha = Math.atan2(-R[1], R[4]);
					_beta  = Math.asin(R[7]); // beta [-pi/2, pi/2]
					_gamma = - M_PI_2; // gamma = -pi/2

				} else if (R[6] < 0) { // cos(gamma) == 0, cos(beta) < 0

					_alpha = Math.atan2(R[1], -R[4]);
					_beta  = -Math.asin(R[7]);
					_beta  += (_beta >= 0) ? - M_PI : M_PI; // beta [-pi,-pi/2) U (pi/2,pi)
					_gamma = - M_PI_2; // gamma = -pi/2

				} else { // R[6] == 0, cos(beta) == 0

					// gimbal lock discontinuity
					_alpha = Math.atan2(R[3], R[0]);
					_beta  = (R[7] > 0) ? M_PI_2 : - M_PI_2; // beta = +-pi/2
					_gamma = 0; // gamma = 0

				}

			}

			// alpha is in [-pi, pi], make sure it is in [0, 2*pi).
			if (_alpha < 0) {
				_alpha += M_2_PI; // alpha [0, 2*pi)
			}

			// Convert to degrees
			_alpha *= radToDeg;
			_beta  *= radToDeg;
			_gamma *= radToDeg;

			// apply derived euler angles to current object
			this.set( _alpha, _beta, _gamma );

		};

	})();

	this.setFromQuaternion = (function () {

		var _alpha, _beta, _gamma;

		return function ( q ) {

			var sqw = q.w * q.w;
			var sqx = q.x * q.x;
			var sqy = q.y * q.y;
			var sqz = q.z * q.z;

			var unitLength = sqw + sqx + sqy + sqz; // Normalised == 1, otherwise correction divisor.
			var wxyz = q.w * q.x + q.y * q.z;
			var epsilon = 1e-6; // rounding factor

			if (wxyz > (0.5 - epsilon) * unitLength) {

				_alpha = 2 * Math.atan2(q.y, q.w);
				_beta = M_PI_2;
				_gamma = 0;

			} else if (wxyz < (-0.5 + epsilon) * unitLength) {

				_alpha = -2 * Math.atan2(q.y, q.w);
				_beta = -M_PI_2;
				_gamma = 0;

			} else {

				var aX = sqw - sqx + sqy - sqz;
				var aY = 2 * (q.w * q.z - q.x * q.y);

				var gX = sqw - sqx - sqy + sqz;
				var gY = 2 * (q.w * q.y - q.x * q.z);

				if (gX > 0) {

					_alpha = Math.atan2(aY, aX);
					_beta  = Math.asin(2 * wxyz / unitLength);
					_gamma = Math.atan2(gY, gX);

				} else {

					_alpha = Math.atan2(-aY, -aX);
					_beta  = -Math.asin(2 * wxyz / unitLength);
					_beta  += _beta < 0 ? M_PI : - M_PI;
					_gamma = Math.atan2(-gY, -gX);

				}

			}

			// alpha is in [-pi, pi], make sure it is in [0, 2*pi).
			if (_alpha < 0) {
				_alpha += M_2_PI; // alpha [0, 2*pi)
			}

			// Convert to degrees
			_alpha *= radToDeg;
			_beta  *= radToDeg;
			_gamma *= radToDeg;

			// apply derived euler angles to current object
			this.set( _alpha, _beta, _gamma );

		};

	})();

	this.rotateX = function ( angle ) {

		FULLTILT.Euler.prototype.rotateByAxisAngle( this, [ 1, 0, 0 ], angle );

		return this;

	};

	this.rotateY = function ( angle ) {

		FULLTILT.Euler.prototype.rotateByAxisAngle( this, [ 0, 1, 0 ], angle );

		return this;

	};

	this.rotateZ = function ( angle ) {

		FULLTILT.Euler.prototype.rotateByAxisAngle( this, [ 0, 0, 1 ], angle );

		return this;

	};

	// Initialize object values
	this.set( alpha, beta, gamma );

};

FULLTILT.Euler.prototype = {

	constructor: FULLTILT.Euler,

	rotateByAxisAngle: function () {

		var _matrix = new FULLTILT.RotationMatrix();
		var outEuler;

		return function ( targetEuler, axis, angle ) {

			_matrix.setFromEuler( targetEuler );

			_matrix = FULLTILT.RotationMatrix.prototype.rotateByAxisAngle( _matrix, axis, angle );

			targetEuler.setFromRotationMatrix( _matrix );

			return targetEuler;

		};

	}()

};

///// FULLTILT.DeviceOrientation //////

FULLTILT.DeviceOrientation = function (options) {

	this.options = options || {}; // by default use UA deviceorientation 'type' ("game" on iOS, "world" on Android)

	var tries = 0;
	var maxTries = 200;
	var successCount = 0;
	var successThreshold = 10;

	this.alphaOffsetScreen = 0;
	this.alphaOffsetDevice = undefined;

	// Create a game-based deviceorientation object (initial alpha === 0 degrees)
	if (this.options.type === "game") {

		var setGameAlphaOffset = function(evt) {

			if (evt.alpha !== null) { // do regardless of whether 'evt.absolute' is also true
				this.alphaOffsetDevice = new FULLTILT.Euler(evt.alpha, 0, 0);
				this.alphaOffsetDevice.rotateZ( -screenOrientationAngle );

				// Discard first {successThreshold} responses while a better compass lock is found by UA
				if(++successCount >= successThreshold) {
					window.removeEventListener( 'deviceorientation', setGameAlphaOffset, false );
					return;
				}
			}

			if(++tries >= maxTries) {
				window.removeEventListener( 'deviceorientation', setGameAlphaOffset, false );
			}

		}.bind(this);

		window.addEventListener( 'deviceorientation', setGameAlphaOffset, false );

	// Create a compass-based deviceorientation object (initial alpha === compass degrees)
	} else if (this.options.type === "world") {

		var setCompassAlphaOffset = function(evt) {

			if (evt.absolute !== true && evt.webkitCompassAccuracy !== undefined && evt.webkitCompassAccuracy !== null && +evt.webkitCompassAccuracy >= 0 && +evt.webkitCompassAccuracy < 50) {
				this.alphaOffsetDevice = new FULLTILT.Euler(evt.webkitCompassHeading, 0, 0);
				this.alphaOffsetDevice.rotateZ( screenOrientationAngle );
				this.alphaOffsetScreen = screenOrientationAngle;

				// Discard first {successThreshold} responses while a better compass lock is found by UA
				if(++successCount >= successThreshold) {
					window.removeEventListener( 'deviceorientation', setCompassAlphaOffset, false );
					return;
				}
			}

			if(++tries >= maxTries) {
				window.removeEventListener( 'deviceorientation', setCompassAlphaOffset, false );
			}

		}.bind(this);

		window.addEventListener( 'deviceorientation', setCompassAlphaOffset, false );

	} // else... use whatever orientation system the UA provides ("game" on iOS, "world" on Android)

};

FULLTILT.DeviceOrientation.prototype = {

	constructor: FULLTILT.DeviceOrientation,

	start: function ( callback ) {

		if ( callback && Object.prototype.toString.call( callback ) == '[object Function]' ) {

			orientationCallbacks.push( callback );

		}

		if( !screenActive ) {

			if ( hasScreenOrientationAPI ) {

			window.screen.orientation.addEventListener( 'change', handleScreenOrientationChange, false );

			} else {

				window.addEventListener( 'orientationchange', handleScreenOrientationChange, false );

			}

		}

		if ( !orientationActive ) {

			window.addEventListener( 'deviceorientation', handleDeviceOrientationChange, false );

			orientationActive = true;

		}

	},

	stop: function () {

		if ( orientationActive ) {

			window.removeEventListener( 'deviceorientation', handleDeviceOrientationChange, false );

			orientationActive = false;

		}

	},

	listen: function( callback ) {

		this.start( callback );

	},

	getFixedFrameQuaternion: (function () {

		var euler = new FULLTILT.Euler();
		var matrix = new FULLTILT.RotationMatrix();
		var quaternion = new FULLTILT.Quaternion();

		return function() {

			var adjustedAlpha = deviceOrientationData.alpha;

			if (this.alphaOffsetDevice) {
				matrix.setFromEuler( this.alphaOffsetDevice );
				matrix.rotateZ( - this.alphaOffsetScreen );
				euler.setFromRotationMatrix( matrix );

				if (euler.alpha < 0) {
					euler.alpha += 360;
				}

				adjustedAlpha -= euler.alpha;
			}

			euler.set(
				adjustedAlpha,
				deviceOrientationData.beta,
				deviceOrientationData.gamma
			);

			quaternion.setFromEuler( euler );

			return quaternion;

		};

	})(),

	getScreenAdjustedQuaternion: (function () {

		var quaternion;

		return function() {

			quaternion = this.getFixedFrameQuaternion();

			// Automatically apply screen orientation transform
			quaternion.rotateZ( - screenOrientationAngle );

			return quaternion;

		};

	})(),

	getFixedFrameMatrix: (function () {

		var euler = new FULLTILT.Euler();
		var matrix = new FULLTILT.RotationMatrix();

		return function () {

			var adjustedAlpha = deviceOrientationData.alpha;

			if (this.alphaOffsetDevice) {
				matrix.setFromEuler( this.alphaOffsetDevice );
				matrix.rotateZ( - this.alphaOffsetScreen );
				euler.setFromRotationMatrix( matrix );

				if (euler.alpha < 0) {
					euler.alpha += 360;
				}

				adjustedAlpha -= euler.alpha;
			}

			euler.set(
				adjustedAlpha,
				deviceOrientationData.beta,
				deviceOrientationData.gamma
			);

			matrix.setFromEuler( euler );

			return matrix;

		};

	})(),

	getScreenAdjustedMatrix: (function () {

		var matrix;

		return function () {

			matrix = this.getFixedFrameMatrix();

			// Automatically apply screen orientation transform
			matrix.rotateZ( - screenOrientationAngle );

			return matrix;

		};

	})(),

	getFixedFrameEuler: (function () {

		var euler = new FULLTILT.Euler();
		var matrix;

		return function () {

			matrix = this.getFixedFrameMatrix();

			euler.setFromRotationMatrix( matrix );

			return euler;

		};

	})(),

	getScreenAdjustedEuler: (function () {

		var euler = new FULLTILT.Euler();
		var matrix;

		return function () {

			matrix = this.getScreenAdjustedMatrix();

			euler.setFromRotationMatrix( matrix );

			return euler;

		};

	})(),

	isAbsolute: function () {

		if ( deviceOrientationData && deviceOrientationData.absolute === true ) {
			return true;
		}

		return false;

	},

	getLastRawEventData: function () {

		return deviceOrientationData;

	}

};

///// FULLTILT.DeviceMotion //////

FULLTILT.DeviceMotion = function (options) {

	this.options = options || {}; // placeholder object since no options are currently supported

};

FULLTILT.DeviceMotion.prototype = {

	constructor: FULLTILT.DeviceMotion,

	start: function ( callback ) {

		if ( callback && Object.prototype.toString.call( callback ) == '[object Function]' ) {

			motionCallbacks.push( callback );

		}

		if( !screenActive ) {

			if ( hasScreenOrientationAPI ) {

				window.screen.orientation.addEventListener( 'change', handleScreenOrientationChange, false );

			} else {

				window.addEventListener( 'orientationchange', handleScreenOrientationChange, false );

			}

		}

		if ( !motionActive ) {

			window.addEventListener( 'devicemotion', handleDeviceMotionChange, false );

			motionActive = true;

		}

	},

	stop: function () {

		if ( motionActive ) {

			window.removeEventListener( 'devicemotion', handleDeviceMotionChange, false );

			motionActive = false;

		}

	},

	listen: function( callback ) {

		this.start( callback );

	},

	getScreenAdjustedAcceleration: function () {

		var accData = deviceMotionData.acceleration || {};
		var screenAccData = {};

		switch ( screenOrientationAngle ) {
			case SCREEN_ROTATION_90:
				screenAccData.x = - accData.y;
				screenAccData.y =   accData.x;
				break;
			case SCREEN_ROTATION_180:
				screenAccData.x = - accData.x;
				screenAccData.y = - accData.y;
				break;
			case SCREEN_ROTATION_270:
			case SCREEN_ROTATION_MINUS_90:
				screenAccData.x =   accData.y;
				screenAccData.y = - accData.x;
				break;
			default: // SCREEN_ROTATION_0
				screenAccData.x =   accData.x;
				screenAccData.y =   accData.y;
				break;
		}

		screenAccData.z = accData.z;

		return screenAccData;

	},

	getScreenAdjustedAccelerationIncludingGravity: function () {

		var accGData = deviceMotionData.accelerationIncludingGravity || {};
		var screenAccGData = {};

		switch ( screenOrientationAngle ) {
			case SCREEN_ROTATION_90:
				screenAccGData.x = - accGData.y;
				screenAccGData.y =   accGData.x;
				break;
			case SCREEN_ROTATION_180:
				screenAccGData.x = - accGData.x;
				screenAccGData.y = - accGData.y;
				break;
			case SCREEN_ROTATION_270:
			case SCREEN_ROTATION_MINUS_90:
				screenAccGData.x =   accGData.y;
				screenAccGData.y = - accGData.x;
				break;
			default: // SCREEN_ROTATION_0
				screenAccGData.x =   accGData.x;
				screenAccGData.y =   accGData.y;
				break;
		}

		screenAccGData.z = accGData.z;

		return screenAccGData;

	},

	getScreenAdjustedRotationRate: function () {

		var rotRateData = deviceMotionData.rotationRate || {};
		var screenRotRateData = {};

		switch ( screenOrientationAngle ) {
			case SCREEN_ROTATION_90:
				screenRotRateData.beta  = - rotRateData.gamma;
				screenRotRateData.gamma =   rotRateData.beta;
				break;
			case SCREEN_ROTATION_180:
				screenRotRateData.beta  = - rotRateData.beta;
				screenRotRateData.gamma = - rotRateData.gamma;
				break;
			case SCREEN_ROTATION_270:
			case SCREEN_ROTATION_MINUS_90:
				screenRotRateData.beta  =   rotRateData.gamma;
				screenRotRateData.gamma = - rotRateData.beta;
				break;
			default: // SCREEN_ROTATION_0
				screenRotRateData.beta  =   rotRateData.beta;
				screenRotRateData.gamma =   rotRateData.gamma;
				break;
		}

		screenRotRateData.alpha = rotRateData.alpha;

		return screenRotRateData;

	},

	getLastRawEventData: function () {

		return deviceMotionData;

	}

};

////// Attach FULLTILT to root DOM element //////

window.FULLTILT = FULLTILT;

})( window );

/*! ES6 Promise polyfill v1.0.0 / https://github.com/jakearchibald/es6-promises */
(function() {
var define, requireModule, require, requirejs;

(function() {
  var registry = {}, seen = {};

  define = function(name, deps, callback) {
    registry[name] = { deps: deps, callback: callback };
  };

  requirejs = require = requireModule = function(name) {
  requirejs._eak_seen = registry;

    if (seen[name]) { return seen[name]; }
    seen[name] = {};

    if (!registry[name]) {
      throw new Error("Could not find module " + name);
    }

    var mod = registry[name],
        deps = mod.deps,
        callback = mod.callback,
        reified = [],
        exports;

    for (var i=0, l=deps.length; i<l; i++) {
      if (deps[i] === 'exports') {
        reified.push(exports = {});
      } else {
        reified.push(requireModule(resolve(deps[i])));
      }
    }

    var value = callback.apply(this, reified);
    return seen[name] = exports || value;

    function resolve(child) {
      if (child.charAt(0) !== '.') { return child; }
      var parts = child.split("/");
      var parentBase = name.split("/").slice(0, -1);

      for (var i=0, l=parts.length; i<l; i++) {
        var part = parts[i];

        if (part === '..') { parentBase.pop(); }
        else if (part === '.') { continue; }
        else { parentBase.push(part); }
      }

      return parentBase.join("/");
    }
  };
})();

define("promise/all",
  ["./utils","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    /* global toString */

    var isArray = __dependency1__.isArray;
    var isFunction = __dependency1__.isFunction;

    /**
      Returns a promise that is fulfilled when all the given promises have been
      fulfilled, or rejected if any of them become rejected. The return promise
      is fulfilled with an array that gives all the values in the order they were
      passed in the `promises` array argument.

      Example:

      ```javascript
      var promise1 = RSVP.resolve(1);
      var promise2 = RSVP.resolve(2);
      var promise3 = RSVP.resolve(3);
      var promises = [ promise1, promise2, promise3 ];

      RSVP.all(promises).then(function(array){
        // The array here would be [ 1, 2, 3 ];
      });
      ```

      If any of the `promises` given to `RSVP.all` are rejected, the first promise
      that is rejected will be given as an argument to the returned promises's
      rejection handler. For example:

      Example:

      ```javascript
      var promise1 = RSVP.resolve(1);
      var promise2 = RSVP.reject(new Error("2"));
      var promise3 = RSVP.reject(new Error("3"));
      var promises = [ promise1, promise2, promise3 ];

      RSVP.all(promises).then(function(array){
        // Code here never runs because there are rejected promises!
      }, function(error) {
        // error.message === "2"
      });
      ```

      @method all
      @for RSVP
      @param {Array} promises
      @param {String} label
      @return {Promise} promise that is fulfilled when all `promises` have been
      fulfilled, or rejected if any of them become rejected.
    */
    function all(promises) {
      /*jshint validthis:true */
      var Promise = this;

      if (!isArray(promises)) {
        throw new TypeError('You must pass an array to all.');
      }

      return new Promise(function(resolve, reject) {
        var results = [], remaining = promises.length,
        promise;

        if (remaining === 0) {
          resolve([]);
        }

        function resolver(index) {
          return function(value) {
            resolveAll(index, value);
          };
        }

        function resolveAll(index, value) {
          results[index] = value;
          if (--remaining === 0) {
            resolve(results);
          }
        }

        for (var i = 0; i < promises.length; i++) {
          promise = promises[i];

          if (promise && isFunction(promise.then)) {
            promise.then(resolver(i), reject);
          } else {
            resolveAll(i, promise);
          }
        }
      });
    }

    __exports__.all = all;
  });
define("promise/asap",
  ["exports"],
  function(__exports__) {
    "use strict";
    var browserGlobal = (typeof window !== 'undefined') ? window : {};
    var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
    var local = (typeof global !== 'undefined') ? global : (this === undefined? window:this);

    // node
    function useNextTick() {
      return function() {
        process.nextTick(flush);
      };
    }

    function useMutationObserver() {
      var iterations = 0;
      var observer = new BrowserMutationObserver(flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    function useSetTimeout() {
      return function() {
        local.setTimeout(flush, 1);
      };
    }

    var queue = [];
    function flush() {
      for (var i = 0; i < queue.length; i++) {
        var tuple = queue[i];
        var callback = tuple[0], arg = tuple[1];
        callback(arg);
      }
      queue = [];
    }

    var scheduleFlush;

    // Decide what async method to use to triggering processing of queued callbacks:
    if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
      scheduleFlush = useNextTick();
    } else if (BrowserMutationObserver) {
      scheduleFlush = useMutationObserver();
    } else {
      scheduleFlush = useSetTimeout();
    }

    function asap(callback, arg) {
      var length = queue.push([callback, arg]);
      if (length === 1) {
        // If length is 1, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        scheduleFlush();
      }
    }

    __exports__.asap = asap;
  });
define("promise/config",
  ["exports"],
  function(__exports__) {
    "use strict";
    var config = {
      instrument: false
    };

    function configure(name, value) {
      if (arguments.length === 2) {
        config[name] = value;
      } else {
        return config[name];
      }
    }

    __exports__.config = config;
    __exports__.configure = configure;
  });
define("promise/polyfill",
  ["./promise","./utils","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    /*global self*/
    var RSVPPromise = __dependency1__.Promise;
    var isFunction = __dependency2__.isFunction;

    function polyfill() {
      var local;

      if (typeof global !== 'undefined') {
        local = global;
      } else if (typeof window !== 'undefined' && window.document) {
        local = window;
      } else {
        local = self;
      }

      var es6PromiseSupport =
        "Promise" in local &&
        // Some of these methods are missing from
        // Firefox/Chrome experimental implementations
        "resolve" in local.Promise &&
        "reject" in local.Promise &&
        "all" in local.Promise &&
        "race" in local.Promise &&
        // Older version of the spec had a resolver object
        // as the arg rather than a function
        (function() {
          var resolve;
          new local.Promise(function(r) { resolve = r; });
          return isFunction(resolve);
        }());

      if (!es6PromiseSupport) {
        local.Promise = RSVPPromise;
      }
    }

    __exports__.polyfill = polyfill;
  });
define("promise/promise",
  ["./config","./utils","./all","./race","./resolve","./reject","./asap","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __dependency7__, __exports__) {
    "use strict";
    var config = __dependency1__.config;
    var configure = __dependency1__.configure;
    var objectOrFunction = __dependency2__.objectOrFunction;
    var isFunction = __dependency2__.isFunction;
    var now = __dependency2__.now;
    var all = __dependency3__.all;
    var race = __dependency4__.race;
    var staticResolve = __dependency5__.resolve;
    var staticReject = __dependency6__.reject;
    var asap = __dependency7__.asap;

    var counter = 0;

    config.async = asap; // default async is asap;

    function Promise(resolver) {
      if (!isFunction(resolver)) {
        throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
      }

      if (!(this instanceof Promise)) {
        throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
      }

      this._subscribers = [];

      invokeResolver(resolver, this);
    }

    function invokeResolver(resolver, promise) {
      function resolvePromise(value) {
        resolve(promise, value);
      }

      function rejectPromise(reason) {
        reject(promise, reason);
      }

      try {
        resolver(resolvePromise, rejectPromise);
      } catch(e) {
        rejectPromise(e);
      }
    }

    function invokeCallback(settled, promise, callback, detail) {
      var hasCallback = isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        try {
          value = callback(detail);
          succeeded = true;
        } catch(e) {
          failed = true;
          error = e;
        }
      } else {
        value = detail;
        succeeded = true;
      }

      if (handleThenable(promise, value)) {
        return;
      } else if (hasCallback && succeeded) {
        resolve(promise, value);
      } else if (failed) {
        reject(promise, error);
      } else if (settled === FULFILLED) {
        resolve(promise, value);
      } else if (settled === REJECTED) {
        reject(promise, value);
      }
    }

    var PENDING   = void 0;
    var SEALED    = 0;
    var FULFILLED = 1;
    var REJECTED  = 2;

    function subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      subscribers[length] = child;
      subscribers[length + FULFILLED] = onFulfillment;
      subscribers[length + REJECTED]  = onRejection;
    }

    function publish(promise, settled) {
      var child, callback, subscribers = promise._subscribers, detail = promise._detail;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        invokeCallback(settled, child, callback, detail);
      }

      promise._subscribers = null;
    }

    Promise.prototype = {
      constructor: Promise,

      _state: undefined,
      _detail: undefined,
      _subscribers: undefined,

      then: function(onFulfillment, onRejection) {
        var promise = this;

        var thenPromise = new this.constructor(function() {});

        if (this._state) {
          var callbacks = arguments;
          config.async(function invokePromiseCallback() {
            invokeCallback(promise._state, thenPromise, callbacks[promise._state - 1], promise._detail);
          });
        } else {
          subscribe(this, thenPromise, onFulfillment, onRejection);
        }

        return thenPromise;
      },

      'catch': function(onRejection) {
        return this.then(null, onRejection);
      }
    };

    Promise.all = all;
    Promise.race = race;
    Promise.resolve = staticResolve;
    Promise.reject = staticReject;

    function handleThenable(promise, value) {
      var then = null,
      resolved;

      try {
        if (promise === value) {
          throw new TypeError("A promises callback cannot return that same promise.");
        }

        if (objectOrFunction(value)) {
          then = value.then;

          if (isFunction(then)) {
            then.call(value, function(val) {
              if (resolved) { return true; }
              resolved = true;

              if (value !== val) {
                resolve(promise, val);
              } else {
                fulfill(promise, val);
              }
            }, function(val) {
              if (resolved) { return true; }
              resolved = true;

              reject(promise, val);
            });

            return true;
          }
        }
      } catch (error) {
        if (resolved) { return true; }
        reject(promise, error);
        return true;
      }

      return false;
    }

    function resolve(promise, value) {
      if (promise === value) {
        fulfill(promise, value);
      } else if (!handleThenable(promise, value)) {
        fulfill(promise, value);
      }
    }

    function fulfill(promise, value) {
      if (promise._state !== PENDING) { return; }
      promise._state = SEALED;
      promise._detail = value;

      config.async(publishFulfillment, promise);
    }

    function reject(promise, reason) {
      if (promise._state !== PENDING) { return; }
      promise._state = SEALED;
      promise._detail = reason;

      config.async(publishRejection, promise);
    }

    function publishFulfillment(promise) {
      publish(promise, promise._state = FULFILLED);
    }

    function publishRejection(promise) {
      publish(promise, promise._state = REJECTED);
    }

    __exports__.Promise = Promise;
  });
define("promise/race",
  ["./utils","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    /* global toString */
    var isArray = __dependency1__.isArray;

    /**
      `RSVP.race` allows you to watch a series of promises and act as soon as the
      first promise given to the `promises` argument fulfills or rejects.

      Example:

      ```javascript
      var promise1 = new RSVP.Promise(function(resolve, reject){
        setTimeout(function(){
          resolve("promise 1");
        }, 200);
      });

      var promise2 = new RSVP.Promise(function(resolve, reject){
        setTimeout(function(){
          resolve("promise 2");
        }, 100);
      });

      RSVP.race([promise1, promise2]).then(function(result){
        // result === "promise 2" because it was resolved before promise1
        // was resolved.
      });
      ```

      `RSVP.race` is deterministic in that only the state of the first completed
      promise matters. For example, even if other promises given to the `promises`
      array argument are resolved, but the first completed promise has become
      rejected before the other promises became fulfilled, the returned promise
      will become rejected:

      ```javascript
      var promise1 = new RSVP.Promise(function(resolve, reject){
        setTimeout(function(){
          resolve("promise 1");
        }, 200);
      });

      var promise2 = new RSVP.Promise(function(resolve, reject){
        setTimeout(function(){
          reject(new Error("promise 2"));
        }, 100);
      });

      RSVP.race([promise1, promise2]).then(function(result){
        // Code here never runs because there are rejected promises!
      }, function(reason){
        // reason.message === "promise2" because promise 2 became rejected before
        // promise 1 became fulfilled
      });
      ```

      @method race
      @for RSVP
      @param {Array} promises array of promises to observe
      @param {String} label optional string for describing the promise returned.
      Useful for tooling.
      @return {Promise} a promise that becomes fulfilled with the value the first
      completed promises is resolved with if the first completed promise was
      fulfilled, or rejected with the reason that the first completed promise
      was rejected with.
    */
    function race(promises) {
      /*jshint validthis:true */
      var Promise = this;

      if (!isArray(promises)) {
        throw new TypeError('You must pass an array to race.');
      }
      return new Promise(function(resolve, reject) {
        var results = [], promise;

        for (var i = 0; i < promises.length; i++) {
          promise = promises[i];

          if (promise && typeof promise.then === 'function') {
            promise.then(resolve, reject);
          } else {
            resolve(promise);
          }
        }
      });
    }

    __exports__.race = race;
  });
define("promise/reject",
  ["exports"],
  function(__exports__) {
    "use strict";
    /**
      `RSVP.reject` returns a promise that will become rejected with the passed
      `reason`. `RSVP.reject` is essentially shorthand for the following:

      ```javascript
      var promise = new RSVP.Promise(function(resolve, reject){
        reject(new Error('WHOOPS'));
      });

      promise.then(function(value){
        // Code here doesn't run because the promise is rejected!
      }, function(reason){
        // reason.message === 'WHOOPS'
      });
      ```

      Instead of writing the above, your code now simply becomes the following:

      ```javascript
      var promise = RSVP.reject(new Error('WHOOPS'));

      promise.then(function(value){
        // Code here doesn't run because the promise is rejected!
      }, function(reason){
        // reason.message === 'WHOOPS'
      });
      ```

      @method reject
      @for RSVP
      @param {Any} reason value that the returned promise will be rejected with.
      @param {String} label optional string for identifying the returned promise.
      Useful for tooling.
      @return {Promise} a promise that will become rejected with the given
      `reason`.
    */
    function reject(reason) {
      /*jshint validthis:true */
      var Promise = this;

      return new Promise(function (resolve, reject) {
        reject(reason);
      });
    }

    __exports__.reject = reject;
  });
define("promise/resolve",
  ["exports"],
  function(__exports__) {
    "use strict";
    function resolve(value) {
      /*jshint validthis:true */
      if (value && typeof value === 'object' && value.constructor === this) {
        return value;
      }

      var Promise = this;

      return new Promise(function(resolve) {
        resolve(value);
      });
    }

    __exports__.resolve = resolve;
  });
define("promise/utils",
  ["exports"],
  function(__exports__) {
    "use strict";
    function objectOrFunction(x) {
      return isFunction(x) || (typeof x === "object" && x !== null);
    }

    function isFunction(x) {
      return typeof x === "function";
    }

    function isArray(x) {
      return Object.prototype.toString.call(x) === "[object Array]";
    }

    // Date.now is not available in browsers < IE9
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now#Compatibility
    var now = Date.now || function() { return new Date().getTime(); };


    __exports__.objectOrFunction = objectOrFunction;
    __exports__.isFunction = isFunction;
    __exports__.isArray = isArray;
    __exports__.now = now;
  });
requireModule('promise/polyfill').polyfill();
}());