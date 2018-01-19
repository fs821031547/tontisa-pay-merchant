const Captcha = require('./lib/captcha.js');

module.exports = app => {
  app.captcha = new Captcha();
};
