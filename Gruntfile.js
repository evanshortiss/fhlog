'use strict';

module.exports = function(grunt) {
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    mocha_istanbul: {
      coverage: {
        src: './test',
        options: {
          mask: '*.spec.js'
        }
      },
      coveralls: {
        src: './test',
        options: {
          coverage: true,
          check: {
            lines: 75,
            statements: 75
          },
          root: './lib',
          reporter: 'spec',
          reportFormats: ['html', 'lcovonly']
        }
      }
    },

    column_lint: {
      files: {
        src: ['./lib/**/*.js']
      }
    },

    jshint: {
      src: ['Gruntfile.js', './lib/**/*.js'],
      options: {
        jshintrc: './jshintrc.js'
      }
    },

    lintspaces: {
      javascript: {
        src: ['./lib/**/*.js'],
        options: {
          // TODO: Reference editorconfig
          indentation: 'spaces',
          spaces: 2,
          newline: true,
          trailingspaces: true,
          ignores: ['js-comments']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-lintspaces');
  grunt.loadNpmTasks('grunt-column-lint');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('format', ['lintspaces', 'jshint', 'column_lint']);
  grunt.registerTask('test', ['mocha_istanbul:coveralls', 'mocha_istanbul:coverage']);
  grunt.registerTask('default', ['format']);
};
