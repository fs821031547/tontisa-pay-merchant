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
      <el-input placeholder="请输入手机号"></el-input>
      <div class="captcha-input">
        <el-input placeholder="请输入验证码"></el-input>
        <el-button type="primary" plain>获取验证码</el-button>
      </div>
      <el-button @click="signInModeToggle" style="width: 100%">下一步</el-button>
    </div>
    <div v-show="signUpMode === 1" class="sign-bodyer">
      <el-input placeholder="请输入手机号"></el-input>
      <el-input placeholder="请输入密码" type="password"></el-input>
      <el-checkbox>我已阅读并接受<a href="">用户协议</a></el-checkbox>
      <el-checkbox>五天内自动登录</el-checkbox>
      <el-button style="width: 100%">免费注册</el-button>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'struct-sign-up',
  data () {
    return {
      signUpMode: 0,
    };
  },
  methods: {
    signInModeToggle () {
      this.signUpMode = this.signUpMode === 0 ? 1 : 0;
    },
    gotoSignIn () {
      this.$emit('signin');
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
      font-size 14px
      line-height 22px
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
