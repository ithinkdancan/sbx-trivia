module.exports = {
    dist: {
        files: [{
            expand: true,
            cwd: '<%= paths.dist %>/scripts',
            src: ['**/*.js', '!**/*.min.js'],
            dest: '<%= paths.dist %>/scripts',
            ext: '.min.js',
            extDot: 'last'
        }]
    }
}