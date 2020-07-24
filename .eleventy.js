//@ts-nocheck
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight")
const dateformat = require('dateformat')
const markdownIt = require('markdown-it')
const inlineMd = markdownIt()
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

  config.addFilter('getGuide', function(tags) {
    return tags.filter(elem => elem !== 'guides')
      .filter(elem => elem.startsWith('guides'))
      .pop()
  })

  config.addFilter('byOrder', function(coll) {
    return coll.sort((a, b) => a.data.order - b.data.order)
  })

  config.addFilter('markdownify', function(input) {
    return inlineMd.render(input)
  })

  config.addFilter('log', function(input) {
    console.log('🤡', input)
    return input
  })


  config.addFilter('splitlines', function(input) {
    const parts = input.split(' ')
    const lines = parts.reduce(function(prev, current) {
      if(!prev.length) {
        return [current]
      }
      let lastOne = prev[prev.length - 1]
      if(lastOne.length + current.length > 18) {
        return [...prev, current]
      }
      prev[prev.length - 1] = lastOne + ' ' + current
      return prev
    }, [])
    return lines
  })

  config.addFilter('abstract', function(input) {
    const $ = cheerio.load(input)
    const x = $('p:first-of-type').eq(0).toString()
    const y = $('p:first-of-type ~ :not(h2, h3, h4, ol, li, ul)').eq(0).toString()
    return x + y
  })


  config.addFilter('excerpt', function(input) {
    const firstParagraph = input.indexOf('<p>')
    const firstParagraphEnd = input.indexOf('</p>')
    return `<p>${input.substring(firstParagraph + 3, firstParagraphEnd)}</p>`
  })

  config.addFilter('filterTOC', function(input) {
    return input.filter(el => !el.data.excludeFromTOC)
  })

  config.addShortcode('now', function() {
    return new Date().toISOString()
  })

  config.addNunjucksFilter('toLowerCase', function(value) {
    return value.toLowerCase()
  })

  config.addNunjucksFilter('teaserIMG', function(value) {
    const { fileSlug } = value
    const { permalink } = value.data
    if(permalink.includes('page.fileSlug')) {
      console.log('👍', permalink, fileSlug)
      return `/${fileSlug}/`
    }
    return permalink
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
    './src/content/typescript-react/img/': 'typescript-react/img/',
    './src/brave-payment-verification.txt': 'brave-payment-verification.txt'
  })
  config.addPassthroughCopy('./src/googlea8ba377bc3684d37.html')
  config.addPassthroughCopy('./src/robots.txt')
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
