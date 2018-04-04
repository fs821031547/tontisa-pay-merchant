<template>
  <div class="merchant-apply-box">
    <div class="hd-box">
      <div class="hd-title">开通商户</div>
      <div class="hd-desc">费率说明：扫描二维码 0.0043，刷卡，借记卡 0.0049（借记卡单笔手续费25元封顶），信用卡 0.0059。</div>
    </div>
    <div class="merchant-apply-steps">
        <el-steps direction="vertical" :active="2">
          <el-step title="提交开通申请单" description="填写企业资质证照、经营类目以及银行账户、协议等信息"></el-step>
          <el-step title="服务商审核 审核未通过 | 查看原因" description="根据产品要求提交资料后，服务商进行审核。"></el-step>
          <el-step description="1-3个工作日内即可通过审核。"></el-step>
          <el-step title="开通成功"></el-step>
        </el-steps>
    </div>
    <div class="merchant-apply-handle">
      <div class="tips">如有疑问请联系客服：89332966</div>
      <el-button type="primary">申请开通</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {

    };
  },
};
</script>
<style lang="stylus" scoped>
  .merchant-apply-box
    .hd-box
      .hd-title
        font-size 20px
        color #303133
        text-align left
        line-height 30px
      .hd-desc
        font-size 13px
        color #C0C4CC
        text-align left
        line-height 24px
    .merchant-apply-steps
      margin-top 80px
      height 400px
    .merchant-apply-handle
      margin-top 30px
      .tips
        font-size 13px
        color #C0C4CC
        line-height 24px
        display inline-block
</style>
