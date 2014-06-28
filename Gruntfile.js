'use strict';

module.exports = function(grunt) {
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),


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

  grunt.loadNpmTasks('grunt-lintspaces');
  grunt.loadNpmTasks('grunt-column-lint');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('format', ['lintspaces', 'jshint', 'column_lint']);
  grunt.registerTask('default', ['format']);
};
