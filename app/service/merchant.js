module.exports = app => {
  const appHost = app.config.merchantConfig.appHost;
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
      const result = await this.apiPost(appHost + '/merchant/queryList', body);
      return result.data.data;
    }
    async info(body = {}) {
      this.userInj(body);
      const result = await this.apiPost(appHost + '/merchant/queryDetil', body);
      return result.data.data;
    }
    async storeList(body = {}) {
      this.userInj(body);
      const result = await this.apiPost(appHost + '/merchant/store/queryList', body);
      return result.data.data;
    }
    async tradeStats(body = {}) {
      this.userInj(body);
      const result = await this.apiPost(appHost + '/tradeSeq/getTradeSeqCount', body);
      return result.data.data;
    }
    async payTypeStats(body = {}) {
      this.userInj(body);
      const result = await this.apiPost(appHost + '/tradeSeq/getTradeSeqByPayType', body);
      return result.data.data;
    }
    async trendStats(body = {}) {
      this.userInj(body);
      const result = await this.apiPost(appHost + '/tradeSeq/getTradeSeqByCycle', body);
      return result.data.data;
    }
    async storeTradeStats(body = {}) {
      this.userInj(body);
      const result = await this.apiPost(
        appHost + '/tradeSeq/getTradeSeqByStoreCount',
        body
      );
      return result.data.data;
    }
    async tradeList(body = {}) {
      this.userInj(body);
      const result = await this.apiPost(appHost + '/tradeSeq/query', body);
      return result.data.data;
    }
  }
  return Merchant;
};
