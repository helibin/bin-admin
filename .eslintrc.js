/*
 * @Author: helibin@139.com
 * @Date: 2019-07-18 10:50:25
 * @Last Modified by: lybeen
 * @Last Modified time: 2019-07-23 09:18:07
 */
module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
  },
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  globals: {},
  extends: ['plugin:vue/essential', 'plugin:prettier/recommended', 'eslint:recommended'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
        bracketSpacing: true,
        jsxBracketSameLine: true,
      },
    ],
  },
}
// https://eslint.org/docs/rules/
