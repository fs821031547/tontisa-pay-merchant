module.exports = app => {
  class User extends app.CustomController {
    get signRule() {
      return {
        cellphone: { type: 'phone', required: false },
        password: { type: 'string', required: false, allowEmpty: true, min: 4, max: 64 },
        phoneVfyCode: { type: 'string', required: false, allowEmpty: true, min: 4, max: 64 },
        email: { type: 'email', required: false, max: 255 },
        longSession: { type: 'boolean', required: false },
        signType: { type: 'enum', required: false, values: [ 0, 1 ] },
      };
    }
    get modifyRule() {
      return {
        headImg: { type: 'url', required: false, min: 12, max: 255 },
        nickname: { type: 'string', required: false, min: 1, max: 64 },
        password: { type: 'string', required: false, min: 4, max: 64 },
        passwordOld: { type: 'string', required: false, allowEmpty: true, min: 4, max: 64 },
        phoneVfyCode: { type: 'string', required: false, allowEmpty: true, min: 4, max: 64 },
        vfyType: { type: 'enum', required: false, values: [ 0, 1 ] },
      };
    }
    get newPassRule() {
      return {
        cellphone: { type: 'phone' },
        password: { type: 'string', min: 4, max: 64 },
        phoneVfyCode: { type: 'string', min: 4, max: 64 },
        longSession: { type: 'boolean', required: false },
      };
    }
    get bindEmailRule() {
      return {
        email: { type: 'email', min: 4, max: 255 },
        emailVfyCode: { type: 'string', min: 4, max: 16 },
      };
    }
    async sign() {
      const { service, request, session } = this.ctx;
      this.success({
        id: '5a65ea3c847b5e25eca191f6',
        cellphone: '15919971145',
        cellphoneIsVerified: 0,
        email: '234@op110.com',
        emailIsVerified: 0,
        nickname: '不学无术修改',
        realname: 'renlei',
        realnameIsVerified: 0,
        sex: 'M',
        birthday: '',
        country: 'China',
        province: 'Guangdong',
        city: 'Shenzhen',
        i18n: 'zh',
        status: 0,
      });
      return;
      this.ctx.validate(this.signRule);
      if (!request.body.cellphone && !request.body.email) {
        this.fail(101015);
        return;
      }
      const username = request.body.cellphone || request.body.email;
      let userInfo;
      if (!request.body.signType && request.body.password) {
        // 密码验证
        try {
          await service.user.verifyPass({
            username,
            password: request.body.password,
          });
        } catch (error) {
          if (error.code === 'api_fail_res' && [ '10017', '10015' ].includes(error.errors.code)) {
            this.fail(101013);
            return;
          }
          throw error;
        }
      } else if (request.body.signType && request.body.phoneVfyCode) {
        const vfyResult = await service.verify.phoneCode({
          phone: request.body.cellphone,
          code: request.body.phoneVfyCode,
        });
        if (!vfyResult) {
          this.fail(101014);
          return; // 手机验证码验证失败
        }
      } else {
        this.fail(101011);
        return;
      }
      try {
        userInfo = await service.user.info({ username });
      } catch (error) {
        if (error.code === 'api_fail_res' && error.errors.code === '10015') {
          this.fail(101012);
          return;
        }
        throw error;
      }
      if (!userInfo) {
        // 返回错误数据，用户验证信息不存在，即未注册
        this.fail(101012);
        return;
      }
      const sessionTime = 1000 * 3600 * 24 * (request.body.longSession ? 5 : 1);
      session.user = userInfo;
      session.maxAge = sessionTime;
      this.success(userInfo);
    }
    async signout() {
      const { session } = this.ctx;
      session.user = null;
      session.maxAge = 1;
      this.success();
    }
    async modifyInfo() {
      const { session, service, request } = this.ctx;
      this.ctx.validate(this.modifyRule);
      const body = request.body;
      const username = session.user.id;
      if (body.password) {
        // 验证校验类型
        if (!body.vfyType) {
          // 默认校验，旧密码校验
          if (!body.passwordOld) {
            this.fail(101021); // 需要旧密码
            return;
          }
          // 验证旧密码
          try {
            await service.user.verifyPass({ username, password: body.passwordOld });
          } catch (error) {
            if (error.code === 'api_fail_res' && error.errors.code === '10015') {
              this.fail(101022);
              return;
            }
            throw error;
          }
        } else {
          if (!body.phoneVfyCode) {
            this.fail(101023); // 需要手机验证码
            return;
          }
          const vfyResult = await service.verify.phoneCode({ phone: session.user.phone, code: body.phoneVfyCode });
          if (!vfyResult) {
            this.fail(101024);
            return; // 手机验证码验证失败
          }
        }
      }
      body.id = session.user.id;
      delete body.phoneVfyCode;
      delete body.passwordOld;
      delete body.vfyType;
      await service.user.modifyInfo(body);
      await this.info();
    }
    async bindEmail() {
      const { session, service, request } = this.ctx;
      this.ctx.validate(this.bindEmailRule);
      const body = request.body;
      const vfyResult = await service.verify.emailCode({ email: body.email, code: body.emailVfyCode });
      if (!vfyResult) {
        this.fail(101031);
        return; // 邮箱验证码验证失败
      }
      body.id = session.user.id;
      delete body.emailVfyCode;
      await service.user.modifyBind(body);
      await this.info();
    }
    async info() {
      const { service, session } = this.ctx;
      // 获取用户信息并保存在会话中
      const userInfo = await service.user.info({ username: session.user.id });
      session.user = userInfo;
      this.success(userInfo);
      this.success(session.user);
    }
    async signWithNewPass() {
      const { service, request, session } = this.ctx;
      this.ctx.validate(this.newPassRule);
      const vfyResult = await service.verify.phoneCode({
        phone: request.body.cellphone,
        code: request.body.phoneVfyCode,
      });
      if (!vfyResult) {
        this.fail(101041);
        return; // 手机验证码验证失败
      }
      const username = request.body.cellphone;
      let userInfo;
      try {
        userInfo = await service.user.info({ username });
      } catch (error) {
        if (error.code === 'api_fail_res' && error.errors.code === '10015') {
          this.fail(101042);
          return;
        }
        throw error;
      }
      if (userInfo) {
        await service.user.modifyInfo({ id: userInfo.id, password: request.body.password });
        // 获取用户信息并保存在会话中
        const sessionTime = 1000 * 3600 * 24 * (request.body.longSession ? 5 : 1);
        session.user = userInfo;
        session.maxAge = sessionTime;
        this.success(userInfo);
      } else {
        this.fail(101042);
      }
    }
  }
  return User;
};
