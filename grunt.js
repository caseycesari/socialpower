var fs = require('fs');

module.exports = function(grunt) {
  grunt.initConfig({
   meta: {
      underscoreLicense: fs.readFileSync(process.cwd() + '/public/javascripts/contrib/underscore_license.txt').toString(),
      backboneLicense: fs.readFileSync(process.cwd() + '/public/javascripts/contrib/backbone_license.txt').toString()
    },
    min: {
      components: {
        src: ['public/javascripts/src/components.js'],
        dest: 'public/javascripts/dist/components.min.js'
      },
      underscore: {
        src: ['public/javascripts/contrib/underscore-min.js'],
        dest: 'public/javascripts/dist/underscore.min.js'
      },
      backbone: {
        src: ['public/javascripts/contrib/backbone-dev.js'],
        dest: 'public/javascripts/dist/backbone-dev.min.js'
      },
      base: {
        src: ['public/javascripts/src/sp-base.js'],
        dest: 'public/javascripts/dist/sp-base.min.js'
      }
    },
    concat: {
      dist: {
        src: ['public/javascripts/dist/components.min.js',
          '<banner:meta.underscoreLicense>',
          'public/javascripts/dist/underscore.min.js',
          '<banner:meta.backboneLicense>',
          'public/javascripts/dist/backbone-dev.min.js'],
        dest: 'public/javascripts/dist/built.js'
      }
    }
  });
}
