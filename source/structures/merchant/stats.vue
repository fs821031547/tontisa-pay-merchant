<template>
  <div class="struct-merchant-stats">
    <div class="search-block">
      <el-date-picker
        type="daterange"
        align="right"
        range-separator="至"
        v-model="queryDateExtent"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="queryInfoByDateExtent"
        size="small">
      </el-date-picker>
      <span>
        <el-button type="text" size="small" @click="queryInfoByDateExtent('last')">昨日</el-button>
        <el-button type="text" size="small" @click="queryInfoByDateExtent('seven')">近7天</el-button>
        <el-button type="text" size="small" @click="queryInfoByDateExtent('thirty')">近30天</el-button>
      </span>
    </div>
    <div style="margin: 20px;">
      <el-row :gutter="20" class="upside-block">
        <el-col :span="8">
          <el-card class="stats-datum-block">
            <div slot="header">
              <span>交易</span>
            </div>
            <cp-plain-block border-style="solid" :title="'￥'+ merchantTradeStats.totalAmount">￥{{merchantTradeStats.totalAmount | moneyFmt}}</cp-plain-block>
            <div>日均支付金额　￥{{merchantTradeStats.amountAvg | moneyFmt}}</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="stats-datum-block">
            <div slot="header">
              <span>订单</span>
            </div>
            <cp-plain-block border-style="solid">{{merchantTradeStats.totalCount}}</cp-plain-block>
            <div>日均订单量　{{merchantTradeStats.countAvg}}</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="trade-ratio-block">
            <div slot="header">
              <el-button-group style="float: right; margin-top: -5px;">
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
              <div v-for="(item, i) in merchantTradeStats.payTypeStats" :key="i">
                <span :style="{color: tradeRatioPayTypeColor[item.payType]}">●</span>
                <span>{{tradeRatioPayTypeLabel[item.payType]}}</span>
                <span>|</span>
                <span>{{item[tradeRatioPayTypeSelect.ratio]}}%</span>
                <span>￥{{item[tradeRatioPayTypeSelect.number] | moneyFmt}}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-card style="margin-top: 20px;" class="underside-block">
        <div slot="header">
          <span>交易趋势</span>
        </div>
        <el-row :gutter="20" style="height: 380px;">
          <el-col :span="15" style="height: 100%;">
            <span class="trade-title">交易额趋势：{{queryDateShow.startDate.format('yyyy-MM-dd')}} ~ {{queryDateShow.endDate.format('yyyy-MM-dd')}}</span>
            <cp-chart :options="tradeTrendChartOptions" ref="trendLineRef"></cp-chart>
          </el-col>
          <el-col :span="9" style="height: 100%;">
            <span class="trade-title">门店交易排行：{{queryDateShow.startDate.format('yyyy-MM-dd')}} ~ {{queryDateShow.endDate.format('yyyy-MM-dd')}}</span>
            <el-table
              :data="merchantStoresTradeStatsData"
              :show-header="false"
              class="shop-trade-rank">
              <el-table-column
                :index="(v) => (merchantStoresTradeStatsPage - 1) * merchantStoresTradeStatsPageSize + (v + 1)"
                type="index">
              </el-table-column>
              <el-table-column
                property="posName">
              </el-table-column>
              <el-table-column
                :formatter="(row, column, cellValue) => $filter.moneyFmt(cellValue)"
                property="totalAmount">
              </el-table-column>
            </el-table>
            <el-pagination
              style="margin-top: 10px; text-align: center;"
              :page-size="merchantStoresTradeStatsPageSize"
              @current-change="merchantStoresTradeStatsFlip"
              :total="merchantStoresTradeStatsList.length || 1"
              layout="prev, pager, next">
            </el-pagination>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'struct-merchant-stats',
  data () {
    const lastDate = this.$util.extentDate('last');
    const moneyFmt = this.$filter.moneyFmt;
    return {
      merchantTradeStats: this.$store.getters.merchantTradeStatsDefault,
      merchantStoresTradeStatsList: this.$store.getters.merchantStoresTradeStatsDefault,
      merchantStoresTradeStatsPage: 1,
      merchantStoresTradeStatsPageSize: 5,
      queryDateExtent: [ new Date(lastDate.start), new Date(lastDate.end) ],
      queryDateShow: {
        startDate: new Date(lastDate.start),
        endDate: new Date(lastDate.end),
      },
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
    if (this.merchant && this.merchant.id) {
      this.queryInfoByDateExtent();
    }
  },
  methods: {
    queryInfoByDateExtent (range) {
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
      // 显示开始日期和结束日期
      this.queryDateShow.startDate = start;
      this.queryDateShow.endDate = end;
      this.queryDateExtent = [ start, end ];
      this.$store.dispatch('merchantTradeStats', {
        merchantId: this.merchant.id,
        payedTimeStart: start.format('yyyy-MM-dd hh:mm:ss'),
        payedTimeEnd: end.format('yyyy-MM-dd hh:mm:ss'),
        paytypestats: '',
      }).then(stats => {
        if (stats) {
          this.merchantTradeStats = stats;
          this.tradeRatioChartData();
        }
      });
      this.$store.dispatch('merchantStoresTradeStatsList', {
        merchantId: this.merchant.id,
        startDate: start.format('yyyy-MM-dd hh:mm:ss'),
        endDate: end.format('yyyy-MM-dd hh:mm:ss'),
      }).then(list => {
        if (list && list.length) {
          this.merchantStoresTradeStatsList = list;
        }
      });
      this.tradeTrendChartData(start, end);
    },
    merchantStoresTradeStatsFlip (currentPage) {
      this.merchantStoresTradeStatsPage = currentPage;
    },
    tradeRatioChartData () {
      const datas = [];
      const stats = this.merchantTradeStats;
      const select = this.tradeRatioPayTypeSelect;
      const color = this.tradeRatioPayTypeColor;
      if (stats && stats.payTypeStats && stats.payTypeStats.length) {
        for (const i in stats.payTypeStats) {
          const payType = stats.payTypeStats[i];
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
    tradeTrendChartData (start, end) {
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
  computed: {
    merchant () {
      return this.$store.state.user.merchant;
    },
    merchantStoresTradeStatsData () {
      const page = this.merchantStoresTradeStatsPage;
      const size = this.merchantStoresTradeStatsPageSize;
      return this.merchantStoresTradeStatsList.slice((page - 1) * size, page * size);
    },
  },
  watch: {
    'merchant.id' (v) {
      this.queryInfoByDateExtent();
    },
  },
};
</script>

<style lang="stylus">
.struct-merchant-stats
  .search-block
    padding 10px 20px
    box-shadow 0 1px 3px 0 rgba(0,0,0,0.12), 0 0 3px 0 rgba(0,0,0,0.04)
    > span
      padding-left 10px
  .upside-block
    .el-card
      height 188px
    .stats-datum-block
      div:last-child
        div:first-child
          font-size 28px
          font-weight bold
          padding-bottom 20px
          min-height 38px
          line-height 38px
        div:last-child
          font-size 14px
          margin-top 10px
          color #606266
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
  .underside-block
    .trade-title
      display inline-block
      margin-left 8px
      font-size 14px
      color #606266
    .shop-trade-rank
      width 100%
      margin-top 20px
      table tr
        td:nth-child(1)
          font-weight bold
        td:nth-child(2)
          color #606266
        td:nth-child(3)
          font-size 18px
          font-weight bold
    .el-pagination
      text-align right
      margin-top 10px
</style>
