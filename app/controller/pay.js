module.exports = app => {
  class Pay extends app.CustomController {
    isWx() {
      const { headers } = this.ctx;
      return headers['user-agent'].includes('MicroMessenger');
    }
    isAli() {
      const { headers } = this.ctx;
      return headers['user-agent'].includes('AlipayClient');
    }
    qrCode(url = '', size = 200) {
      let qstr = `https://pan.baidu.com/share/qrcode?w=${size}&h=${size}`;
      if (url) {
        qstr = qstr += `&url=${encodeURIComponent(url)}`;
      }
      return qstr;
    }
    async viewBlank() {
      const rdata = {
        isSuccess: true,
        msg: '欢迎使用「小强扫码付」',
        desc: '<br><i>powered by TONTISA</i>',
      };
      await this.ctx.render('trade-present', rdata);
    }
    async pcFail() {
      const rdata = {
        isSuccess: false,
        msg: '商户不存在',
        desc: '请检查交易信息是否正常<br><br>「小强扫码付」',
      };
      await this.ctx.render('trade-present', rdata);
    }
    async mbFail() {
      let closeJs;
      let mbMsg = '未知错误';
      let mbDesc = '';
      if (this.isWx()) {
        mbMsg = '请用支付宝扫描';
        mbDesc = '请打开支付宝「扫一扫」扫描二维码';
        closeJs = "WeixinJSBridge.call('closeWindow');";
      } else if (this.isAli()) {
        mbMsg = '收单系统错误';
        mbDesc = '无法生成支付订单，请稍候再试';
        closeJs = "AlipayJSBridge.call('closeWebview');";
      } else {
        closeJs = 'window.close();';
      }
      const rdata = {
        mbType: 'warn',
        mbMsg,
        mbDesc,
        mbShowBtn: '',
        mbBtnTxt: '关闭',
        mbJsClose: closeJs,
      };
      await this.ctx.render('trade-present.m', rdata);
    }
    async viewShow() {
      const { params, protocol, host, service } = this.ctx;
      const key = params.key;
      if (!/^[0-9a-f]{32}$/.test(key)) {
        await this.pcFail();
        return;
      }
      const isWx = true;
      const isZfb = false;
      const prefix = protocol + '://' + host;
      let attach;
      try {
        attach = await service.pay.prePayInfo({ tradeKey: key });
        if (attach && attach.attach) {
          attach.attach = JSON.parse(attach.attach);
        }
      } catch (error) {
        await this.pcFail();
        return;
      }
      if (!attach) {
        await this.pcFail();
        return;
      }
      const rdata = {
        tradeKey: key,
        moneyTitle: '付款金额',
        hasMoney: attach.amount ? '' : ' hide',
        hasMoneyShow: '',
        money: attach.amount / 100,
        btnBgColor: isWx ? '#009900' : '#35a4f3',
        canPay: isWx || isZfb ? '' : ' hide',
        cantPay: isWx || isZfb ? ' hide' : '',
        fullWidth: isWx || isZfb ? '100%' : '550px',
        infoAction: prefix + '/trade/preview/' + key,
        formAction: prefix + '/scanpay',
        scanAction: prefix + '/trade/scan',
        btnName: '支付',
        qrCodePrefix: this.qrCode('', 200),
        qrCode: this.qrCode(prefix + '/trade/pay/' + key, 200),
        infoQrCode: this.qrCode(prefix + '/trade/preview/' + key, 240),
        merchantName: attach.scanName,
        employeeName:
          attach.attach && attach.attach.employeeName
            ? attach.attach.employeeName
            : '',
        hasEmployeeName:
          attach.attach && attach.attach.employeeName ? '' : ' hide',
        orderId: attach.selOrderNo,
        hasOrderId: attach.selOrderNo ? '' : ' hide',
        remark: attach.subject,
        hasRemark: attach.subject ? '' : ' hide',
        hasRemarks: attach.selOrderNo || attach.subject ? '' : ' hide',
        details: attach.details ? attach.details : '[]',
      };
      await this.ctx.render('trade-preview', rdata);
    }
    async pay() {
      const { params, service } = this.ctx;
      if (!/^[0-9a-f]{32}$/.test(params.key) || !this.isAli()) {
        await this.mbFail();
        return;
      }
      let fail = false;
      let res;
      try {
        res = await service.pay.scanpay({ key: params.key });
      } catch (error) {
        fail = true;
      }
      if (!res || !res.payCode) {
        fail = true;
      }
      if (fail) {
        await this.mbFail();
        return;
      }
      // 重定向到支付宝支付页面
      this.ctx.redirect(res.payCode);
    }
    async genPay() {
      const { service, request } = this.ctx;
      // 生成支付数据
      const key = request.body.key;
      const payChannel = request.body.payChannel;
      if (
        !key ||
        !/^[0-9a-f]{32}$/.test(key) ||
        ![ 'ALIPAY', 'WXPAY', 'YLPAY' ].includes(payChannel)
      ) {
        this.ctx.body = {
          executeStatus: '1',
          errorCode: '00000',
          errorMsg: '参数错误',
        };
      }
      let res;
      try {
        res = await service.pay.scanpay({
          key,
          payChannel,
        });
      } catch (error) {
        const data = error.errors;
        this.ctx.body = {
          executeStatus: '1',
          errorCode: data.code,
          errorMsg: data.message,
        };
        return;
      }
      if (res && res.payCode) {
        this.ctx.body = { values: res, executeStatus: '0' };
      } else {
        this.ctx.body = {
          executeStatus: '1',
          errorCode: '00000',
          errorMsg: '未知错误',
        };
      }
    }
    async genKey() {
      const { request, service } = this.ctx;
      try {
        const values = await service.pay.genKey(request.body);
        this.ctx.body = {
          values,
          executeStatus: '0',
        };
      } catch (error) {
        this.ctx.body = {
          executeStatus: '1',
          errorCode: '00000',
          errorMsg: '未知错误',
        };
      }
    }
  }
  return Pay;
};
