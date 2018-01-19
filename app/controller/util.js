module.exports = app => {
  class Util extends app.CustomController {
    async uploadToken() {
      const { helper, query } = this.ctx;
      const uptoken = await helper.genUpToken();
      if (query.hasOwnProperty('token')) {
        this.ctx.body = {
          uptoken: uptoken.token,
        };
      }
      this.success(uptoken);
    }
  }
  return Util;
};
