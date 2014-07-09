module.exports = {
    options: {
        // beautify: true,
        // mangle: false
    },
    lib: {
        files : {
            'dist/scripts/lib.js': [
                '<%= paths.src %>/bower_components/angular/angular.js',
                '<%= paths.src %>/bower_components/angular-socket-io/socket.js'
            ]
        }
    },
    app: {
        files: {
            'dist/scripts/app.js': [
                '<%= paths.src %>/scripts/**/*.js',
                '<%= paths.src %>/scripts/app.js'
            ]
        }
    }
}