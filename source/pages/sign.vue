<template>
  <div class="page-sign">
    <div class="top-block">
      <span style="color:#E4E7ED">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
      小强扫码付
    </div>
    <div class="head-block">
      <div class="banner-block">
        <div>
          <div>小强扫码付 • 小强ERP官方指定支付产品</div>
          <div>24小时的“移动POS机” / 零成本、低费率 / 资金直达企业账户</div>
        </div>
      </div>
      <div class="sign-block">
        <struct-sign-in v-show="signMode === 0" @signup="signMode = 1" @signed="signed"></struct-sign-in>
        <struct-sign-up v-show="signMode === 1" @signin="signMode = 0"></struct-sign-up>
      </div>
    </div>
    <div class="body-block">
      <div class="describe-block"></div>
      <div class="manual-block"></div>
    </div>
    <div class="foot-block">
      <div>
        <a href="http://tontisa.com/about.html" target="_blank">公司简介</a>
        <span class="link-split">|</span>
        <a href="http://tontisa.com/#" target="_blank">加入我们</a>
        <span class="link-split">|</span>
        <a href="http://tontisa.com/contact.html" target="_blank">联系我们</a>
        <span class="link-split">|</span>
        <a href="http://tontisa.com/pay.html" target="_blank">付款账号</a>
        <span class="link-split">|</span>
        <a href="http://tontisa.com/tds.html" target="_blank">TDS论坛</a>
      </div>
      <div>
        <span>深圳同天下科技有限公司 版权所有 © TONTISA.COM 粤ICP备13025331号</span>
      </div>
    </div>
  </div>
</template>

<script>
import signin from '../structures/sign/in.vue';
import signup from '../structures/sign/up.vue';
export default {
  name: 'page-sign',
  data () {
    return {
      signMode: 0,
    };
  },
  components: {
    [signin.name]: signin,
    [signup.name]: signup,
  },
  methods: {
    signed () {
      this.$router.push({ name: 'index_home' });
    },
  },
};
</script>

<style lang="stylus">
$blank = 12%

.page-sign
  height 100%
  width 100%
  min-height 736px
  .top-block
    height 80px
    background-color #fff
    color #606266
    font-size 20px
    line-height 92px
    background-image url('../assets/logo-top.png')
    background-repeat no-repeat
    background-position left center
    margin-left 60px
    padding-left 205px
  .head-block
    width 100%
    height calc(100% - 160px)
    background-image url('../assets/sign_banner.jpg')
    .banner-block
      color #fff
      float left
      width 100%
      height 100%
      background-color rgba(38,60,103,0.2)
      >div
        width 660px
        padding-top 13%
        text-align center
        padding-left $blank
        div:nth-child(1)
          font-size 36px
        div:nth-child(2)
          margin-top 10px
    .sign-block
      position absolute
      right 0
      padding-top 7%
      padding-right $blank
      width 336px
  .foot-block
    height 80px
    width 100%
    color #909399
    font-size 14px
    background #fff
    text-align center
    div
      padding-top 10px
    div:last-child
      color #C0C4CC
    a
      text-decoration none
      color #909399
      display inline-block
      &:hover
        color #C0C4CC
    .link-split
      margin -2px 18px
      font-size 16px
      color #C0C4CC
</style>
