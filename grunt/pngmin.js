module.exports = {
    dev: {
      options: {
        colors: 256,
        force: true,
        ext: '.png'
      },
      expand: true,
      cwd: '<%= paths.src %>/images',
      src: '{,*/}*.png',
      dest: '<%= paths.dist %>/images'
    }
};
