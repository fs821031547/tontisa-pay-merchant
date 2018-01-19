import router from '../router';

// 商铺默认数据
function merchantInfoDefault () {
  return {
    licenseCode: '', // 营业执照号
    licenseName: '', // 营业执照名
    licenseAdrress: '', // 营业执照地址
    licenseValidity: '', // 营业执照有效期
    corpName: '', // 法人姓名
    corpId: '', // 法人身份证
    corpIdValidity: '', // 法人有效期
    payStoreList: [{
      isPersonal: -1, // 结算标志
      account: '', // 结算账户
      accountName: '', // 户名
      bankCode: '', // 开户行号
      accountIdNumer: '', // 结算人身份证号
      accountIdValidity: '', // 结算人身份证有效期
      posName: '', // 商户名称
      address: '', // 商户地址
      mccSupNameMCC: '', // 商户类型 大类名称
      mccTypeNameMCC: '', // 商户类型 小类名称
      mccCode: '', // 商户类型 商户类型MCC码
      mccName: '', // 商户类型
      provinceName: '', // 地区码 省份
      cityName: '', // 地区码 城市
      areaName: '', // 地区码 地区
    }],
  };
}

// 商铺门店列表默认数据
function merchantStoresDefault () {
  return [{
    isPersonal: 0, // 结算标志
    account: '', // 结算账户
    accountName: '', // 户名
    bankCode: '', // 开户行号
    accountIdNumer: '', // 结算人身份证号
    accountIdValidity: '', // 结算人身份证有效期
    posName: '', // 商户名称
    address: '', // 商户地址
    mccSupNameMCC: '', // 商户类型 大类名称
    mccTypeNameMCC: '', // 商户类型 小类名称
    mccCode: '', // 商户类型 商户类型MCC码
    mccName: '', // 商户类型
    provinceName: '', // 地区码 省份
    cityName: '', // 地区码 城市
    areaName: '', // 地区码 地区
  }];
}

// 商户下所有门店的交易统计
function merchantStoresTradeStatsDefault () {
  return [
    // {
    //   contactName: '', // 联系人姓名
    //   isMainStore: '', // 是否主门店 0 - 不是，1-是
    //   merchantId: '', // 商户Id
    //   posName: '', // 门店名
    //   storeId: '', // 门店Id
    //   totalAmount: '', // 门店总交易额
    // },
  ];
}

function merchantTradeStatsDefault () {
  return {
    amountAvg: 0, // 日均交易金额
    countAvg: 0, // 日均交易量
    merchantId: '', // 商户Id
    totalAmount: 0, // 总交易金额
    totalCount: 0, // 总交易量
    payTypeStats: [
      {
        amountProportion: 0, // 交易方式交易金额占比
        countProportion: 0, // 交易方式交易量占比
        payType: '1', // 交易方式 1, 支付宝 2, 微信 3, 银联
        typeAmount: 0, // 交易方式的交易金额
        typeCount: 0, // 交易方式的交易量
        fake: true,
      },
      {
        amountProportion: 0,
        countProportion: 0,
        payType: '2',
        typeAmount: 0,
        typeCount: 0,
        fake: true,
      },
      {
        amountProportion: 0,
        countProportion: 0,
        payType: '3',
        typeAmount: 0,
        typeCount: 0,
        fake: true,
      },
    ],
  };
}

function merchantTradeListDefault () {
  return [
    // {
    //   accountNumber: '-', // 收款账户
    //   appStoreName: '-', // 部门名
    //   createTime: '-', // 创建时间
    //   createUserId: '-', // 创建人Id
    //   createUserName: '-', // 创建人
    //   feeAmount: 0, // 手续费单位分
    //   id: '-', // 流水编号
    //   maxAmount: 0,
    //   merchantId: '-', // 商户Id
    //   minAmount: 0,
    //   orderNo: '-', // 支付渠道订单号
    //   payNo: '-', // 最终支付订单号(可用于退款)
    //   payTime: '-', // 发起支付时间
    //   payType: 0, // 支付方式
    //   payedTime: '-', // 完成支付时间
    //   posName: '-', // 门店名
    //   seqNo: '-', // 平台交易流水号
    //   status: 0, // 支付状态 0-等待支付,1-支付成功, -1-支付失败
    //   storeId: '-', // 门店Id
    //   storeName: '-',
    //   termNo: '-', // 设备号
    //   totalAmount: 0, // 订单总金额
    // },
  ];
}

