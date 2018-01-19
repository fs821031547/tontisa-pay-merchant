<template>
  <div class="struct-index-home in-main-margin">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="user-present-block">
          <div>
            <div class="avatar-block">
              <cp-avatar size="giant" :src="user.headImg"></cp-avatar>
            </div>
            <div class="info-block">
              <div>{{sayHello}}，</div>
              <div>{{user.nickname}}</div>
            </div>
          </div>
          <!-- <div class="extra-block">
            <div title="2017-12-12 12:12">上次登录时间：2017-12-12 12:12</div>
            <div title="俄罗斯">上次登录地点：俄罗斯</div>
          </div> -->
        </el-card>
        <el-card class="trade-amount-block">
          <span slot="header">总交易额</span>
          <div style="display: flex;">
            <div class="trade-info" style="flex: 8">
              <div>昨日</div>
              <div :title="'￥'+ merchantAllTradeStats.lastDay.totalAmount">￥{{merchantAllTradeStats.lastDay.totalAmount | moneyFmt}}</div>
            </div>
            <div class="divide-line" style="flex: 1;"></div>
            <div class="trade-info" style="flex: 8">
              <div>近30天</div>
              <div :title="'￥'+ merchantAllTradeStats.thirtyDay.totalAmount">￥{{merchantAllTradeStats.thirtyDay.totalAmount | moneyFmt}}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="trade-count-block">
          <span slot="header">总交易笔数</span>
          <div style="display: flex;">
            <div class="trade-info" style="flex:9">
              <div>昨日</div>
              <div>{{merchantAllTradeStats.lastDay.totalCount}}</div>
            </div>
            <div class="divide-line" style="flex: 1; margin-right: 12px;"></div>
            <div class="trade-info" style="flex:9">
              <div>近30天</div>
              <div>{{merchantAllTradeStats.thirtyDay.totalCount}}</div>
            </div>
          </div>
        </el-card>
        <el-card class="trade-ratio-block">
          <div slot="header">
            <el-button-group style="float: right; margin-top: -5px">
              <el-button size="small"
                @click="() => { tradeRatioPayTypeSelect.number = 'typeAmount'; tradeRatioPayTypeSelect.ratio = 'amountProportion'; tradeRatioChartData() }"
                :class="{'trade-ratio-select-active': tradeRatioPayTypeSelect.number == 'typeAmount'}">
                交易额
              </el-button>
              <el-button size="small"
              @click="() => { tradeRatioPayTypeSelect.number = 'typeCount'; tradeRatioPayTypeSelect.ratio = 'countProportion'; tradeRatioChartData() }"
                :class="{'trade-ratio-select-active': tradeRatioPayTypeSelect.number == 'typeCount'}">
                订单数
              </el-button>
            </el-button-group>
            <span>支付方式占比</span>
          </div>
          <cp-chart :options="tradeRatioChartOptions" style="width: 80px; float: left; height: 80px;" ref="payTypePieRef"></cp-chart>
          <div class="ratio-chart-info">
            <div v-for="(item, i) in merchantAllTradeStats.thirtyDay.payTypeStats" :key="i">
              <span :style="{color: tradeRatioPayTypeColor[item.payType]}">●</span>
              <span>{{tradeRatioPayTypeLabel[item.payType]}}</span>
              <span>|</span>
              <span>{{item[tradeRatioPayTypeSelect.ratio]}}%</span>
              <span>￥{{item[tradeRatioPayTypeSelect.number]}}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12" class="merchant-info-block">
        <el-card>
          <div slot="header">
            <el-button
              size="small"
              style="float: right; margin-top: 5px; padding: 0;"
              type="text"
              @click="enterMerchant">
              进入商户
            </el-button>
            <el-menu style="width: 50%;" mode="horizontal" :default-active="merchantMenuActive" class="simple-menu">
              <el-submenu index="merchant">
                <template slot="title">{{merchant.licenseName}}</template>
                <el-menu-item
                  :index="'merchant-'+item.id"
                  @click="merchantChoice(item)"
                  v-for="(item, i) in merchants"
                  :key="i">
                  {{item.licenseName}}
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </div>
          <cp-plain-block>
            <el-row class="merchant-info">
              <el-col :span="14">
                <table>
                  <col align="left"/>
                  <col align="left"/>
                  <tr>
                    <td>商户简称</td>
                    <td>{{merchantInfo.licenseName}}</td>
                  </tr>
                  <tr>
                    <td>联系人</td>
                    <td>{{merchantInfo.payStoreList[0].contactName}} | {{merchantInfo.payStoreList[0].contactPhone}}</td>
                  </tr>
                  <tr>
                    <td>商户类型</td>
                    <td>{{merchantInfo.payStoreList[0].mccName}}</td>
                  </tr>
                  <tr>
                    <td>商户地址</td>
                    <td>{{merchantInfo.payStoreList[0].address}}</td>
                  </tr>
                  <tr>
                    <td>结算信息</td>
                    <td>{{merchantInfo.payStoreList[0].accountName}} | {{accountDisplay(merchantInfo.payStoreList[0].account)}}</td>
                  </tr>
                </table>
              </el-col>
              <el-col :span="10" class="yesterday-trade-info">
                <div>昨日交易</div>
                <div>￥{{merchantLastTradeStats.totalAmount | moneyFmt}}</div>
                <div>昨日订单量</div>
                <div>{{merchantLastTradeStats.totalCount}}</div>
              </el-col>
            </el-row>
          </cp-plain-block>
          <div>
            <div style="height: 40px;">
              <div style="float: left; line-height: 40px;">相关门店</div>
              <div style="float: right;">
                <el-button type="text" @click="togMerchantStoreActive(-1)">上一页</el-button>
                <el-button type="text" @click="togMerchantStoreActive(1)">下一页</el-button>
              </div>
            </div>
            <cp-slide :amount="slideNum(merchantStoresTradeStats.length)" :active="merchantStoreActive">
              <el-row :gutter="20" :slot="si" :si="si" :key="si" v-for="si in slideNum(merchantStoresTradeStats.length)">
                <el-col :span="merchantStoresTradeStats.length < 3 ? 12 : 8" class="shop-info" v-for="(shop, i) in slideData(merchantStoresTradeStats, si)" :key="i">
                  <div>
                    <cp-plain-block class="shop-trade" border-style="none">
                      <div>
                        {{shop.posName || '-'}}
                        <el-tooltip v-if="si === 1 && i === 0" content="商户主商铺" placement="top" effect="light">
                          <span>主</span>
                        </el-tooltip>
                      </div>
                      <div>昨日交易：</div>
                      <div>￥{{shop.totalAmount | moneyFmt}}</div>
                      <div>联系人：{{shop.contactName}}</div>
                    </cp-plain-block>
                    <!-- <div class="shop-code">
                      接入码：
                      <span>
                        {{shop.code || '-'}}
                        <el-tooltip content="用于开通小强ERP扫码付" placement="top" effect="light">
                          <i class="el-icon-question"></i>
                        </el-tooltip>
                      </span>
                    </div> -->
                  </div>
                </el-col>
              </el-row>
            </cp-slide>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" class="trade-trend-info">
        <el-card>
          <div slot="header">
            <span>交易趋势</span>
            <div style="float: right; margin-top: -10px">
              <span style="margin-right: 8px;">
                <el-button type="text" @click="tradeTrendChartData('last')">昨日</el-button>
                <el-button type="text" @click="tradeTrendChartData('seven')">近7天</el-button>
                <el-button type="text" @click="tradeTrendChartData('thirty')">近30天</el-button>
              </span>
              <el-date-picker
                type="daterange"
                align="right"
                size="small"
                range-separator="至"
                start-placeholder="开始日期"
                v-model="tradeTrendChartDateExtent"
                @change="tradeTrendChartData"
                end-placeholder="结束日期" style="width: 280px;">
              </el-date-picker>
            </div>
          </div>
          <cp-chart :options="tradeTrendChartOptions" style="height: 420px;" ref="trendLineRef"></cp-chart>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'struct-index-home',
  data () {
    const hour = new Date().getHours();
    const moneyFmt = this.$filter.moneyFmt;
    const lastDate = this.$util.extentDate('last');
    return {
      sayHello: hour <= 12 ? '上午好' : '下午好',
      user: this.$store.state.user.user || {},
      merchantMenuActive: '',
      merchantInfo: this.$store.getters.merchantInfoDefault,
      merchantStoresTradeStats: this.$store.getters.merchantStoresTradeStatsDefault,
      merchantAllTradeStats: {
        lastDay: this.$store.getters.merchantTradeStatsDefault,
        thirtyDay: this.$store.getters.merchantTradeStatsDefault,
      },
      merchantLastTradeStats: this.$store.getters.merchantTradeStatsDefault,
      merchantStoreActive: 0,
      merchantStorePageSize: 3,
      menusName: this.$store.state.nav.menusName,
      tradeRatioPayTypeColor: { // 1, 支付宝 2, 微信 3, 银联
        '1': '#409EFF',
        '2': '#67C23A',
        '3': '#006E85',
      },
      tradeRatioPayTypeLabel: {
        '1': '支付宝',
        '2': '微信',
        '3': '银联',
      },
      tradeRatioPayTypeSelect: {
        number: 'typeAmount', // typeAmount 交易额 typeCount 交易量
        ratio: 'amountProportion', // amountProportion 交易额占比 countProportion 交易量占比
      },
      tradeTrendChartDateExtent: [ new Date(lastDate.start), new Date(lastDate.end) ],
      tradeTrendChartOptions: {
        color: [ '#3398DB' ],
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#fff',
          borderColor: '#eee',
          borderWidth: 1,
          padding: [ 5, 10 ],
          textStyle: {
            color: '#666',
          },
          formatter: '{b}<br/>{a} : <strong style="color: #0e92f3;">{c}</strong>',
          extraCssText: 'box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);',
        },
        grid: {
          left: 60,
          right: 10,
          top: 20,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [],
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: moneyFmt,
          },
        },
        series: [
          {
            name: '交易额',
            type: 'line',
            smooth: true,
            data: [],
          },
        ],
      },
      tradeRatioChartOptions: {
        series: [
          {
            type: 'pie',
            radius: '100%',
            hoverAnimation: false,
            data: [
              { value: 0, itemStyle: { normal: { color: '#909399' }}},
              { value: 0, itemStyle: { normal: { color: '#909399' }}},
              { value: 0, itemStyle: { normal: { color: '#909399' }}},
            ],
            labelLine: {
              normal: {
                show: false,
              },
            },
          },
        ],
      },
    };
  },
  mounted () {
  },
  created () {
    this.hugMerchantAllTradeStats();
    this.tradeTrendChartData();
  },
  computed: {
    merchant () {
      return this.$store.state.user.merchant;
    },
    merchants () {
      return this.$store.state.user.merchants;
    },
  },
  watch: {
    merchant (v) {
      this.$nextTick(() => {
        this.merchantMenuActive = 'merchant-' + v.id;
      });
    },
    'merchant.id' (v) {
      this.hugMerchantInfo();
    },
  },
  methods: {
    merchantChoice (merchant) {
      this.$store.dispatch('merchantChoice', { merchant });
    },
    hugMerchantAllTradeStats () {
      const lastDate = this.$util.extentDate('last');
      this.$store.dispatch('merchantTradeStats', {
        payedTimeStart: lastDate.start,
        payedTimeEnd: lastDate.end,
      }).then(stats => {
        if (stats) {
          this.merchantAllTradeStats.lastDay = stats;
        }
      });
      const thirtyDate = this.$util.extentDate('thirty');
      this.$store.dispatch('merchantTradeStats', {
        payedTimeStart: thirtyDate.start,
        payedTimeEnd: thirtyDate.end,
        paytypestats: '',
      }).then(stats => {
        if (stats) {
          this.merchantAllTradeStats.thirtyDay = stats;
          this.tradeRatioChartData();
        }
      });
    },
    hugMerchantInfo () {
      const merchantId = this.merchant.id;
      if (merchantId && merchantId !== this.merchantInfo.id) {
        this.$store.dispatch('merchantInfo', this.merchant.id).then(info => {
          if (info && info.payStoreList && info.payStoreList.length) {
            this.merchantInfo = info;
          }
        });
        const lastDate = this.$util.extentDate('last');
        this.$store.dispatch('merchantStoresTradeStatsList', {
          merchantId: this.merchant.id,
          startDate: lastDate.start,
          endDate: lastDate.end,
        }).then(list => {
          if (list && list.length) {
            this.merchantStoresTradeStats = list;
          }
        });
        this.$store.dispatch('merchantTradeStats', {
          merchantId: this.merchant.id,
          payedTimeStart: lastDate.start,
          payedTimeEnd: lastDate.end,
        }).then(stats => {
          if (stats) {
            this.merchantLastTradeStats = stats;
          }
        });
      }
    },
    accountDisplay (account) {
      if (account) {
        return [ '****', '****', '****', account.slice(account.length - 4, account.length) ].join(' ');
      }
      return account;
    },
    enterMerchant () {
      const menu = this.menusName['merchant_stats'];
      this.$store.dispatch('menuJump', menu);
    },
    slideNum (count, size) {
      size = size || this.merchantStorePageSize;
      count = count || this.merchantStoresTradeStats.length;
      return Math.floor(count / size) + (count % size > 0 ? 1 : 0);
    },
    slideData (datas, page, size) {
      size = size || this.merchantStorePageSize;
      return datas.slice((page - 1) * size, page * size);
    },
    togMerchantStoreActive (direction) {
      const page = this.slideNum();
      const active = this.merchantStoreActive;
      if (direction > 0 && active >= (page - 1)) {
        return;
      } else if (direction < 0 && active < 1) {
        return;
      }
      this.merchantStoreActive += direction;
    },
    tradeRatioChartData () {
      const datas = [];
      const stats = this.merchantAllTradeStats.thirtyDay;
      const select = this.tradeRatioPayTypeSelect;
      const color = this.tradeRatioPayTypeColor;
      if (stats && stats.payTypeStats && stats.payTypeStats.length) {
        for (const payType in stats.payTypeStats) {
          if (payType.fake) {
            datas.push({
              value: 0,
              itemStyle: {
                normal: {
                  color: '#909399',
                },
              },
            });
          } else {
            datas.push({
              value: payType[select.number] || 0,
              itemStyle: {
                normal: {
                  color: color[payType.payType] || '#909399',
                },
              },
            });
          }
        }
      }
      this.tradeRatioChartOptions.series[0].data = datas;
      this.$refs.payTypePieRef.repaint();
    },
    tradeTrendChartData (range) {
      let start;
      let end;
      if (range && range.length && Array.isArray(range)) {
        const firstDate = this.$util.extentDate('today', range[0]);
        const lastDate = this.$util.extentDate('today', range[1]);
        start = new Date(firstDate.start);
        end = new Date(lastDate.end);
      } else if (typeof range === 'string') {
        const extentDate = this.$util.extentDate(range);
        start = new Date(extentDate.start);
        end = new Date(extentDate.end);
      } else {
        const lastDate = this.$util.extentDate('last');
        start = new Date(lastDate.start);
        end = new Date(lastDate.end);
      }
      const datas = [];
      const xline = [];
      const query = {
        startDate: start.format('yyyy-MM-dd hh:mm:ss'),
        endDate: end.format('yyyy-MM-dd hh:mm:ss'),
      };
      const dateRange = this.$util.dateRange(start, end);
      const map = { 'D': 'H', 'M': 'D' };
      query.cycleType = map[dateRange] || 'D';
      function xExtract (type) {
        if (type === 'H') {
          return function (time) {
            if (!time) return '-';
            const date = new Date(time);
            if (date !== 'Invalid Date') {
              return date.getHours() + ':00';
            }
            return '-';
          };
        } else if (type === 'D') {
          return function (time) {
            if (!time) return '-';
            const date = new Date(time);
            if (date !== 'Invalid Date') {
              return date.format('MM-dd');
            }
            return '-';
          };
        } else {
          return function () {
            return '-';
          };
        }
      }
      this.$store.dispatch('merchantTrendStats', query).then(res => {
        if (res && res.length) {
          const xhandler = xExtract(query.cycleType);
          for (const i in res) {
            const row = res[i];
            xline.push(xhandler(row.payTime));
            datas.push(row.totalAmount);
          }
        }
      }).then(() => {
        this.tradeTrendChartOptions.series[0].data = datas;
        this.tradeTrendChartOptions.xAxis.data = xline;
        this.$refs.trendLineRef.repaint();
      });
    },
  },
};
</script>

