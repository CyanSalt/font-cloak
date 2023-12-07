module.exports = {
  extends: [
    '@cyansalt/preset',
  ],
  ignorePatterns: [
    '**/*.d.ts',
  ],
  rules: {
    'unicorn/prefer-node-protocol': 'off',
  },
}
