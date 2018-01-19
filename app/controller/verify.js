module.exports = app => {
  class Verify extends app.CustomController {
    get phoneCodeRule() {
      return {
        cellphone: { type: 'phone' },
        phoneVfyCode: { type: 'string', min: 4, max: 64 },
      };
    }
    get phoneSendRule() {
      return {
        cellphone: { type: 'phone' },
      };
    }
    get emailSendRule() {
      return {
        email: { type: 'email', min: 4, max: 255 },
      };
    }
    async phoneCode() {
      const { service } = this.ctx;
      this.ctx.validate(this.phoneCodeRule);
      await service.verify.phoneCodeSend();
      const vfyResult = await service.verify.phoneCode({ phone: request.body.cellphone, code: request.body.phoneVfyCode });
      if (vfyResult) {
        this.success();
      } else {
        this.fail(102011);
      }
    }
    async phoneSend() {
      const { service, query } = this.ctx;
      this.ctx.validate(this.phoneSendRule, query);
      await service.verify.phoneCodeSend();
      this.success();
    }
    async emailSend() {
      const { service, query } = this.ctx;
      this.ctx.validate(this.emailSendRule, query);
      await service.verify.emailCodeSend();
      this.success();
    }
  }
  return Verify;
};
