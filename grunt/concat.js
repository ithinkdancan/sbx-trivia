module.exports = {
    lib: {
        files : {
            'dist/scripts/lib.js': [
                '<%= paths.src %>/bower_components/angular/angular.js',
                '<%= paths.src %>/bower_components/angular-route/angular-route.js',
                '<%= paths.src %>/bower_components/angular-resource/angular-resource.js',
                '<%= paths.src %>/bower_components/angular-socket-io/socket.min.js'
            ]
        }
    },
    app: {
        files: {
            'dist/scripts/app.js': [
                '<%= paths.src %>/scripts/**/*.js',
                '.tmp/templates.js',
                '<%= paths.src %>/scripts/app.js'
            ]
        }
    }
};