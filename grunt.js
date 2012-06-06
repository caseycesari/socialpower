module.exports = function(grunt) {
  grunt.initConfig({
    concat: {
      dist: {
        src: ['public/javascripts/src/components.js', 'public/javascripts/contrib/underscore-min.js', 'public/javascripts/contrib/backbone-dev.js' ],
        dest: 'public/javascripts/dist/built.js'
      },
      dist: {
        src: ['public/javascripts/src/sp-base.js'],
        dest: 'public/javascripts/dist/base.js'
      }
    },
    min: {
      dist: {
        src: ['public/javascripts/dist/built.js'],
        dest: 'public/javascripts/dist/built.min.js'
      },
      dist: {
        src: ['public/javascripts/dist/base.js'],
        dest: 'public/javascripts/dist/base.min.js'
      }
    }
  });
}
