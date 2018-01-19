module.exports = app => {
  class Pay extends app.ApiService {
    async scanpay(query) {
      const result = await this.apiPost('/scanpay', query);
      return result.data.data;
    }
    async prePayInfo(query) {
      const result = await this.apiPost('/getTradeKey', query);
      return result.data.data;
    }
    async genKey(query) {
      const result = await this.apiPost('/trade/add', query);
      return result.data.data;
    }
  }
  return Pay;
};
