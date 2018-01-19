<template>
  <el-card class="struct-merchant-info in-main-margin">
    <span slot="header">商户资料</span>
    <cp-plain-block class="info-block">
      <span slot="header">商户信息</span>
      <table class="info-table">
        <col align="left"/>
        <col align="left"/>
        <tr>
          <td>商户名称</td>
          <td>{{merchantInfo.payStoreList[0].posName}}</td>
        </tr>
        <tr>
          <td>商户地址</td>
          <td>{{merchantInfo.payStoreList[0].address}}</td>
        </tr>
        <tr>
          <td>商户类型</td>
          <td>
            <span>{{merchantInfo.payStoreList[0].mccSupNameMCC}}</span>
            <span>{{merchantInfo.payStoreList[0].mccTypeNameMCC}}</span>
            <span>{{merchantInfo.payStoreList[0].mccCode}}</span>
          </td>
        </tr>
        <tr>
          <td>地区码</td>
          <td>
            <span>{{merchantInfo.payStoreList[0].provinceName}}</span>
            <span>{{merchantInfo.payStoreList[0].cityName}}</span>
            <span>{{merchantInfo.payStoreList[0].areaName}}</span>
          </td>
        </tr>
      </table>
      <div class="info-image">
        <div v-for="(image,i) in images.info" :key="i" v-if="image">
          <a target="_blank" :href="image" class="el-icon-view"></a>
          <div :style="{'background-image': 'url(' + image + ')'}"></div>
        </div>
      </div>
    </cp-plain-block>
    <cp-plain-block class="info-block">
      <span slot="header">
        <span>联系人信息</span>
        <span style="color: #909399; font-size: 14px;">(联系人信息将用于接收重要通知，如开通提醒等。)</span>
      </span>
      <table class="info-table">
        <col align="left"/>
        <col align="left"/>
        <tr>
          <td>联系人</td>
          <td>{{merchantInfo.payStoreList[0].contactName}}</td>
        </tr>
        <tr>
          <td>手机号</td>
          <td>{{merchantInfo.payStoreList[0].contactPhone}}</td>
        </tr>
        <tr>
          <td>联系邮箱</td>
          <td>{{merchantInfo.payStoreList[0].contactEmail}}</td>
        </tr>
      </table>
    </cp-plain-block>
    <cp-plain-block class="info-block">
      <span slot="header">营业执照信息</span>
      <table class="info-table">
        <col align="left"/>
        <col align="left"/>
        <tr>
          <td>营业执照号</td>
          <td>{{merchantInfo.licenseCode}}</td>
        </tr>
        <tr>
          <td>营业执照名</td>
          <td>{{merchantInfo.licenseName}}</td>
        </tr>
        <tr>
          <td>营业执照地址</td>
          <td>{{merchantInfo.licenseAdrress}}</td>
        </tr>
        <tr>
          <td>营业执照有效期</td>
          <td>{{merchantInfo.licenseValidity}}</td>
        </tr>
      </table>
      <div class="info-image">
        <div v-for="(image,i) in images.license" :key="i" v-if="image">
          <a target="_blank" :href="image" class="el-icon-view"></a>
          <div :style="{'background-image': 'url(' + image + ')'}"></div>
        </div>
      </div>
    </cp-plain-block>
    <cp-plain-block class="info-block">
      <span slot="header">法人信息</span>
      <table class="info-table">
        <col align="left"/>
        <col align="left"/>
        <tr>
          <td>法人姓名</td>
          <td>{{merchantInfo.corpName}}</td>
        </tr>
        <tr>
          <td>法人身份证</td>
          <td>{{merchantInfo.corpId}}</td>
        </tr>
        <tr>
          <td>有效期</td>
          <td>{{merchantInfo.corpIdValidity}}</td>
        </tr>
      </table>
      <div class="info-image">
        <div v-for="(image,i) in images.legal" :key="i" v-if="image">
          <a target="_blank" :href="image" class="el-icon-view"></a>
          <div :style="{'background-image': 'url(' + image + ')'}"></div>
        </div>
      </div>
    </cp-plain-block>
    <cp-plain-block class="info-block" border-style="none">
      <span slot="header">账户信息</span>
      <table class="info-table">
        <col align="left"/>
        <col align="left"/>
        <tr>
          <td>结算标志</td>
          <td>{{['对公','对私'][merchantInfo.payStoreList[0].isPersonal] || ''}}</td>
        </tr>
        <tr>
          <td>结算账户</td>
          <td>{{merchantInfo.payStoreList[0].account}}</td>
        </tr>
        <tr>
          <td>户名</td>
          <td>{{merchantInfo.payStoreList[0].accountName}}</td>
        </tr>
        <tr>
          <td>开户行号</td>
          <td>{{merchantInfo.payStoreList[0].bankCode}}</td>
        </tr>
        <tr>
          <td>结算人身份证号</td>
          <td>{{merchantInfo.payStoreList[0].accountIdNumer}}</td>
        </tr>
        <tr>
          <td>结算人身份证有效期</td>
          <td>{{merchantInfo.payStoreList[0].accountIdValidity}}</td>
        </tr>
      </table>
      <div class="info-image">
        <div v-for="(image,i) in images.account" :key="i" v-if="image">
          <a target="_blank" :href="image" class="el-icon-view"></a>
          <div :style="{'background-image': 'url(' + image + ')'}"></div>
        </div>
      </div>
    </cp-plain-block>
  </el-card>
