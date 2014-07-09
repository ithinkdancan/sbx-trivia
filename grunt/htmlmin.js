module.exports = {
      options: {
        collapseWhitespace: true,
        removeCommentsFromCDATA: true,
        removeEmptyAttributes: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= paths.src %>',
          src: '{,*/}*.html',
          dest: '<%= paths.dist %>'
        }]
      },
      dev: {
        options: {
          collapseWhitespace: false,
          removeCommentsFromCDATA: false,
          removeEmptyAttributes: false
        },
        files: [{
          expand: true,
          cwd: '<%= paths.src %>',
          src: '{,*/}*.html',
          dest: '<%= paths.dist %>'
        }]
      }
    }