'use strict';

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			default: {
				src: ['src/metaform.js'],
				options: {
					jshintrc: true
				}
			}
		},
		uglify: {
			default: {
				options: {
					mangle: false
				},
				files: {
					'dist/metaform.min.js': 'dist/metaform.js'
				}
			}
		},
		ngtemplates: {
			default: {
				cwd: 'src/templates',
				src: '**.html',
				dest: '.grunt/templates.js',
				options: {
					url: function(url) { return url.replace('.html', '.xv'); },
					module: 'xvMetaform',
					htmlmin: {
						collapseBooleanAttributes:      true,
						collapseWhitespace:             true,
						removeAttributeQuotes:          true,
						removeComments:                 true, // Only if you don't use comment directives!
						removeEmptyAttributes:          true,
						removeRedundantAttributes:      true,
						removeScriptTypeAttributes:     true,
						removeStyleLinkTypeAttributes:  true
					}
				}
			}
		},
		concat: {
			default: {
				src: ['src/metaform.js', '.grunt/templates.js'],
				dest: 'dist/metaform.js'
			}
		}
	});

	// Load NPM tasks 
	require('load-grunt-tasks')(grunt);

	// Default task(s).
	grunt.registerTask('default', ['jshint', 'ngtemplates', 'concat', 'uglify']);
};
