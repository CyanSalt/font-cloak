const { generateFonts, generateMagicString } = require('./lib/generate')
const webpackUtils = require('./lib/webpack/utils')

const webpackLoader = require.resolve('./webpack/loader')

module.exports = {
  generateFonts,
  generateMagicString,
  webpackLoader,
  webpackUtils,
}
