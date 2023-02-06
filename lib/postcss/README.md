# Integration with PostCSS

When you use PostCSS, you can usually configure it in a simple way as follows:

```js
// postcss.config.js
const fontCloak = require('font-cloak')

module.exports = {
  plugins: {
    [fontCloak.postcssPlugin]: {
      rootDir: __dirname, // If omitted, files will be generated to the `.font-cloak` directory
      seed: process.env.FONT_CLOAK_SEED,
    },
  },
}
```

```js
// vite.config.js (for example)
export default async ({ mode }) => {
  const isProduction = process.env.NODE_ENV === 'production'
  const FONT_CLOAK_SEED = isProduction ? String(new Date()) : 'development'
  // For postcss
  process.env.FONT_CLOAK_SEED = FONT_CLOAK_SEED;
  return {
    define: {
      // For runtime
      FONT_CLOAK_MAGIC_STRING: JSON.stringify(
        fontCloak.generateMagicString(FONT_CLOAK_SEED),
      ),
    }
  }
}
