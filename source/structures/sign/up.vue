<template>
  <!-- 注册结构 -->
  <el-card class="struct-sign-up">
    <div slot="header" class="sign-header">
      <span>注册</span>
      <span class="goto">
        已经注册过了，
        <el-button type="text" @click="gotoSignIn">直接登录</el-button>
      </span>
    </div>
    <div v-show="signUpMode === 0" class="sign-bodyer">
      <el-form ref="fortPassFirst" :model="signData">
        <el-form-item :rules="rules.cellphone" prop="cellphone">
          <el-input placeholder="请输入手机号" v-model="signData.cellphone"></el-input>
        </el-form-item>
        <el-form-item :rules="rules.phoneVfyCode" prop="phoneVfyCode">
          <div class="captcha-input">
            <el-input placeholder="请输入验证码" v-model="signData.phoneVfyCode"></el-input>
            <el-button
              type="primary"
              :disabled="sendCodeDisable" plain
              @click="fnSendCode">
              获取验证码{{sendCodeDisableLabel}}
            </el-button>
          </div>
        </el-form-item>
        <el-button @click="signInModeToggle" style="width: 100%">下一步</el-button>
      </el-form>
    </div>
    <div v-show="signUpMode === 1" class="sign-bodyer">
      <el-form ref="signUp" :model="signData">
        <el-form-item :rules="rules.cellphone" prop="cellphone">
          <el-input placeholder="请输入手机号" v-model="signData.cellphone"></el-input>
        </el-form-item>
        <el-form-item :rules="rules.password" prop="password">
        <el-input placeholder="请输入密码" type="password" v-model="signData.password"></el-input>
        </el-form-item>
        <el-checkbox>我已阅读并接受<a href="">用户协议</a></el-checkbox>
        <el-checkbox>五天内自动登录</el-checkbox>
        <el-button style="width: 100%" @click="fnSignUp">免费注册</el-button>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import store from '@/store';
import mixin from './_mixin';
export default {
  name: 'struct-sign-up',
  data () {
    return {
      signUpMode: 0,
      fortPassMode: 0,
      signData: {
        cellphone: '',
        password: '',
        longSession: false,
        phoneVfyCode: '',
        signType: 0,
        nickname: '',
      },
      userInfo: {
        cellphone: '',
        nickname: '',
        password: '',

      },
      rules: store.state.user.userRules,
      sendCodeDisable: false,
      sendCodeDisableLabel: '',
      isSignUp: false,   //手机号是否注册
    };
  },
  created () {
    this.sendCodeBtnDisable(true);
  },
  mixins: [ mixin ],
  methods: {
    confirmSign () {
      store.dispatch('phoneCodeVerify', {
        cellphone: this.signData.cellphone,
        phoneVfyCode: this.signData.phoneVfyCode,
      }).then((res) => {
        this.confirm('该账号已注册，确认直接登陆吗？', () => {
          store.dispatch('userSign', this.signData).then(() => {
      // 登录成功，发出登录成功事件
            this.$emit('signed');
          });
        }, () => {});
      });
    },
    signUp () {
      store.dispatch('phoneCodeVerify', {
        cellphone: this.signData.cellphone,
        phoneVfyCode: this.signData.phoneVfyCode,
      }).then(() => {
        this.signUpMode = this.signUpMode === 0 ? 1 : 0;
      });
    },
    signInModeToggle () {
      const form = this.$refs['fortPassFirst'];
      const cellphone = this.signData.cellphone;
      form.validate((valid) => {
        if (valid) {
          store.dispatch('notExist', { cellphone }).then((end) => {
            if (!end) {               // 如果号码已存在
              this.confirmSign();
            } else {
              this.signUp();
            }
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
      return;
    },
    gotoSignIn () {
      this.$emit('signin');
    },
    sendCodeBtnDisable (noauto) {
      const now = Date.now();
      const localStorage = window.localStorage;
      let firstTime = Number(localStorage.getItem('sendCodeSignUp'));
      firstTime = isNaN(firstTime) ? now : Number(firstTime);
      let startSecond;
      if (firstTime && now - firstTime <= 60000) { // 60 s
        startSecond = (now - firstTime) / 1000;
        startSecond = startSecond ? (60 - startSecond.toFixed()) : startSecond.toFixed();
      }
      if (!noauto) {
        startSecond = 60;
        localStorage.setItem('sendCodeSignUp', now);
      }
      if (startSecond <= 0 || !startSecond) return;
      this.sendCodeDisable = true;
      let labelInterval = setInterval(() => {
        this.sendCodeDisableLabel = `(${startSecond})`;
        if (startSecond <= 0) {
          clearInterval(labelInterval);
          labelInterval = null;
          this.sendCodeDisable = false;
          this.sendCodeDisableLabel = '';
          localStorage.setItem('sendCodeSignUp', null);
          return;
        } else {
          startSecond--;
        }
      }, 1000);
    },
    fnSendCode () {
      const cellphone = this.signData.cellphone;
      this.sendPhoneVfyCode('fortPassFirst', cellphone);
    },
    fnSignUp () {
      const cellphone = this.signData.cellphone;
      const password = this.signData.password;
      const nickname = this.signData.nickname || 'rock';
      const form = this.$refs['fortPassFirst'];
      if (this.isSignUp) {
        form.validate((valid) => {
          if (valid) {
            this.confirm('该账号已注册，确认直接登陆吗？', () => {
              store.dispatch('phoneCodeVerify', {
                cellphone: this.signData.cellphone,
                phoneVfyCode: this.signData.phoneVfyCode,
              }).then(() => {
                store.dispatch('userSign', this.signData).then(() => {
                // 登录成功，发出登录成功事件
                  this.$emit('signed');
                });
              });
            }, () => {
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        return;
      }
      store.dispatch('userSignUp', { cellphone, password, nickname }).then((end) => {
        if (end) {
          this.$message({
            message: '注册成功！',
            type: 'success',
          });
        } else {
          this.$message({
            message: '该手机号码已经注册过了，无需再注册！',
            type: 'success',
          });
        }
      });
    },
    confirm (title, success, error, type) {
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: type || 'warning',
      }).then(success).catch(error);
    },
  },
  components: {
  },
};
</script>

<style lang="stylus">
.struct-sign-up
  .sign-header
    &::after,&::before
      display table
      content ""
    &:after
      clear both
    .goto
      float right
      font-size 12px
      line-height 22px
      color #cccccc
      .el-button
        padding 0
  .sign-bodyer
    .el-input
      margin 10px 0
    .el-button
      margin 10px 0
  .captcha-input
    .el-input
      width 56%
    .el-button
      float right
      width 40%
      padding-left 10px
      padding-right 10px
  .el-checkbox + .el-checkbox
    margin-left 0
</style>
