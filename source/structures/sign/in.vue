<template>
  <!-- 登录结构 -->
  <el-card class="struct-sign-in">
    <div slot="header" class="sign-header">
      <span>登录</span>
      <!-- <span class="goto">
        还没有账号，
        <el-button type="text" @click="gotoSignUp">前往注册</el-button>
      </span> -->
    </div>
    <div v-show="mode === 1" class="sign-bodyer">
      <el-form v-show="signInMode === 0" ref="passwordSign" :model="signData">
        <el-form-item :rules="rules.cellphone" prop="cellphone">
          <el-input placeholder="请输入手机号" v-model="signData.cellphone"></el-input>
        </el-form-item>
        <el-form-item :rules="rules.password" prop="password">
          <cp-pract-input
            placeholder="请输入密码"
            native-type="password"
            v-model="signData.password"
            password-can-toggle :with-text="false">
          </cp-pract-input>
        </el-form-item>
        <span>
          <el-checkbox v-model="signData.longSession">五天内自动登录</el-checkbox>
          <a @click="mode = 0" style="float: right; font-size: 14px; cursor: pointer;">忘记密码？</a>
        </span>
      </el-form>
      <el-form v-show="signInMode === 1" :model="signData" ref="phoneVfyCodeSign">
        <el-form-item :rules="rules.cellphone" prop="cellphone">
          <el-input placeholder="请输入手机号" v-model="signData.cellphone"></el-input>
        </el-form-item>
        <el-form-item :rules="rules.phoneVfyCode" prop="phoneVfyCode">
          <div class="captcha-input">
            <el-input placeholder="请输入验证码" v-model="signData.phoneVfyCode"></el-input>
            <el-button
              type="primary" plain
              :disabled="sendCodeDisable"
              @click="sendPhoneVfyCode('phoneVfyCodeSign', signData.cellphone)">
              获取验证码{{sendCodeDisableLabel}}
            </el-button>
          </div>
        </el-form-item>
        <el-checkbox v-model="signData.longSession">五天内自动登录</el-checkbox>
      </el-form>
      <el-button style="width: 100%; margin: 10px 0;" @click="sign">登录</el-button>
      <div style="text-align: center; font-size: 14px;">
        <a @click="signInMode = [1,0][signInMode]" style="cursor: pointer;">{{signInModeTexts[signInMode]}}</a>
      </div>
    </div>
    <div v-show="mode === 0" class="sign-bodyer">
      <el-form v-show="fortPassMode === 0" ref="fortPassFirst" :model="modifyPassData">
        <el-form-item :rules="rules.cellphone" prop="cellphone">
          <el-input placeholder="请输入手机号" v-model="modifyPassData.cellphone"></el-input>
        </el-form-item>
        <el-form-item :rules="rules.phoneVfyCode" prop="phoneVfyCode">
          <div class="captcha-input">
            <el-input placeholder="请输入验证码" v-model="modifyPassData.phoneVfyCode"></el-input>
            <el-button
              type="primary"
              :disabled="sendCodeDisable" plain
              @click="sendPhoneVfyCode('fortPassFirst', modifyPassData.cellphone)">
              获取验证码{{sendCodeDisableLabel}}
            </el-button>
          </div>
        </el-form-item>
        <el-button @click="fortPassNext" style="width: 100%; margin: 10px 0;">下一步</el-button>
      </el-form>
      <el-form v-show="fortPassMode === 1" ref="fortPassSecnod" :model="modifyPassData">
        <el-form-item :rules="rules.password" prop="password">
          <cp-pract-input
            placeholder="请输入密码"
            native-type="password"
            v-model="modifyPassData.password"
            password-can-toggle :with-text="false">
          </cp-pract-input>
        </el-form-item>
        <el-button style="width: 100%; margin: 10px 0;" @click="modifyPassAndSign">确认更改并登录</el-button>
      </el-form>
      <div style="text-align: center; font-size: 14px;">
        <a @click="mode = 1" style="cursor: pointer;">返回密码登录</a>
      </div>
    </div>
  </el-card>
