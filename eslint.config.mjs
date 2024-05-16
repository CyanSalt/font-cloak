import config from '@cyansalt/eslint-config'

export default config({
  configs: [
    {
      rules: {
        'unicorn/prefer-node-protocol': 'off',
      },
    },
  ],
})