</template>

<script>
export default {
  name: 'struct-merchant-info',
  data () {
    return {
      /*
      1-营业执照照片
      2-税务登记证照
      3-组织机构照
      4-法人身份证正面照
      5-法人身份证反面照
      6-门头照
      7-场景照
      8-收银台照
      9-结算人身份证正面照
      10-结算人身份证反面照
      11-银行卡照
      12-开户行许可证照
      13-法人手持证件照
      14-商户协议
      15-商户信息表
      16-授权结算书
      */
      images: {
        info: [],
        license: [],
        legal: [],
        account: [],
      },
      imageTypes: {
        info: [ 6, 7, 8 ], // 商户信息
        license: [ 1, 2, 3 ], // 营业执照
        legal: [ 4, 5, 13 ], // 法人
        account: [ 9, 10, 11, 12 ], // 账户
      },
      merchantInfo: this.$store.getters.merchantInfoDefault,
    };
  },
  mounted () {
    if (this.merchant && this.merchant.id) {
      this.hugMerchantInfo();
    }
  },
  computed: {
    merchant () {
      return this.$store.state.user.merchant;
    },
  },
  methods: {
    hugMerchantInfo () {
      const merchantId = this.merchant.id;
      if (merchantId && merchantId !== this.merchantInfo.id) {
        this.$store.dispatch('merchantInfo', this.merchant.id).then(info => {
          if (info && info.payStoreList && info.payStoreList.length) {
            this.merchantInfo = info;
            // 遍历图片信息
            const photos = info.payStoreList[0].payPhotoList;
            if (photos && photos.length) {
              const imageTypes = this.imageTypes;
              photos.forEach(photo => {
                for (const key in imageTypes) {
                  this.images[key] = [];
                  if (imageTypes[key].indexOf(photo.imgType) >= 0) {
                    this.images[key].push(photo.url);
                  }
                }
              });
            }
          }
        });
      }
    },
  },
  watch: {
    'merchant.id' (v) {
      this.hugMerchantInfo();
    },
  },
};
</script>

<style lang="stylus">
.struct-merchant-info
  .info-block
    margin-left 10px
    margin-top 10px
    .info-table
      margin-top -10px
      border-collapse separate
      border-spacing 8px 22px
      font-size 14px
      color #606266
      col:first-child
        width 140px
    .info-image
      position absolute
      right 20px
      bottom 20px
      display flex
      > div
        width 80px
        height 80px
        flex 1
        margin-right 20px
        border 1px solid #E4E7ED
        border-radius 4px
        padding 10px
        a 
          display inline-block
          position absolute
          height 80px
          width 80px
          text-align center
          color #fff
          line-height 80px
          background-color #0003
          border-radius 4px
          cursor pointer
          text-decoration none
          &:hover
            background-color #0009
        div
          height 100%
          width 100%
          background-position center
          background-size 100%
          border-radius 4px
  .info-block:first-child
    margin-top 0px
</style>
