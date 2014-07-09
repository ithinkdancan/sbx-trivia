module.exports = {
    dev: {
        expand: true,
        flatten: true,
        src: [
            '<%= paths.dist %>/styles/*.css',
            '!<%= paths.dist %>/styles/*.min.css'
        ],
        dest: '<%= paths.dist %>/styles'
    }
};
