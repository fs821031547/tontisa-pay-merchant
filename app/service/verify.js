module.exports = app => {
  class Verify extends app.ApiService {
    async userPass(body) {
      const result = await this.apiPost('/user/verifypass', body);
      return result.data.data;
    }
    async phoneCode(body) {
      const result = await this.apiPost('/xxx', body);
      return result.data.data;
    }
    async emailCode(body) {
      const result = await this.apiPost('/xxx', body);
      return result.data.data;
    }
    async phoneCodeSend(body) {
      const { session, app, ip } = this.ctx;
      const key = `sendcode:${ip}`;
      let ipSendCount = await app.redis.get(key);
      ipSendCount = Number(ipSendCount ? ipSendCount : 0);
      if (ipSendCount && ipSendCount > 20) {
        this.ctx.throw(400, `Send phone code fail for ${body}`, {
          code: 'send_phone_code_fail',
        });
      } else {
        if (ipSendCount > 0) {
          await app.redis.set(key, ipSendCount++);
        } else {
          await app.redis.set(key, ipSendCount++, 'EX', 3600 * 24);
        }
      }
      if (session && Object.keys(session).length) {
        const sendedTime = Number(session._sendedTime);
        if (sendedTime && (Date.now() - sendedTime) < 60000) {
          this.ctx.throw(400, `Send phone code fail for ${body}`, {
            code: 'send_phone_code_fail',
          });
          return;
        }
        const result = await this.apiPost('/xxx', body);
        session._sendedTime = Date.now();
        return result.data.data;
      }
      this.ctx.throw(400, `Send phone code fail for ${body}`, {
        code: 'send_phone_code_fail',
      });
    }
    async emailCodeSend(body) {
      const result = await this.apiPost('/xxx', body);
      return result.data.data;
    }
  }
  return Verify;
};
