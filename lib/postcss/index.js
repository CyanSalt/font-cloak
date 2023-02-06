const rootProcessor = require('./processor')

const plugin = options => {
  return {
    postcssPlugin: 'font-cloak',
    Once: root => rootProcessor(root, options),
  }
}
plugin.postcss = true

module.exports = plugin
