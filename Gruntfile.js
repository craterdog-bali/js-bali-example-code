'use strict';

const path = require('path');

// wrapper function for grunt configuration
module.exports = function(grunt) {

  grunt.initConfig({

    // read in the package information
    pkg: grunt.file.readJSON('package.json'),

    // grunt-eslint plugin configuration (lint for JS)
    eslint: {
      options: {
      },
      target: [
        'Gruntfile.js',
        '*.js'
      ]
    },

    // grunt-contrib-clean plugin configuration (clean up files)
    clean: {
      build: [
        'config/'
      ],
      options: {
        force: true
      }
    },

    exec: {
      framework: {
        command: 'node test-component-framework.js',
        stdout: true,
        stderr: true
      },
      notary: {
        command: 'node test-digital-notary.js',
        stdout: true,
        stderr: true
      },
      repository: {
        command: 'node test-document-repository.js',
        stdout: true,
        stderr: true
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('framework', 'Test the component framework example code.', ['clean:build', 'eslint', 'exec:framework']);
  grunt.registerTask('notary', 'Test the digital notary example code.', ['clean:build', 'eslint', 'exec:notary']);
  grunt.registerTask('repository', 'Test the document repository example code.', ['clean:build', 'eslint', 'exec:repository']);
  grunt.registerTask('default', 'Test all example code.', ['clean:build', 'eslint', 'exec:framework', 'exec:notary', 'clean:build', 'exec:repository']);

};
