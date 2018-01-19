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
        <span>
          <a href="http://tontisa.com/about.html" target="_blank">公司简介</a>　|　
          <a href="http://tontisa.com/#" target="_blank">加入我们</a>　|　
          <a href="http://tontisa.com/contact.html" target="_blank">联系我们</a>　|　
          <a href="http://tontisa.com/pay.html" target="_blank">付款账号</a>　|　
          <a href="http://tontisa.com/tds.html" target="_blank">TDS论坛</a>
        </span>
        <span>工作时间：周一至周六09:00~18:00</span>
        <span>公司地址：深圳市龙岗区力嘉路108号2013文化创客园A312-314</span>
      </div>
      <div>
        <div></div>
        <div>0755-89332966</div>
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
    height calc(100% - 180px)
    background-image url('../assets/sign_banner.jpg')
    .banner-block
      color #fff
      float left
      width 100%
      height 100%
      background-color rgba(0, 0, 0, 0.5)
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
    height 100px
    width 100%
    color #fff
    font-size 14px
    background #333333
    > div:nth-child(1)
      float left
      padding-left $blank
      span
        display block
        padding-top 10px
        color #C0C4CC
        a
          text-decoration none
          cursor pointer
          color #DCDFE6
          &:hover
            color #F2F6FC
      span:nth-child(1)
        color #F2F6FC
    > div:nth-child(2)
      float right
      padding-right $blank
      opacity 0.4
      div:nth-child(1)
        width 180px
        height 44px
        background url('../assets/logo-bottom.png')
        background-repeat no-repeat
        background-position left top 10px
      div:nth-child(2)
        font-size 26px
        padding-top 10px
</style>
