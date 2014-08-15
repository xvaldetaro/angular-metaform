'use strict';

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			default: {
				expand: true,
				cwd: './',
				src: [
					'../node/app/bower_components/angular/angular.js',
					'../node/app/bower_components/bootstrap/dist/css/bootstrap.css',
					'../node/app/sample.js',
					'../node/app/styles.css',
					'../../dist/metaform.js',
					'index.html'
				],
				dest: 'dist/',
				flatten: true,
				filter: 'isFile',
			}
		},
		'gh-pages': {
			options: {
				base: 'dist',
			},
			src: ['**']
		}
	});

	// Load NPM tasks 
	require('load-grunt-tasks')(grunt);

	// Default task(s).
	grunt.registerTask('default', ['copy']);

	// Default task(s).
	grunt.registerTask('publish', ['copy', 'gh-pages']);
};
