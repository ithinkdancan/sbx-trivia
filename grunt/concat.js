module.exports = {
    lib: {
        files : {
            'dist/scripts/lib.js': [
                '<%= paths.src %>/bower_components/angular/angular.js',
                '<%= paths.src %>/bower_components/angular-route/angular-route.js',
                '<%= paths.src %>/bower_components/angular-resource/angular-resource.js',
                '<%= paths.src %>/bower_components/angular-animate/angular-animate.js',
                '<%= paths.src %>/bower_components/angular-socket-io/socket.min.js',
                '<%= paths.src %>/bower_components/ios-imagefile-megapixel/src/megapix-image.js',
                '<%= paths.src %>/bower_components/exif-js/exif.js',
                '<%= paths.src %>/bower_components/d3/d3.js'
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