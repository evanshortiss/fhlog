'use strict';

module.exports = function(grunt) {
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    mochaTest: {
      src: [
        'test/**/*.js',
        '!test/browser/*.js'
      ],
      options: {
        reporter: 'spec'
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

    shell: {
      build: {
        command: './node_modules/.bin/browserify -s Loggr ' +
          '-e ./lib/LoggerFactory.js -o ./dist/logger.js'
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

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-lintspaces');
  grunt.loadNpmTasks('grunt-column-lint');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('format', ['lintspaces', 'jshint', 'column_lint']);
  grunt.registerTask('test', ['format', 'mochaTest']);
  grunt.registerTask('build', ['format', 'test', 'shell:build']);
  grunt.registerTask('default', ['format']);
};
