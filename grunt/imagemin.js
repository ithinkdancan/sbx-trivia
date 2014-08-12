module.exports = {
    dist: {
        files: [ {
            expand: true,
            cwd: '<%= paths.src %>/images',
            src: '{,*/}*.{gif,jpeg,jpg}',
            dest: '<%= paths.dist %>/images'
        } ]
    }
};
