module.exports = {
  validate(rules, data, opt) {
    data = data || this.request.body;
    const errors = this.app.validator.validate(rules, data, opt);
    if (errors) {
      this.throw(422, 'Validation Failed', {
        code: 'invalid_param',
        errors,
      });
    }
  },
};
