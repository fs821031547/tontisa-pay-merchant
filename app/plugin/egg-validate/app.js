const Parameter = require('./lib/parameter');

module.exports = app => {
  app.validator = new Parameter();
};
