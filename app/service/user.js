module.exports = app => {
  class User extends app.ApiService {
    async info(body) {
      const result = await this.apiPost('/user/info', body);
      return result.data.data;
    }
    async verifyPass(body) {
      const result = await this.apiPost('/user/verifypass', body);
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
    async add(body) {
      const result = await this.apiPost('/user/add', body);
      return result.data.data;
    }
    async notExist(body) {
      const result = await this.apiPost('/user/phone/notexist', body);
      return result.data.data;
    }
  }
  return User;
};
