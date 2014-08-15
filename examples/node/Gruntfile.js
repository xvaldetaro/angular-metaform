'use strict';

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			jsFiles: {
				files: ['*.js','app/*.js','../../src/*.js'],
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			cssFiles: {
				files: ['app/*.css'],
				tasks: ['csslint'],
				options: {
					livereload: true
				}
			},
			viewFiles: {
				files: ['app/*.html'],
				options: {
					livereload: true
				}
			},
			formTemplates: {
				files: ['../../src/templates/*.html'],
				tasks: ['ngtemplates'],
				options: {
					livereload: true
				}
			}
		},
		jshint: {
			all: {
				src: ['*.js', 'app/*.js','../src/*.js'],
				options: {
					jshintrc: true,
					ignores: ['app/templates.js']
				}
			}
		},
		csslint: {
			options: {
				csslintrc: '.csslintrc',
			},
			all: {
				src: ['app/*.css']
			}
		},
		ngtemplates: {
			default: {
				cwd: '../../src/templates',
				src: '**.html',
				dest: './app/templates.js',
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
		nodemon: {
			dev: {
				script: 'app.js',
				options: {
					nodeArgs: ['--debug'],
					ext: 'js,html',
					watch: ['*.js']
				}
			}
		},
		'node-inspector': {
			custom: {
				options: {
					'web-port': 1338,
					'web-host': 'localhost',
					'debug-port': 5858,
					'save-live-edit': true,
					'no-preload': true,
					'stack-trace-limit': 50,
					'hidden': []
				}
			}
		},
		concurrent: {
			default: ['nodemon', 'watch', 'node-inspector'],
			options: {
				logConcurrentOutput: true,
				limit: 3
			}
		}
	});

	// Load NPM tasks 
	require('load-grunt-tasks')(grunt);

	// Making grunt default to force in order not to break the project.
	grunt.option('force', true);

	// Default task(s).
	grunt.registerTask('default', ['lint', 'ngtemplates', 'concurrent:default']);

	// Lint task(s).
	grunt.registerTask('lint', ['jshint', 'csslint']);
};
