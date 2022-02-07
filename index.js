const { generateFont, generateMagicString } = require('./lib/generate')

const webpackLoader = require.resolve('./lib/webpack/loader')

module.exports = {
  generateFont,
  generateMagicString,
  webpackLoader,
}
