# font-cloak

[![npm](https://img.shields.io/npm/v/font-cloak.svg)](https://www.npmjs.com/package/font-cloak)

Encrypt your data with random fonts.

Mainly based on [font-carrier](https://github.com/purplebamboo/font-carrier).

> [!WARNING]
> Before using this package, make sure you are aware of the relevant legal risks. For example, [SIL 1.1](https://openfontlicense.org/open-font-license-official-text/) prohibits retaining the "Reserved Font Name" after modifying the font; the legal statements of some fonts (such as [Alibaba Puhuiti](https://www.yuque.com/yiguang-wkqc2/puhuiti/nus9wiinq4aeiegy)) do not allow users to modify or reorganize the fonts in the way used by this package.
>
>This package is not responsible for any legal issues arising from font licensing.

## Installation

```shell
npm install font-cloak
```

## Usage

```javascript
const { generateFont } = require('font-cloak')

const newFontBuffer = generateFont('/path/to/font.ttf', {
  type: 'woff2',
  seed: String(new Date()),
})

const magicString = generateMagicString(seed)
```

After storing the `newFontBuffer` in a suitable file (e.g. `font-cloak.woff2`), the content you wish to encrypt can be encoded with the following runtime function with the `magicString`:

```javascript
const { encode } = require('font-cloak/lib/runtime')

encode('1920*1080', magicString)
```

### Integrations with bundlers

Usually we use it like this:

```css
@font-face {
  font-family: 'MyFontCloak';
  font-weight: 300;
  src: url('/path/to/font.ttf?cloak=woff2') format('woff2'),
    url('/path/to/font.ttf?cloak=woff') format('woff');
  /* for webpack@>=5 */
  src: url('/path/to/font.ttf?cloak=.woff2') format('woff2'),
    url('/path/to/font.ttf?cloak=.woff') format('woff');
}
```

```javascript
const { encode } = require('font-cloak/lib/runtime')

// For eslint
// /* global FONT_CLOAK_MAGIC_STRING */
// Or for typescript
// declare const FONT_CLOAK_MAGIC_STRING: string

function encodeFontCloak(text) {
  return encode(text, FONT_CLOAK_MAGIC_STRING)
}

const element = document.createElement('p')
element.textContent = encodeFontCloak(MY_DATA)
element.style.fontFamily = 'MyFontCloak'
```

To achieve these results, we can configure the bundler as:

- Webpack: See [Webpack](./lib/webpack)
  - Vue CLI: See [Vue CLI](./lib/vue-cli)
- Rollup, Vite, etc.: See [PostCSS](./lib/postcss)

## How it works

`generateFont` will shuffle the characters within the font and places them in the [Private Use Areas Unicode block](https://en.wikipedia.org/wiki/Private_Use_Areas) to generate a new font; `generateMagicString` will save the random number information in a hexadecimal string.

**Note**: Given the common use cases, the font mapping contains only the [Basic Latin Unicode block](https://en.wikipedia.org/wiki/Basic_Latin_(Unicode_block)); the runtime functions will also handle the corresponding character set only.
