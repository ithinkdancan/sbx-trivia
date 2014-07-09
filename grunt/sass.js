module.exports = {
    dist: {
        files: [ {
            expand: true,
            cwd:  '<%= paths.src %>/styles',
            src: [ '*.scss' ],
            dest: '<%= paths.dist %>/styles',
            ext: '.css'
        } ]
    }
};