const module = {
  state: {
    merchant: '',
    merchants: [],
    merchantsMap: {},
    merchantsInfoMap: {},
    merchantStoresMap: {},
    merchantStoresTradeStatsMap: {},
    merchantTradeStatsMap: {},
    user: null,
    userRules: {
      email: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' },
      ],
      cellphone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        {
          validator (rule, value, callback) {
            if (!/^(\+?0?86\-?)?1[345789]\d{9}$/.test(value)) {
              callback(new Error('请输入正确的手机号'));
            } else {
              callback();
            }
          },
          trigger: 'blur,change',
        },
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能小于 6 个字符', trigger: 'blur,change' },
        { max: 32, message: '密码长度不能大于 32 个字符', trigger: 'blur,change' },
      ],
      passwordOld: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能小于 6 个字符', trigger: 'blur,change' },
        { max: 32, message: '密码长度不能大于 32 个字符', trigger: 'blur,change' },
      ],
      phoneVfyCode: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
        { min: 8, max: 8, message: '验证码长度不正确', trigger: 'blur,change' },
      ],
      emailVfyCode: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
        { min: 8, max: 8, message: '验证码长度不正确', trigger: 'blur,change' },
      ],
    },
  },
  getters: {
    merchantInfoDefault: state => merchantInfoDefault(),
    merchantStoresDefault: state => merchantStoresDefault(),
    merchantStoresTradeStatsDefault: state => merchantStoresTradeStatsDefault(),
    merchantTradeStatsDefault: state => merchantTradeStatsDefault(),
    merchantTradeListDefault: state => merchantTradeListDefault(),
  },
  actions: {
    merchantChoice ({ state, dispatch }, { menu, merchant }) {
      const vm = this._vm;
      return new Promise((resolve, reject) => {
        if (merchant && state.merchants.length) {
          if (!state.merchantsMap[merchant.id]) {
            merchant = state.merchants[0];
          } else {
            merchant = state.merchantsMap[merchant.id];
          }
          state.merchant = merchant;
          if (menu) {
            dispatch('menuJump', menu).then(resolve);
          } else {
            resolve();
          }
        } else {
          // 请求网络并设置值
          if (state.merchants.length) {
            for (const i in state.merchants) {
              const merchant = state.merchants[i];
              state.merchantsMap[merchant.id] = merchant;
            }
            let curMerchant = state.merchants[0];
            if (merchant && merchant.id && state.merchantsMap[merchant.id]) {
              curMerchant = state.merchantsMap[merchant.id];
            }
            state.merchant = curMerchant;
            resolve();
            return;
          } else {
            vm.$http.get('/api/merchant/list').then(res => {
              if (vm.$util.resJudge(res)) {
                state.merchants = res.data.data;
                for (const i in state.merchants) {
                  const merchant = state.merchants[i];
                  state.merchantsMap[merchant.id] = merchant;
                }
                let curMerchant = state.merchants[0];
                if (merchant && merchant.id && state.merchantsMap[merchant.id]) {
                  curMerchant = state.merchantsMap[merchant.id];
                }
                state.merchant = curMerchant;
              }
            }).then(resolve);
          }
        }
      });
    },
    merchantInfo ({ state, dispatch }, id) {
      const vm = this._vm;
      return new Promise((resolve, reject) => {
        if (state.merchantsInfoMap[id]) {
          resolve(state.merchantsInfoMap[id]);
          return;
        }
        vm.$http.get(`/api/merchant/${id}/info`).then(res => {
          if (vm.$util.resJudge(res)) {
            state.merchantsInfoMap[id] = res.data.data;
          }
          resolve(state.merchantsInfoMap[id]);
          return;
        });
      });
    },
    merchantStoreList ({ state, dispatch }, query) {
      const id = query.merchantId;
      const vm = this._vm;
      return new Promise((resolve, reject) => {
        if (state.merchantStoresMap[id]) {
          resolve(state.merchantStoresMap[id]);
          return;
        }
        vm.$http.get(`/api/merchant/${id}/store/list`, { params: query }).then(res => {
          if (vm.$util.resJudge(res)) {
            state.merchantStoresMap[id] = res.data.data;
          }
          resolve(state.merchantStoresMap[id]);
          return;
        });
      });
    },
    merchantTradeStats ({ state, dispatch }, query) {
      let id = query.merchantId;
      const vm = this._vm;
      if (!id) {
        id = '';
      }
      let url = `/api/merchant/${id}/trade/stats`;
      url = url.replace('//', '/');
      return vm.$http.get(url, { params: query }).then(res => {
        if (vm.$util.resJudge(res)) {
          const data = res.data.data;
          if (!data.payTypeStats || data.payTypeStats.length <= 0) {
            data.payTypeStats = merchantTradeStatsDefault().payTypeStats;
          }
          return data;
        }
      });
    },
    merchantTrendStats ({ state, dispatch }, query) {
      let id = query.merchantId;
      const vm = this._vm;
      if (!id) {
        id = '';
      }
      let url = `/api/merchant/${id}/trend/stats`;
      url = url.replace('//', '/');
      return vm.$http.get(url, { params: query }).then(res => {
        if (vm.$util.resJudge(res)) {
          return res.data.data;
        }
      });
    },
    merchantStoresTradeStatsList ({ state, dispatch }, query) {
      const id = query.merchantId;
      const vm = this._vm;
      return vm.$http.get(`/api/merchant/${id}/store/trade/stats`, { params: query }).then(res => {
        if (vm.$util.resJudge(res)) {
          return res.data.data.result || [];
        }
      });
    },
    merchantTradeList ({ state, dispatch }, query) {
      const id = query.merchantId;
      const vm = this._vm;
      return vm.$http.get(`/api/merchant/${id}/trade/list`, { params: query }).then(res => {
        if (vm.$util.resJudge(res)) {
          return res.data.data;
        }
      });
    },
    merchantName ({ state, dispatch }, id) {
      if (state.merchantsMap[id]) {
        return state.merchantsMap[id].licenseName;
      }
    },
    routerParams ({ state, dispatch }, { name }) {
      if (name.indexOf('merchant') === 0) {
        if (state.merchant) {
          return { id: state.merchant.id };
        } else {
          return dispatch('merchantChoice').then(() => {
            return { id: state.merchant.id };
          });
        }
      } else {
        return {};
      }
    },
    userSign ({ state }, data) {
      return this._vm.$http.post('/api/user/sign', data).then(res => {
        if (this._vm.$util.resJudge(res)) {
          state.user = res.data.data;
        }
      });
    },
    userSignWithNewPass ({ state }, data) {
      return this._vm.$http.post('/api/user/sign/newpass', data).then(res => {
        if (this._vm.$util.resJudge(res)) {
          state.user = res.data.data;
        }
      });
    },
    userSignout ({ state }, data) {
      return this._vm.$http.get('/api/user/signout').then(res => {
        state.user = null;
        router.push({ name: 'sign' });
      });
    },
    userInfoModify ({ state }, data) {
      return this._vm.$http.put('/api/user/info', data).then(res => {
        if (this._vm.$util.resJudge(res)) {
          state.user = res.data.data;
        }
      });
    },
    userBindEmail ({ state }, data) {
      return this._vm.$http.put('/api/user/bind/email', data).then(res => {
        if (this._vm.$util.resJudge(res)) {
          state.user = res.data.data;
        }
      });
    },
    userInfo ({ state }, data) {
      return this._vm.$http.get('/api/user/info', data).then(res => {
        if (this._vm.$util.resJudge(res)) {
          state.user = res.data.data;
        }
      });
    },
    phoneCodeVerify ({ state }, data) {
      return this._vm.$http.put('/api/verify/phone/code', data);
    },
    phoneCodeSend ({ state }, data) {
      return this._vm.$http.get('/api/verify/phone/send', { params: data });
    },
    emailCodeSend ({ state }, data) {
      return this._vm.$http.get('/api/verify/email/send', { params: data });
    },
    uploadToken ({ state }, data) {
      return this._vm.$http.get('/api/util/uptoken', { params: data }).then(res => {
        return res.data.data;
      });
    },
  },
};

export default module;
