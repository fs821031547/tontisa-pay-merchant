module.exports = app => {
  class Merchant extends app.CustomController {
    get tradeRule() {
      return {
        merchantId: { type: 'string', required: false },
        payedTimeStart: { type: 'dateTime', required: false },
        payedTimeEnd: { type: 'dateTime', required: false },
        minAmount: { type: 'number', required: false, min: 0 },
        maxAmount: { type: 'number', required: false, min: 0 },
        payType: { type: 'enum', required: false, values: [ '1', '2', '3' ] }, // 1 支付宝 2 微信 3 银联
        status: { type: 'enum', required: false, values: [ '1', '0', '-1' ] }, // 1 付款成功 0 等待付款 -1 付款失败
        pageNo: { type: 'integerStr', required: false, min: 1 },
        pageSize: { type: 'enum', required: false, values: [ '10', '20', '50', '100', '200' ] },
        searchType: { type: 'enum', required: false, values: [ 'seqNo', 'accountNumber', 'createUserName' ] }, // seqNo', 'accountNumber', 'createUserName'
        searchLike: { type: 'string', required: false },
        paytypestats: { type: 'string', required: false, allowEmpty: true },
      };
    }
    async list() {
      // 根据当前登录用户id获取商户数据列表
      const { service } = this.ctx;
      const listData = await service.merchant.list({
        pageNo: 1,
        pageSize: 100,
      });
      let datas = listData.result || [];
      if (datas.length) {
        // 生成id数组减少数据量
        datas = datas.map(v => {
          return {
            id: v.id,
            corpName: v.corpName,
            licenseName: v.licenseName,
          };
        });
      }
      this.success(datas);
    }
    async info() {
      // 根据当前登录用户id获取商户数据列表
      const { service, params, helper } = this.ctx;
      if (helper.idValid(params, 'merchant')) {
        const info = await service.merchant.info({
          merchantId: params.id,
        });
        if (info) {
          this.success(info);
        }
      }
    }
    async storeList() {
      const { service, params, helper, query } = this.ctx;
      if (helper.idValid(params, 'merchant')) {
        const list = await service.merchant.storeList(helper.pageLead({
          merchantId: params.id,
          orderBy: 'is_main_store',
          order: 'desc',
        }, query));
        if (list.lengt) {
          this.success(list);
        } else {
          this.success([]);
        }
      }
    }
    async tradeStats() {
      const { service, params, helper, query } = this.ctx;
      this.ctx.validate(this.tradeRule, query);
      const payedTimeStart = helper.queryDate(query.payedTimeStart);
      const payedTimeEnd = helper.queryDate(query.payedTimeEnd);
      const qbody = {
        payedTimeStart,
        payedTimeEnd,
      };
      if (params.id) {
        if (helper.idValid(params, 'merchant')) {
          qbody.merchantId = params.id;
        } else {
          return;
        }
      }
      const stats = await service.merchant.tradeStats(qbody);
      if (query.hasOwnProperty('paytypestats')) {
        const ptquery = {
          startDate: qbody.payedTimeStart,
          endDate: qbody.payedTimeEnd,
        };
        if (qbody.merchantId) {
          ptquery.merchantId = qbody.merchantId;
        }
        const payTypeStats = await service.merchant.payTypeStats(ptquery);
        if (payTypeStats && stats) {
          stats.payTypeStats = payTypeStats;
        }
      }
      if (stats) {
        this.success(stats);
      }
    }
    async payTypeStats() {
      const { service, params, helper, query } = this.ctx;
      const startDate = helper.queryDate(query.startDate);
      const endDate = helper.queryDate(query.endDate);
      const qbody = {
        startDate,
        endDate,
      };
      if (params.id) {
        if (helper.idValid(params, 'merchant')) {
          qbody.merchantId = params.id;
        } else {
          return;
        }
      }
      const stats = await service.merchant.payTypeStats(qbody);
      if (stats) {
        this.success(stats);
      }
    }
    async trendStats() {
      const { service, params, helper, query } = this.ctx;
      const startDate = helper.queryDate(query.startDate);
      const endDate = helper.queryDate(query.endDate);
      const qbody = {
        startDate,
        endDate,
        cycleType: query.cycleType,
        pageNo: 1,
        pageSize: 50,
      };
      if (params.id) {
        if (helper.idValid(params, 'merchant')) {
          qbody.merchantId = params.id;
        } else {
          return;
        }
      }
      const cycleTypeEnums = [ 'H', 'D', 'M', 'Y' ];
      if (!cycleTypeEnums.includes(qbody.cycleType)) {
        qbody.cycleType = 'D';
      }
      const stats = await service.merchant.trendStats(qbody);
      if (stats) {
        this.success(stats);
      }
    }
    async storeTradeStats() {
      const { service, params, helper, query } = this.ctx;
      if (helper.idValid(params, 'merchant')) {
        // 取参数 payTimeStart 和 payTimeEnd
        const startDate = helper.queryDate(query.startDate);
        const endDate = helper.queryDate(query.endDate);
        const list = await service.merchant.storeTradeStats({
          merchantId: params.id,
          startDate,
          endDate,
        });
        if (list.length) {
          this.success(list);
        } else {
          this.success([]);
        }
      }
    }
    async tradeList() {
      const { service, params, helper, query } = this.ctx;
      if (helper.idValid(params, 'merchant')) {
        this.ctx.validate(this.tradeRule, query);
        query.merchantId = params.id;
        helper.pageLead(query, query);
        if (query.searchType) {
          query[query.searchType] = query.searchLike || '';
          delete query.searchType;
          delete query.searchLike;
        }
        const res = await service.merchant.tradeList(query);
        if (res.result && res.result.length) {
          this.success(res);
        } else {
          this.success({
            result: [],
            pageNo: query.pageNo,
            pageSize: query.pageSize,
            totalCount: 0,
          });
        }
      }
    }
  }
  return Merchant;
};
