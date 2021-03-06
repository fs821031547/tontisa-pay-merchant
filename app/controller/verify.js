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
      const { service, request } = this.ctx;
      this.ctx.validate(this.phoneCodeRule);
      console.log('request.body.cellphone:', request.body.cellphone);
      console.log('request.body.phoneVfyCode:', request.body.phoneVfyCode);
      // await service.verify.phoneCodeSend();
      const vfyResult = await service.verify.phoneCode({
        phone: request.body.cellphone,
        code: request.body.phoneVfyCode,
      });
      if (vfyResult) {
        this.success();
      } else {
        this.fail(102011);
      }
    }
    async phoneSend() {
      const { service, query } = this.ctx;
      this.ctx.validate(this.phoneSendRule, query);
      // await service.verify.phoneCodeSend({ phone: query.cellphone });
      try {
        await service.verify.phoneCodeSend({ phone: query.cellphone });
        this.success();
      } catch (error) {
        if (
          error.code === 'api_fail_res' &&
          [ '110000' ].includes(error.errors.status)
        ) {
          this.success(error.errors);
          return;
        }
      }
      // this.success();
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
