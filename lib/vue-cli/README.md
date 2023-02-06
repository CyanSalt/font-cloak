# Integration with Vue CLI

When you use Vue CLI, you can usually configure it in a simple way as follows:

```jsonc
{
  // package.json
  "vuePlugins": {
    "service": [
      "node_modules/font-cloak/lib/vue-cli"
    ]
  }
}
```

```js
// vue.config.js
module.exports = {
  pluginOptions: {
    fontCloakIdentifier: 'FONT_CLOAK_MAGIC_STRING',
  },
}
```
