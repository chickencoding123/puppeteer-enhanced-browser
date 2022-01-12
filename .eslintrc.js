module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: [
    'standard',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 13
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    'space-before-function-paren': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off'
  }
}
