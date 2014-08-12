/**
 *
 * FULL TILT JS
 * http://github.com/richtr/Full-Tilt-JS
 *
 * A standalone DeviceOrientation Controller library that normalises
 * deviceorientation sensor output, applies relevant screen orientation
 * transforms and returns Euler Angle, Quaternion and Rotation
 * Matrix representations back to web developers.
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

	// Degree to Radian conversion
	var degToRad = Math.PI / 180;
	var radToDeg = 180 / Math.PI;

	// Internal state variables
	var active = false;
	var hasScreenOrientationAPI = window.screen && window.screen.orientation && window.screen.orientation.angle !== undefined && window.screen.orientation.angle !== null ? true : false;
	var screenOrientationAngle = ( hasScreenOrientationAPI ? window.screen.orientation.angle : ( window.orientation || 0 ) ) * degToRad;
	var deviceOrientationData = {};

	///// API Root Object //////

	var FULLTILT = {};

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

		normalize: function( quaternion ) {

			var len = Math.sqrt( quaternion.x * quaternion.x + quaternion.y * quaternion.y + quaternion.z * quaternion.z + quaternion.w * quaternion.w );

			if ( len === 0 ) {

				quaternion.x = 0;
				quaternion.y = 0;
				quaternion.z = 0;
				quaternion.w = 1;

			} else {

				len = 1 / len;

				quaternion.x *= len;
				quaternion.y *= len;
				quaternion.z *= len;
				quaternion.w *= len;

			}

			return quaternion;

		},

		rotateByAxisAngle: function () {

			var outputQuaternion = new FULLTILT.Quaternion();
			var transformQuaternion = new FULLTILT.Quaternion();

			var halfAngle, sA;

			return function ( targetQuaternion, axis, angle ) {

				halfAngle = ( angle || 0 ) / 2;
				sA = Math.sin( halfAngle );

				transformQuaternion.set(
					( axis[ 0 ] || 0 ) * sA, // X
					( axis[ 1 ] || 0 ) * sA, // Y
					( axis[ 2 ] || 0 ) * sA, // Z
					Math.cos( halfAngle )    // W
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
			var determinant = R[0] * R[4] * R[8] - R[0] * R[5] * R[7] - R[1] * R[3] * R[8]
			                    + R[1] * R[5] * R[6] + R[2] * R[3] * R[7] - R[2] * R[4] * R[6];

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

				if ( axis[ 0 ] === 1 && axis[ 1 ] === 0 && axis[ 2 ] === 0 ) { // X

					validAxis = true;

					transformMatrix.elements[4] = cA;
					transformMatrix.elements[5] = -sA;
					transformMatrix.elements[7] = sA;
					transformMatrix.elements[8] = cA;

		 		} else if ( axis[ 1 ] === 1 && axis[ 0 ] === 0 && axis[ 2 ] === 0 ) { // Y

					validAxis = true;

					transformMatrix.elements[0] = cA;
					transformMatrix.elements[2] = sA;
					transformMatrix.elements[6] = -sA;
					transformMatrix.elements[8] = cA;

		 		} else if ( axis[ 2 ] === 1 && axis[ 0 ] === 0 && axis[ 1 ] === 0 ) { // Z

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

			var _matrix, outEuler;

			return function ( targetEuler, axis, angle ) {

				_matrix = calculateRotationMatrix( targetEuler.beta, targetEuler.gamma, targetEuler.alpha );

				_matrix = FULLTILT.RotationMatrix.prototype.rotateByAxisAngle( _matrix, axis, angle );

				outEuler = FULLTILT.Euler.prototype.setFromRotationMatrix( _matrix );

				targetEuler.copy( outEuler );

				return targetEuler;

			};

		}(),

		setFromRotationMatrix: function () {

			var outEuler = new FULLTILT.Euler();
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
					_beta  += (_beta >= 0) ? -Math.PI : Math.PI; // beta [-pi,-pi/2) U (pi/2,pi)
					_gamma = Math.atan2(R[6], -R[8]); // gamma (-pi/2, pi/2)

				} else { // R[8] == 0

					if (R[6] > 0) {  // cos(gamma) == 0, cos(beta) > 0

						_alpha = Math.atan2(-R[1], R[4]);
						_beta  = Math.asin(R[7]); // beta [-pi/2, pi/2]
						_gamma = -Math.PI / 2; // gamma = -pi/2

					} else if (R[6] < 0) { // cos(gamma) == 0, cos(beta) < 0

						_alpha = Math.atan2(R[1], -R[4]);
						_beta  = -Math.asin(R[7]);
						_beta  += (_beta >= 0) ? -Math.PI : Math.PI; // beta [-pi,-pi/2) U (pi/2,pi)
						_gamma = -Math.PI / 2; // gamma = -pi/2

					} else { // R[6] == 0, cos(beta) == 0

						// gimbal lock discontinuity
						_alpha = Math.atan2(R[3], R[0]);
						_beta  = (R[7] > 0) ? Math.PI / 2 : -Math.PI / 2; // beta = +-pi/2
						_gamma = 0; // gamma = 0

					}

				}

				// alpha is in [-pi, pi], make sure it is in [0, 2*pi).
				if (_alpha < 0) {
					_alpha += 2 * Math.PI; // alpha [0, 2*pi)
				}

				// Convert to degrees
				_alpha *= radToDeg;
				_beta  *= radToDeg;
				_gamma *= radToDeg;

				outEuler.set( _alpha, _beta, _gamma );

				return outEuler;

			}

		}()

	};

	////// Internal rotation representation computation functions //////

	var calculateQuaternion = function () {

		var quaternion = new FULLTILT.Quaternion();

		var _x, _y, _z;
		var _x_2, _y_2, _z_2;
		var cX, cY, cZ, sX, sY, sZ;

		return function ( x, y, z ) {

			_z = ( z || 0 ) * degToRad;
			_x = ( x || 0 ) * degToRad;
			_y = ( y || 0 ) * degToRad;

			_z_2 = _z / 2;
			_x_2 = _x / 2;
			_y_2 = _y / 2;

			cX = Math.cos( _x_2 );
			cY = Math.cos( _y_2 );
			cZ = Math.cos( _z_2 );
			sX = Math.sin( _x_2 );
			sY = Math.sin( _y_2 );
			sZ = Math.sin( _z_2 );

			quaternion.set(
				sX * cY * cZ - cX * sY * sZ, // X
				cX * sY * cZ + sX * cY * sZ, // Y
				cX * cY * sZ + sX * sY * cZ, // Z
				cX * cY * cZ - sX * sY * sZ  // W
			);

			quaternion = FULLTILT.Quaternion.prototype.normalize( quaternion );

			return quaternion;

		};

	}();

	var calculateRotationMatrix = function () {

		var matrix = new FULLTILT.RotationMatrix();

		var _x, _y, _z;
		var cX, cY, cZ, sX, sY, sZ;

		return function ( x, y, z ) {

			_z = ( z || 0 ) * degToRad;
			_x = ( x || 0 ) * degToRad;
			_y = ( y || 0 ) * degToRad;

			cX = Math.cos( _x );
			cY = Math.cos( _y );
			cZ = Math.cos( _z );
			sX = Math.sin( _x );
			sY = Math.sin( _y );
			sZ = Math.sin( _z );

			//
			// ZXY-ordered rotation matrix construction.
			//

			matrix.set(
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

			matrix = FULLTILT.RotationMatrix.prototype.normalize( matrix );

			return matrix;

		}

	}();

	var calculateEuler = function () {

		var inEuler = new FULLTILT.Euler();
		var outEuler, _matrix;

		return function ( x, y, z ) {

			_matrix = calculateRotationMatrix( x, y, z );

			outEuler = FULLTILT.Euler.prototype.setFromRotationMatrix( _matrix );

			inEuler.copy( outEuler );

			return inEuler;

		};

	}();

	////// Internal Event Handlers //////

	function handleScreenOrientationChange () {

		if ( hasScreenOrientationAPI ) {

			screenOrientationAngle = ( window.screen.orientation.angle || 0 ) * degToRad;

		} else {

			screenOrientationAngle = ( window.orientation || 0 ) * degToRad;

		}

	};

	function handleDeviceOrientationChange ( event ) {

		deviceOrientationData = event;

	};

	///// FULLTILT.DeviceOrientation //////

	var DeviceOrientation = function () {};

	DeviceOrientation.prototype = {

		constructor: DeviceOrientation,

		start: function () {

			if ( !active ) {

				if( hasScreenOrientationAPI ) {

					window.screen.orientation.addEventListener( 'change', handleScreenOrientationChange, false );

				} else {

					window.addEventListener( 'orientationchange', handleScreenOrientationChange, false );

				}

				window.addEventListener( 'deviceorientation', handleDeviceOrientationChange, false );

				active = true;

			}

		},

		stop: function () {

			if ( active ) {

				if( hasScreenOrientationAPI ) {

					window.screen.orientation.removeEventListener( 'change', handleScreenOrientationChange, false );

				} else {

					window.removeEventListener( 'orientationchange', handleScreenOrientationChange, false );

				}

				window.removeEventListener( 'deviceorientation', handleDeviceOrientationChange, false );

				active = false;

			}

		},

		getDeviceQuaternion: function () {

			// Obtain latest device orientation quaternion
			var quaternion = calculateQuaternion(
				deviceOrientationData.beta,
				deviceOrientationData.gamma,
				deviceOrientationData.alpha
			);

			// Automatically apply screen orientation transform to device orientation quaternion
			quaternion.rotateZ( - screenOrientationAngle );

			return quaternion;

		},

		getDeviceRotation: function () {

			var matrix = calculateRotationMatrix(
				deviceOrientationData.beta,
				deviceOrientationData.gamma,
				deviceOrientationData.alpha
			);

			// Automatically apply screen orientation transform
			matrix.rotateZ( - screenOrientationAngle );

			return matrix;

		},

		getDeviceEuler: function () {

			var euler = calculateEuler(
				deviceOrientationData.beta,
				deviceOrientationData.gamma,
				deviceOrientationData.alpha
			);

			// Automatically apply screen orientation transform
			euler.rotateZ( - screenOrientationAngle );

			return euler;

		},

		isAbsolute: function () {

			if ( deviceOrientationData && deviceOrientationData.absolute === true ) {
				return true;
			}

			return false;

		},

		getRawDeviceOrientationData: function () {

			return deviceOrientationData;

		}

	}

	////// Create root DeviceOrientation API instance //////

	FULLTILT.DeviceOrientation = new DeviceOrientation();

	////// Attach FULLTILT to root DOM element //////

	window.FULLTILT = FULLTILT;

})( window );