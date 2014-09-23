module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    compass: {
      dist: {
        options: {
          outputStyle: 'expanded',
          require: 'susy',
          sassDir: 'sass',
          cssDir: './backend/www/stylesheets',
          environment: 'production'
        }
      }
    },
    jade: {
      // 將 jade 轉換為 html
      compile: {
        options: {
          pretty: true
        },
        files: {
          './backend/www/index.html': './jade/partial/index.jade',
          './backend/www/tutorial.html': './jade/partial/tutorial.jade',
          './backend/www/build.html': './jade/partial/build.jade',
          './backend/www/explore.html': './jade/partial/explore.jade',
          './backend/www/login-failed.html': './jade/partial/login-failed.jade',
          './backend/www/tombstone.html': './jade/partial/tombstone.jade'
        }
      }
    },
    watch: {
      scss: {
        files: ['./sass/**/*.scss'],
        tasks: ['compass:dist']
      },
      jade: {
        files: ['./jade/**/*.jade'],
        tasks: ['jade:compile']
      },
      livereload: {
        options: {
          livereload: true
        },
        files: ['backend/www/**/*.*']
      }
    },
    connect: {
      // 起 server
      server: {
        options: {
          port: 8000,
          base: 'backend/www',
          livereload: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-compass');

  grunt.registerTask('default', ['compass', 'jade', 'connect', 'watch']);
};