<style lang="stylus">
.struct-index-home
  > div
    .el-card__header
      padding 12px 16px
  > div:first-child
    margin-bottom 20px
    > div
      display flex
      justify-content space-between
    .el-card
      height 160px;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
  > div:nth-child(2)
    .el-card
      height 480px;
  .user-present-block
    flex 3
    margin-right 20px
    .avatar-block
      float left
      padding-top 20px
    .info-block
      font-size 20px
      line-height 34px
      margin-left 95px
      font-weight bold
      padding-top 26px
    .extra-block
      margin-top 12px
      font-size 12px
      color #909399
      height 48px
      line-height 24px
      div
        overflow hidden
        white-space nowrap
        text-overflow ellipsis
  .trade-amount-block
    flex 4
  .trade-count-block
    flex 3
    margin-right 20px
  .trade-ratio-block
    flex 4
    .ratio-chart-info
      margin-left 92px
      margin-top 8px
      font-size 14px
      > div
        display flex
      span:nth-child(1)
        margin-right 4px
      span:nth-child(2)
        display inline-block
        min-width 46px
        color #606266
        flex 1.5
      span:nth-child(3)
        color #C0C4CC
        margin-right 8px
      span:nth-child(4)
        display inline-block
        flex 1.2
        color #909399
      span:nth-child(5)
        display inline-block
        flex 2
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
    .trade-ratio-select-active
      color #409EFF
      border-color #c6e2ff
      background-color #ecf5ff
  .merchant-info-block
    .merchant-info
      margin-top -16px
    table
      border-collapse separate
      border-spacing 0px 12px
      font-size 14px
      color #606266
      tr
        td:last-child
          padding-left 16px
    .yesterday-trade-info
      margin-top 18px
      background-color #EBEEF5
      border-radius 4px
      padding 20px
      div:nth-child(odd)
        font-size 14px
        color #909399
      div:nth-child(even)
        font-weight bold
        font-size 24px
    .shop-info:first-child
      .shop-trade div:first-child span
        background-color #69c0ff
        border-radius 10px
        color #fff
        display inline-block
        width 20px
        height 20px
        text-align center
        font-size 12px
        line-height 20px
        position absolute
        right 0
        margin-top 2px
    .shop-info
      > div
        border 1px solid #DCDFE6
        border-radius 4px
        padding 16px
      .shop-trade
        line-height 31px
        div
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
          margin-bottom 8px
        div:nth-child(1)
          overflow hidden
        div:nth-child(2)
          font-size 14px
          color #909399
        div:nth-child(3)
          font-size 18px
          font-weight bold
        div:nth-child(4)
          color #606266
          font-size 14px
      .shop-code
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
        margin-top 12px
        font-size 14px
        span
          font-weight bold
          color #909399
        i
          position absolute
          font-size 16px
          margin-top 2px
          color #DCDFE6
  .trade-info
    > div:first-child
      font-size 12px
      color #909399
      height 26px
    > div:last-child
      font-size 26px
      font-weight bold
      overflow hidden
      white-space nowrap
      text-overflow ellipsis
.divide-line
  text-align center
  line-height 68px
  &:before
    content ' '
    border-right 1px solid #DCDFE6
    font-size 46px
.simple-menu
  &.el-menu--horizontal
    border-bottom none
  .el-submenu__title
    height 22px !important
    line-height 22px !important
    font-size 16px !important
    color #303133 !important
    padding 0
  .el-submenu > .el-menu
    top 35px
    left -10px
  .el-menu-item:focus
    color #409EFF
  .el-submenu.is-active .el-submenu__title
    border-bottom none
</style>