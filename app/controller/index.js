module.exports = app => {
  class Index extends app.CustomController {
    async index() {
      await this.ctx.render('index.html');
    }
  }
  return Index;
};
