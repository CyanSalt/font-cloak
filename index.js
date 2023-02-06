const { generateFont, generateMagicString } = require('./lib/generate')

const webpackLoader = require.resolve('./lib/webpack/loader')
const postcssPlugin = require.resolve('./lib/postcss')

module.exports = {
  generateFont,
  generateMagicString,
  webpackLoader,
  postcssPlugin,
}
