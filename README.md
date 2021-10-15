# font-cloak

Encrypt your data with random fonts.

Mainly based on [font-carrier](https://github.com/purplebamboo/font-carrier).

## Installation

```shell
npm install font-cloak
```

## Usage

```javascript
const { generateFonts } = require('font-cloak')

const newFontBuffer = generateFonts('/path/to/font.ttf', {
  type: 'woff2',
  seed: String(new Date()),
})

const magicString = generateMagicString(seed)
```

After storing the `newFontBuffer` in a suitable file (e.g. `font-cloak.woff2`), the content you wish to encrypt can be encoded with the following runtime function with the `magicString`:

```javascript
const { encode } = require('font-cloak/lib/runtime')

encode('1920*1080', magicString) //
```

### For Webpack

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
        use: [
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

You can then use in your code (with something like [css-loader](https://github.com/webpack-contrib/css-loader)):

```css
@font-face {
  font-family: 'MyFontCloak';
  font-weight: 300;
  src: url('/path/to/font.ttf?cloak=woff2') format('woff2'),
    url('/path/to/font.ttf?cloak=woff') format('woff');
}
```

```javascript
const { encode } = require('font-cloak/lib/runtime')

function encodeFontCloak(text) {
  // eslint-disable-next-line no-undef
  return encode(text, FONT_CLOAK_MAGIC_STRING)
}

const element = document.createElement('p')
element.textContent = encodeFontCloak(MY_DATA)
element.style.fontFamily = 'MyFontCloak'
```

## How It Works

`generateFonts` will shuffle the characters within the font and places them in the [Private Use Areas Unicode block](https://en.wikipedia.org/wiki/Private_Use_Areas) to generate a new font; `generateMagicString` will save the random number information in a hexadecimal string.

**Note**: Given the common use cases, the font mapping contains only the [Basic Latin Unicode block](https://en.wikipedia.org/wiki/Basic_Latin_(Unicode_block)); the runtime functions will also handle the corresponding character set only.
