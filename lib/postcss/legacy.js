const postcss = require('postcss')
const rootProcessor = require('./processor')

const plugin = postcss.plugin('font-cloak', options => {
  return root => rootProcessor(root, options)
})

module.exports = plugin
