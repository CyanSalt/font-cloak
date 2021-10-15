const loaderUtils = require('loader-utils')
const { generateFonts } = require('../generate')

module.exports = function loader(content) {
  const options = loaderUtils.getOptions(this)
  const query = new URLSearchParams(this.resourceQuery)
  return generateFonts(content, {
    type: query.get('cloak'),
    seed: options.seed,
  })
}

module.exports.raw = true
