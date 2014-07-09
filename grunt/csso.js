module.exports = {
    dev: {
      expand: true,
      cwd: '<%= paths.dist %>/styles',
      src: [ '*.css', '!*.min.css' ],
      dest: '<%= paths.dist %>/styles',
      ext: '.min.css'
    }
};
