module.exports = app => {
  // app.router.opts.prefix = '/'; // 为所有路由设置前缀
  const userSession = app.middlewares.userSession();
  app.get('/', 'index.index'); // 登录

  app.post('/api/user/sign', 'user.sign'); // 登录
  app.post('/api/user/sign/newpass', 'user.signWithNewPass'); // 修改密码并登录
  app.get('/api/user/signout', 'user.signout'); // 退出
  app.get('/api/user/info', userSession, 'user.info'); // 获取用户信息
  app.put('/api/user/info', userSession, 'user.modifyInfo'); // 修改用户信息
  app.put('/api/user/bind/email', userSession, 'user.bindEmail'); // 绑定用户邮箱

  app.get('/api/merchant/list', userSession, 'merchant.list'); // 用户对应的商户列表
  app.get('/api/merchant/trade/stats', userSession, 'merchant.tradeStats'); // 用户总的交易统计
  app.get('/api/merchant/:id/trade/stats', userSession, 'merchant.tradeStats'); // 用户某商户的交易统计
  app.get('/api/merchant/paytype/stats', userSession, 'merchant.payTypeStats'); // 用户总的支付方式统计
  app.get('/api/merchant/:id/paytype/stats', userSession, 'merchant.payTypeStats'); // 用户某商户的支付方式统计
  app.get('/api/merchant/trend/stats', userSession, 'merchant.trendStats'); // 用户总的交易趋势统计
  app.get('/api/merchant/:id/trend/stats', userSession, 'merchant.trendStats'); // 用户某商户的交易趋势统计
  app.get('/api/merchant/:id/info', userSession, 'merchant.info'); // 获取用户下对应的某商户信息
  app.get('/api/merchant/:id/trade/list', userSession, 'merchant.tradeList'); // 获取商户下所有交易的列表数据
  app.get('/api/merchant/:id/store/list', userSession, 'merchant.storeList'); // 获取用户下对应的某商户信息
  app.get('/api/merchant/:id/store/trade/stats', userSession, 'merchant.storeTradeStats'); // 获取用户下对应的所有门店的交易统计

  app.get('/api/verify/phone/send', 'verify.phoneSend'); // 发送手机验证码
  app.put('/api/verify/phone/code', 'verify.phoneCode'); // 验证手机验证码
  app.get('/api/verify/email/send', userSession, 'verify.emailSend'); // 发送邮箱验证码

  app.get('/api/util/uptoken', 'util.uploadToken'); // 获取图片上传token

  app.get('/newpay/trade/preview', 'pay.viewBlank'); // 支付预览页面
  app.get('/newpay/trade/preview/:key', 'pay.viewShow'); // 支付预览二维码页面
  app.get('/newpay/trade/pay/:key', 'pay.pay'); // 目前就阿里支付使用这个链接，将用户重定向到阿里支付
  app.post('/newpay/scanpay', 'pay.genPay'); // 生成可用于生成交易二维码的数据
  app.post('/newpay/key', 'pay.genKey'); // 生成交易用key数据
};
