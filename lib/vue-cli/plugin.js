const fontCloak = require('font-cloak')
const semver = require('semver')
const { hasInstalledPackage } = require('./utils')

const plugin = (api, options) => {
  const { fontCloakIdentifier } = options.pluginOptions ?? {}
  const isProduction = process.env.NODE_ENV === 'production'
  const isLegacyWebpack = semver.satisfies(api.version, '<=4')
  if (fontCloakIdentifier) {
    /* eslint indent: ['warn', 2, { SwitchCase: 1, MemberExpression: 'off' }] */
    api.chainWebpack(config => {
      const seed = isProduction ? String(new Date()) : 'development'
      const fontsRule = config.module.rule('fonts')
      const cloakRule = fontsRule
        .oneOf('font-cloak')
          .resourceQuery(/cloak/)
      if (isLegacyWebpack) {
        cloakRule
          .use('url')
            .merge(fontsRule.use('url-loader').entries())
            .end()
      }
      if (hasInstalledPackage('cache-loader')) {
        cloakRule
          .use('cache-loader')
            .loader('cache-loader')
            .options(api.genCacheConfig('font-cloak-webpack-loader', {
              'font-cloak': require('font-cloak/package.json').version,
              seed,
            }))
            .end()
      }
      cloakRule
        .use('font-cloak')
          .loader(fontCloak.webpackLoader)
          .options({ seed })
          .end()
        .end()
      if (isLegacyWebpack) {
        fontsRule
          .oneOf('fonts')
            .uses
              .merge(fontsRule.uses.entries())
              .end()
            .end()
          .uses
            .clear()
            .end()
      }
      config.plugin('font-cloak').use(require('webpack').DefinePlugin, [{
        [fontCloakIdentifier]: JSON.stringify(
          fontCloak.generateMagicString(seed),
        ),
      }])
    })
  }
}

module.exports = plugin
