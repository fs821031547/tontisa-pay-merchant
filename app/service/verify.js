module.exports = app => {
  class Verify extends app.ApiService {
    codeCheck(from, code, type) {
      const sessionKey = {
        phone: '_phoneCodeSended',
        email: '_emailCodeSended',
      }[type];
      const { session } = this.ctx;
      // 验证手机验证码
      if (session[sessionKey]) {
        const sended = session[sessionKey];
        const sendedTime = Number(sended.sendedTime);
        if (sendedTime && Date.now() - sendedTime > 1800000) {
          // 大于30分钟则验证失败
          return;
        }
        if (sended.sendTo !== from + '' || sended.code !== code + '') {
          return;
        }
        session[sessionKey] = null;
        return {
          // 验证成功
          success: true,
        };
      }
    }
    async phoneCode({ phone, code }) {
      // 验证手机验证码
      return this.codeCheck(phone, code, 'phone');
    }
    async emailCode({ email, code }) {
      // 验证邮箱验证码
      return this.codeCheck(email, code, 'email');
    }
    async sendCodeControl(
      sendTo,
      type = 'phone',
      sendBeforeCallBack = function() {}
    ) {
      const option = {
        phone: {
          redisPreKey: 'phonecode',
          sessionKey: '_phoneCodeSended',
          apiUrl: '/sms/sendtext',
        },
        email: {
          redisPreKey: 'emailcode',
          sessionKey: '_emailCodeSended',
          apiUrl: '/mail/send',
        },
      }[type];
      if (!sendTo) {
        this.ctx.throw(500, `Send ${type} code fail for ${sendTo}`, {
          code: 'send_code_fail',
        });
      }
      const { session, app, ip } = this.ctx;
      const key = `send:${option.redisPreKey}:${ip}`;
      let ipSendCount = await app.redis.get(key);
      ipSendCount = Number(ipSendCount ? ipSendCount : 0);
      if (ipSendCount && ipSendCount > 20) {
        // 同一个ip下发送次数大于20次则不再发送
        this.ctx.throw(400, `Send ${type} code fail for ${sendTo}`, {
          code: 'send_code_fail',
        });
      } else {
        if (ipSendCount > 0) {
          await app.redis.set(key, ipSendCount++);
        } else {
          // ip记录时长为1天
          await app.redis.set(key, ipSendCount++, 'EX', 3600 * 24);
        }
      }
      if (session && Object.keys(session).length) {
        if (session[option.sessionKey]) {
          const sendedTime = Number(session[option.sessionKey].sendedTime);
          if (sendedTime && Date.now() - sendedTime < 60000) {
            // 60分钟以内不再发送
            this.ctx.throw(400, `Send ${type} code fail for ${sendTo}`, {
              code: 'send_code_fail',
            });
          }
        }
        const sendBody = sendBeforeCallBack();
        const result = await this.apiPost(
          app.config.pubSerConfig.appHost + option.apiUrl,
          sendBody,
          { contentType: 'json' }
        );
        session[option.sessionKey] = {
          sendedTime: Date.now(),
          sendTo,
          code: sendBody.code,
        };
        return result;
      }
      this.ctx.throw(400, `Send ${type} code fail for ${sendTo}`, {
        code: 'send_code_fail',
      });
    }
    async phoneCodeSend({ phone }) {
      const result = await this.sendCodeControl(phone, 'phone', () => {
        const randomNum = this.ctx.helper.randomStr(4, 'num');
        const content = `【小强支付系统】您的验证码为${randomNum}，30分钟内有效，切勿向任何人泄露。`;
        const sendBody = {
          receiver: phone,
          content,
          code: randomNum,
        };
        return sendBody;
      });
      return result.data.data;
    }
    async emailCodeSend({ email }) {
      const result = await this.sendCodeControl(email, 'email', () => {
        const randomNum = this.ctx.helper.randomStr(4, 'strnum');
        const content = `【小强支付系统】您的邮箱验证码为${randomNum}，30分钟内有效，切勿向任何人泄露。`;
        const sendBody = {
          receiver: email,
          content,
          subject: '小强支付系统绑定邮箱',
          code: randomNum,
        };
        return sendBody;
      });
      return result.data.data;
    }
  }
  return Verify;
};