</template>

<script>
import store from '@/store';
export default {
  name: 'struct-sign-in',
  data () {
    return {
      mode: 1,
      fortPassMode: 0,
      signInMode: 0,
      signInModeTexts: [ '验证码登录', '密码登录' ],
      signData: {
        cellphone: '',
        password: '',
        longSession: false,
        phoneVfyCode: '',
        signType: 0,
      },
      modifyPassData: {
        cellphone: '',
        password: '',
        phoneVfyCode: '',
        vfyType: 1,
      },
      rules: this.$store.state.user.userRules,
      sendCodeDisable: false,
      sendCodeDisableLabel: '',
    };
  },
  created () {
    this.sendCodeBtnDisable(true);
  },
  methods: {
    gotoSignUp () {
      this.$emit('signup');
    },
    sign () {
      const form = this.$refs[[ 'passwordSign', 'phoneVfyCodeSign' ][this.signInMode]];
      form.validate((valid) => {
        if (valid) {
          this.signData.signType = this.signInMode;
          store.dispatch('userSign', this.signData).then(() => {
            // 登录成功，发出登录成功事件
            this.$emit('signed');
          });
        } else {
          console.log('error submit!!');
        }
      });
    },
    sendCodeBtnDisable (noauto) {
      const now = Date.now();
      const localStorage = window.localStorage;
      let firstTime = Number(localStorage.getItem('sendCodeBtnTime'));
      firstTime = isNaN(firstTime) ? now : firstTime;
      let startSecond;
      if (firstTime && now - firstTime <= 60000) { // 60 s
        startSecond = (now - firstTime) / 1000;
        startSecond = startSecond.toFixed();
      } else if (!noauto) {
        startSecond = 60;
        localStorage.setItem('sendCodeBtnTime', now);
      }
      if (startSecond <= 0) return;
      this.sendCodeDisable = true;
      let labelInterval = setInterval(() => {
        this.sendCodeDisableLabel = `(${startSecond})`;
        if (startSecond <= 0) {
          clearInterval(labelInterval);
          labelInterval = null;
          this.sendCodeDisable = false;
          this.sendCodeDisableLabel = '';
          localStorage.setItem('sendCodeBtnTime', null);
          return;
        } else {
          startSecond--;
        }
      }, 1000);
    },
    sendPhoneVfyCode (formName, cellphone) {
      const form = this.$refs[formName];
      form.validateField('cellphone', (valid) => {
        if (!valid) {
          store.dispatch('phoneCodeSend', { cellphone: this.signData.cellphone })
          .then(() => {
            this.sendCodeBtnDisable();
            this.$message({
              message: '短信验证码已发送，请查收！',
              type: 'success',
            });
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    fortPassNext () {
      const form = this.$refs['fortPassFirst'];
      form.validate((valid) => {
        if (valid) {
          store.dispatch('phoneCodeVerify', {
            cellphone: this.modifyPassData.cellphone,
            phoneVfyCode: this.modifyPassData.phoneVfyCode,
          }).then(() => {
            this.fortPassMode = 1;
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    modifyPassAndSign () {
      const form = this.refs['fortPassSecnod'];
      form.validate((valid) => {
        if (valid) {
          store.dispatch('userSignWithNewPass', this.modifyPassData).then(() => {
            // 登录成功，发出登录成功事件
            this.$emit('signed');
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  },
  watch: {
    mode (v) {
      if (v === 1) this.fortPassMode = 0;
    },
  },
  components: {
  },
};
</script>

<style lang="stylus">
.struct-sign-in
  .sign-header
    &::after,&::before
      display table
      content ""
    &:after
      clear both
    > span:nth-child(1)
      color #606266
      font-size 18px
    .goto
      float right
      font-size 14px
      line-height 22px
      .el-button
        padding 0
  .sign-bodyer
    .el-form-item__content
      margin-bottom 20px
    .el-form-item
      margin 0
  .captcha-input
    .el-input
      width 56%
    .el-button
      float right
      width 40%
      padding-left 10px
      padding-right 10px
</style>
