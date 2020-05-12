const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight")
const dateformat = require('dateformat')

module.exports = function(config) {

  /*config.addFilter('cssmin', function(code) {
    return new CleanCSS({}).minify(code).styles;
  })*/

  config.addFilter('year', function() {
    return new Date().getFullYear()
  })

  config.addFilter('prettyDate', function(input) {
    return dateformat(new Date(input), 'mmmm d, yyyy')
  })

  config.addFilter('readingTime', function(input) {
    const words = input.split(' ').filter(el => el !== '').length
    return parseInt(words / 200 + 0.5)
  })

  config.addNunjucksFilter('toLowerCase', function(value) {
    return value.toLowerCase()
  })

  config.addPlugin(syntaxHighlight)

  config.addPassthroughCopy('./src/wp-content/')
  config.addPassthroughCopy('./src/manifest.json')
  config.addPassthroughCopy('./src/pwabuilder-sw.js')
  config.addPassthroughCopy('./src/googlea8ba377bc3684d37.html')

  config.addWatchTarget('./src/_assets')

  return {
    dir: {
      input: 'src',
      output: 'dist',
      data: '_data',
      includes: '_includes',
      layouts: '_layouts'
    },
    templateFormats : ['njk', 'md', '11ty.js'],
    htmlTemplateEngine : 'njk',
    markdownTemplateEngine : 'njk',
    passthroughFileCopy: true,
  }
}
