const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight")
const dateformat = require('dateformat')
const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const markdownItLazy =  require('markdown-it-image-lazy-loading')
const cheerio = require('cheerio')

module.exports = function(config) {

  /*config.addFilter('cssmin', function(code) {
    return new CleanCSS({}).minify(code).styles;
  })*/

  config.addFilter('year', function() {
    return new Date().getFullYear()
  })

  config.addFilter('getYear', function(input) {
    return new Date(input).getFullYear()
  })

  config.addFilter('prettyDate', function(input) {
    return dateformat(new Date(input), 'mmmm d, yyyy')
  })

  config.addFilter('toISO', function(input) {
    return new Date(input).toISOString()
  })

  config.addFilter('readingTime', function(input) {
    const words = input.split(' ').filter(el => el !== '').length
    return parseInt(words / 200 + 0.5)
  })

  config.addFilter('keys', function(input) {
    return JSON.stringify(Object.keys(input))
  })

  config.addFilter('splitlines', function(input) {
    const parts = input.split(' ')
    const lines = parts.reduce(function(prev, current) {
      if(!prev.length) {
        return [current]
      }
      let lastOne = prev[prev.length - 1]
      if(lastOne.length + current.length > 30) {
        return [...prev, current]
      }
      prev[prev.length - 1] = lastOne + ' ' + current
      return prev
    }, [])
    return lines
  })

  config.addFilter('abstract', function(input) {
    const $ = cheerio.load(input)
    // 
    return $.html('p:first-child, p:first-child + :not(h2, h3, ul, ol)').toString()
  })


  config.addFilter('excerpt', function(input) {
    const firstParagraph = input.indexOf('<p>')
    const firstParagraphEnd = input.indexOf('</p>')
    return `<p>${input.substring(firstParagraph + 3, firstParagraphEnd)}</p>`
  })


  config.addShortcode('now', function() {
    return new Date().toISOString()
  })

  config.addNunjucksFilter('toLowerCase', function(value) {
    return value.toLowerCase()
  })

  config.addCollection('categories', function (collection) {
    const categories = collection.items.filter(Boolean).reverse().reduce((prev, current) => {
      if(current.data.categories) {
        return [...new Set([...current.data.categories, ...prev])]
      }
      return prev
    }, [])
    let cats = {}
    categories.forEach(el => {
      cats[el] = Array.from(collection.items)
        .filter(item => !item.data.hideFromList)
        .filter(item => item.data.categories && item.data.categories.includes(el))
        .sort((a, b) => {
          return a.date - b.date
        })
    })
    return cats
  })

  config.addPlugin(syntaxHighlight)

  config.setLibrary(
    'md',
    markdownIt({
      html: true,
      breaks: false,
      linkify: true,
      typographer: true
    }).use(markdownItAnchor, {
      permalink: true,
      permalinkClass: "direct-link",
      permalinkSymbol: "#"
    }).use(markdownItLazy)
  )

  config.addPassthroughCopy('./src/wp-content/')
  config.addPassthroughCopy('./src/manifest.json')
  config.addPassthroughCopy('./src/pwabuilder-sw.js')
  config.addPassthroughCopy({
    './src/content/typescript-react/img/': 'typescript-react/img/' 
  })
  config.addPassthroughCopy('./src/googlea8ba377bc3684d37.html')
  config.addPassthroughCopy('./src/icon/')

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
