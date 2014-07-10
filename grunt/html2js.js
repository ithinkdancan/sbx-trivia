module.exports = {
    templates: {
      src: ['<%= paths.src %>/scripts/**/*.tpl.html'],
      dest: '.tmp/templates.js',
      options:{
            module: 'sbx.trivia.templates',
            base: '<%= paths.src %>/scripts/',
            htmlmin: {
              collapseBooleanAttributes: true,
              collapseWhitespace: true,
              removeAttributeQuotes: true,
              removeComments: true,
              removeEmptyAttributes: true,
              removeRedundantAttributes: true,
              removeScriptTypeAttributes: true,
              removeStyleLinkTypeAttributes: true
            }
        }
    },

}