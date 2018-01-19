module.exports = app => {
  class User extends app.ApiService {
    async info(body) {
      const result = await this.apiPost('/user/query/detail', body);
      return result.data.data;
    }
    async modifyInfo(body) {
      const result = await this.apiPost('/user/edit/info', body);
      return result.data.data;
    }
    async modifyBind(body) {
      const result = await this.apiPost('/user/edit/bind', body);
      return result.data.data;
    }
  }
  return User;
};
