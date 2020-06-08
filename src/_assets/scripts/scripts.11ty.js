const rollup = require('rollup')
const { terser } = require("rollup-plugin-terser")
const path = require('path')

// see below for details on the options
const inputOptions = {
  input: path.join(__dirname, '/main.js'),
  plugins: [
    //terser()
  ]
}
const outputOptions = {
  format: 'es'
};

module.exports = class {
  async data() {
    return {
      permalink: `/assets/scripts/main.js`,
      eleventyExcludeFromCollections: true,
      entryPath: inputOptions.input
    }
  }

  async render() {
    const bundle = await rollup.rollup(inputOptions);
    const { output } = await bundle.generate(outputOptions);
    console.log(output)
    return output[0].code
  }
}
