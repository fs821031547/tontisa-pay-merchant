// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: false,
  extends: 'eslint-config-egg',
  // add your custom rules here
  'rules': {
    'generator-star-spacing': 'off',
    'babel/generator-star-spacing': 'off',
    'strict': 'off',
  },
  'globals': {
    'app': true,
    'request': true,
    'mm': true,
    'mock': true,
    'assert': true,
  },
  'parser': 'babel-eslint',
}
