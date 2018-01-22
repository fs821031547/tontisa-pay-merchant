module.exports = app => {
  class Merchant extends app.ApiService {
    userInj(body) {
      if (body) {
        const { session } = this.ctx;
        if (!body.hasOwnProperty('userId')) {
          body.userId = '100001' || session.user.userId;
        }
      }
    }
    async list(body = {}) {
      this.userInj(body);
      const result = await this.apiPost('/merchant/queryList', body);
      return result.data.data;
    }
    async info(body = {}) {
      this.userInj(body);
      const result = await this.apiPost('/merchant/queryDetil', body);
      return result.data.data;
    }
    async storeList(body = {}) {
      this.userInj(body);
      const result = await this.apiPost('/merchant/store/queryList', body);
      return result.data.data;
    }
    async tradeStats(body = {}) {
      this.userInj(body);
      const result = await this.apiPost('/tradeSeq/getTradeSeqCount', body);
      return result.data.data;
    }
    async payTypeStats(body = {}) {
      this.userInj(body);
      const result = await this.apiPost('/tradeSeq/getTradeSeqByPayType', body);
      return result.data.data;
    }
    async trendStats(body = {}) {
      this.userInj(body);
      const result = await this.apiPost('/tradeSeq/getTradeSeqByCycle', body);
      return result.data.data;
    }
    async storeTradeStats(body = {}) {
      this.userInj(body);
      const result = await this.apiPost('/tradeSeq/getTradeSeqByStoreCount', body);
      return result.data.data;
    }
    async tradeList(body = {}) {
      this.userInj(body);
      const result = await this.apiPost('/tradeSeq/query', body);
      return result.data.data;
    }
  }
  return Merchant;
};
