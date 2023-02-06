# Integration with Webpack

When you use webpack, you can usually configure it in a simple way as follows:

```javascript
const fontCloak = require('font-cloak')
const webpack = require('webpack')

const FONT_CLOAK_SEED = String(new Date())

// webpack.config.js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.ttf$/i,
        resourceQuery: /cloak/,
        type: 'asset',
        generator: {
          filename: '[name].[hash:8][ext]', // for example
        },
        use: [
          {
            loader: fontCloak.webpackLoader,
            options: {
              seed: FONT_CLOAK_SEED,
            },
          },
        ],
      },
      // for webpack@<=4
      {
        test: /\.ttf$/i,
        resourceQuery: /cloak/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash:8].[ext]', // for example
            },
          },
          {
            loader: fontCloak.webpackLoader,
            options: {
              seed: FONT_CLOAK_SEED,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      FONT_CLOAK_MAGIC_STRING: JSON.stringify(
        fontCloak.generateMagicString(FONT_CLOAK_SEED),
      ),
    }),
  ],
}
```
