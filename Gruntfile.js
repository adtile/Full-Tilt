module.exports = function(grunt) {

	grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	concat: {
		options: {
		separator: '\n\n'
		},
		dist: {
			src: [
				'src/intro.js',
				'src/Utils.js',
				'src/Events.js',
				'src/Core.js',
				'src/Quaternion.js',
				'src/RotationMatrix.js',
				'src/Euler.js',
				'src/DeviceOrientation.js',
				'src/DeviceMotion.js',
				'src/outro.js'
			],
			dest: 'dist/<%= pkg.name %>.js'
		}
	},
	uglify: {
		options: {
			banner: '/*! <%= pkg.title %> v<%= pkg.version %> / <%= pkg.homepage %> */\n'
		},
		dist: {
			files: {
				'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
			}
		}
	},
	jshint: {
		files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
	},
	watch: {
		files: ['<%= jshint.files %>'],
		tasks: ['jshint']
	}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('test', ['jshint']);

	grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

};