const path = require('path')
const loaderUtils = require('loader-utils')
const { generateFont } = require('../generate')

module.exports = function loader(content) {
  const options = loaderUtils.getOptions(this)
  const query = new URLSearchParams(this.resourceQuery)
  const type = query.get('cloak')

  const resourcePath = path.parse(this.resourcePath)
  resourcePath.ext = '.' + type
  delete resourcePath.base
  this.resourcePath = path.format(resourcePath)

  return generateFont(content, {
    type,
    seed: options.seed,
  })
}

module.exports.raw = true
