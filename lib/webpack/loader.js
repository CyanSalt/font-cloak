const loaderUtils = require('loader-utils')
const { generateFont } = require('../generate')

module.exports = function loader(content) {
  const options = loaderUtils.getOptions(this)
  const query = new URLSearchParams(this.resourceQuery)
  return generateFont(content, {
    type: query.get('cloak'),
    seed: options.seed,
  })
}

module.exports.raw = true
