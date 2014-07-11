module.exports = {
    gruntfile: {
        files: ['Gruntfile.js']
    },

    html: {
         files: [ '<%= paths.src %>/*.html' ],
         tasks: ['htmlmin:dist'],
         options: {
            livereload: true
        }
    },

    templates: {
        files: ['<%= paths.src %>/scripts/**/*.tpl.html'],
        tasks: ['html2js', 'uglify'],
        options: {
          livereload: false
        }
    },

    sass: {
        files: [ '<%= paths.src %>/styles/**/*.scss' ],
        tasks: ['sass', 'autoprefixer', 'csso'],
        options: {
            livereload: false
        }
    },

    css: {
        files: [ 
            '<%= paths.dist %>/styles/**/*.css',
            '!<%= paths.dist %>/styles/**/*.min.css'
        ],
        options: {
            livereload: true
        }
    },

    images: {
        files: [ '<%= paths.src %>/images/**/*.{gif,jpeg,jpg}' ],
        tasks: [ 'newer:imagemin'],
        options: {
            livereload: false
        }
    },

    pngs: {
        files: [ '<%= paths.src %>/images/**/*.png' ],
        tasks: [ 'newer:pngmin'],
        options: {
            livereload: false
        }
    },

    optimizedImages: {
        files: [ '<%= paths.dist %>/images/**/*.{gif,jpeg,jpg,png}' ],
        options: {
            livereload: true
        }
    },


    scripts: {
        files: [ '<%= paths.src %>/scripts/**/*.js' ],
        tasks: [ 'concat:app', 'newer:uglify' ],
        options: {
            livereload: true
        }
    },
    
}