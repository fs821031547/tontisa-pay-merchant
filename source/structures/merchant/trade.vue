<template>
  <div class="struct-merchant-trade like-card in-main-margin">
    <cp-plain-block class="cond-block">
      <el-form :model="queryData" ref="queryForm">
      <el-row class="cond-line" :gutter="10">
        <el-col :span="14">
          <span>收款时间：</span>
          <div style="width: calc(100% - 90px); display: inline-block;">
            <!-- <div class="comb-select-date">
              <el-select v-model="dateType"  placeholder="请选择" size="small">
                <el-option label="" value="1"></el-option>
                <el-option label="" value="2"></el-option>
                <el-option label="" value="3"></el-option>
              </el-select><el-date-picker
                type="daterange"
                align="right"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="small">
              </el-date-picker>
            </div> -->
            <el-form-item style="display: inline-block;" prop="dateRange">
              <el-date-picker
                  type="daterange"
                  align="right"
                  v-model="queryData.dateRange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  size="small">
              </el-date-picker>
            </el-form-item>
            <span>
              <el-button type="text" size="small" @click="changeDateRange('last')">昨日</el-button>
              <el-button type="text" size="small" @click="changeDateRange('seven')">近7天</el-button>
              <el-button type="text" size="small" @click="changeDateRange('thirty')">近30天</el-button>
            </span>
          </div>
        </el-col>
        <el-col :span="10" class="search-block">
          <span>分类查找：</span>
          <el-form-item style="display: inline-block;width: calc(100% - 74px)" prop="search">
            <el-input placeholder="请输入内容" v-model="queryData.search" size="small">
              <el-form-item style="margin-bottom: 0; display: inline-block;" size="small" prop="searchType" slot="prepend">
                <el-select v-model="queryData.searchType" placeholder="请选择">
                  <el-option
                    v-for="(option, i) in searchTypeOptions"
                    :key="i"
                    :label="option.label"
                    :value="option.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="cond-line" :gutter="10">
        <el-col :span="14">
          <div>
            <span>付款状态：</span>
            <el-form-item style="display: inline-block;" prop="status">
            <el-select v-model="queryData.status" placeholder="付款状态" size="small" style="width: 170px;">
              <el-option
                v-for="(option, i) in statusOptions"
                :key="i"
                :label="option.label"
                :value="option.value">
              </el-option>
            </el-select>
            </el-form-item>
          </div>
          <div>
            <span>支付方式：</span>
            <el-form-item style="display: inline-block;" prop="payType">
            <el-select v-model="queryData.payType" placeholder="支付方式" size="small" style="width: 170px;">
              <el-option
                v-for="(option, i) in payTypeOptions"
                :key="i"
                :label="option.label"
                :value="option.value">
              </el-option>
            </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="10">
          <span>金额范围：</span>
          <div style="width: calc(100% - 90); display: inline-block;">
            <el-form-item style="display: inline-block;" prop="minAmount">
            <el-input-number
              :step="500"
              :min="0"
              style="width: calc(50% - 4)"
              v-model="queryData.minAmount"
              size="small">
            </el-input-number>
            </el-form-item>
            <span>-</span>
            <el-form-item style="display: inline-block;" prop="maxAmount">
            <el-input-number
              :step="500"
              :min="0"
              style="width: calc(50% - 4)"
              v-model="queryData.maxAmount"
              size="small">
            </el-input-number>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <div class="oper-block">
        <el-button size="small" @click="$refs.queryForm.resetFields()">重置</el-button>
        <el-button size="small" type="primary" plain @click="gotoSearch">确认</el-button>
      </div>
      </el-form>
    </cp-plain-block>
    <div>
      <div style="height: 40px; line-height: 40px; margin-top: 30px; border: 1px solid #ebeef5; border-radius: 4px; padding: 10px;">
        <span>总收款金额</span>
        <span>￥{{tradeAllAmount | moneyFmt}}</span>
      </div>
        <el-table
          v-loading="tableLoading"
          :data="tradeList"
          border
          style="width: 100%; margin-top: 20px;">
          <el-table-column type="expand">
            <div class="table-row-expand" slot-scope="props">
              <el-row>
                <el-col :span="8"><label>发起时间：</label><span>{{ props.row.payTime || '-'  }}</span></el-col>
                <el-col :span="8"><label>发起人：</label><span>{{ props.row.createUserName || '-'  }}</span></el-col>
                <el-col :span="8"><label>收款账户：</label><span>{{ props.row.accountNumber || '-'  }}</span></el-col>
              </el-row>
              <el-row>
                <el-col :span="8"><label>支付流水号：</label><span>{{ props.row.payNo || '-' }}</span></el-col>
                <el-col :span="8"><label>商品名称：</label><span>{{ props.row.subject || '-' }}</span></el-col>
                <el-col :span="8"><label>设备号：</label><span>{{ props.row.termNo || '-'  }}</span></el-col>
              </el-row>
            </div>
          </el-table-column>
          <el-table-column
            label="序号"
            width="60">
            <span slot-scope="props">{{(props.$index + 1) + ((tradePage.pageNo - 1) * tradePage.pageSize)}}</span>
          </el-table-column>
          <el-table-column
            label="交易流水"
            prop="seqNo"
            width="250">
          </el-table-column>
          <el-table-column
            prop="appStoreName"
            width="260"
            label="收款门店">
          </el-table-column>
          <el-table-column
            prop="status"
            :formatter="statusFormat"
            label="付款状态">
          </el-table-column>
          <el-table-column
            prop="payedTime"
            label="付款时间">
          </el-table-column>
          <el-table-column
            prop="payType"
            :formatter="payTypeFormat"
            label="支付方式">
          </el-table-column>
          <el-table-column
            prop="totalAmount"
            :formatter="totalAmountFormat"
            label="收款金额">
          </el-table-column>
          <el-table-column
            prop="totalAmount"
            :formatter="realAmountFormat"
            label="实收金额">
          </el-table-column>
          <el-table-column
            prop="feeAmount"
            :formatter="feeAmountFormat"
            label="手续费">
          </el-table-column>
        </el-table>
        <div style="margin-top: 10px; text-align: center;">
          <el-pagination
            :page-sizes="[10, 20, 50, 100]"
            :page-size="tradePage.pageSize"
            :current-page="tradePage.pageNo"
            @current-change="tradeChangePageNo"
            @size-change="tradeChangePageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tradePage.totalCount">
          </el-pagination>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'struct-merchant-trade',
  data () {
    const lastDate = this.$util.extentDate('last');
    return {
      tableLoading: false,
      queryData: {
        dateRange: [ new Date(lastDate.start), new Date(lastDate.end) ],
        status: '',
        payType: '',
        searchType: '',
        searchLike: '',
        minAmount: 0,
        maxAmount: 0,
      },
      tradeAllAmount: '-',
      statusOptions: [
        { label: '全部', value: '' },
        { label: '付款成功', value: '1' },
        { label: '等待付款', value: '0' },
        { label: '付款失败', value: '-1' },
      ],
      payTypeOptions: [
        { label: '全部', value: '' },
        { label: '支付宝', value: '1' },
        { label: '微信', value: '2' },
        { label: '银联', value: '3' },
      ],
      searchTypeOptions: [
        { label: '全部', value: '' },
        { label: '交易流水', value: 'seqNo' },
        { label: '收款账户', value: 'accountNumber' },
        { label: '发起人', value: 'createUserName' },
      ],
      tradeList: this.$store.getters.merchantTradeListDefault,
      tradePage: {
        pageNo: 1,
        pageSize: 10,
        totalCount: 1,
      },
    };
  },
  mounted () {
    if (this.merchant && this.merchant.id) {
      this.gotoSearch();
    }
  },
  methods: {
    gotoSearch () {
      // 获取查询数据
      const qd = this.queryData;
      // 生成查询参数
      const query = {
        merchantId: this.merchant.id,
        pageNo: this.tradePage.pageNo,
        pageSize: this.tradePage.pageSize,
      };
      if (qd.dateRange) {
        const firstDate = this.$util.extentDate('today', qd.dateRange[0]);
        const lastDate = this.$util.extentDate('today', qd.dateRange[1]);
        query.payedTimeStart = new Date(firstDate.start).format('yyyy-MM-dd hh:mm:ss');
        query.payedTimeEnd = new Date(lastDate.end).format('yyyy-MM-dd hh:mm:ss');
      }
      if (qd.status) {
        query.status = qd.status;
      }
      if (qd.payType) {
        query.payType = qd.payType;
      }
      if (qd.searchType) {
        query.searchType = qd.searchType;
      }
      if (qd.search) {
        query.search = qd.search;
      }
      if (qd.minAmount) {
        query.minAmount = qd.minAmount;
      }
      if (qd.maxAmount) {
        query.maxAmount = qd.maxAmount;
      }
      this.tableLoading = true;
      // 查询
      this.$store.dispatch('merchantTradeList', query).then(res => {
        if (res) {
          // 设置表格数据
          this.tradeList = res.result;
          const tc = res.totalCount < 1 ? 1 : res.totalCount;
          this.tradePage.totalCount = tc;
        }
        this.tableLoading = false;
      }).catch((err) => {
        this.tableLoading = false;
        throw err;
      });
      this.$store.dispatch('merchantTradeStats', query).then(res => {
        if (res) {
          // 设置表格数据
          this.tradeAllAmount = res.totalAmount;
        }
      });
    },
    tradeChangePageNo (currentPage) {
      this.tradePage.pageNo = currentPage;
      this.gotoSearch();
    },
    tradeChangePageSize (size) {
      this.tradePage.pageSize = size;
      this.gotoSearch();
    },
    changeDateRange (type) {
      if (type) {
        const dateExtent = this.$util.extentDate(type);
        this.queryData.dateRange = [ new Date(dateExtent.start), new Date(dateExtent.end) ];
      }
    },
    statusFormat (row, column, cellValue) {
      for (const i in this.statusOptions) {
        const status = this.statusOptions[i];
        if (status.value === (cellValue + '')) {
          return status.label;
        }
      }
      return '-';
    },
    payTypeFormat (row, column, cellValue) {
      for (const i in this.payTypeOptions) {
        const status = this.payTypeOptions[i];
        if (status.value === (cellValue + '')) {
          return status.label;
        }
      }
      return '-';
    },
    totalAmountFormat (row, column, cellValue) {
      if (cellValue !== '' && cellValue !== null && cellValue !== undefined) {
        return '￥' + this.$filter.moneyFmt(cellValue);
      }
      return '-';
    },
    realAmountFormat (row, column, cellValue) {
      if (cellValue !== '' && cellValue !== null && cellValue !== undefined) {
        const fee = row.feeAmount / 100;
        const money = '￥' + this.$filter.moneyFmt(cellValue - fee);
        return money;
      }
      return '-';
    },
    feeAmountFormat (row, column, cellValue) {
      if (cellValue !== '' && cellValue !== null && cellValue !== undefined) {
        const val = cellValue / 100;
        const money = '￥' + this.$filter.moneyFmt(val);
        // const rate = row.totalAmount > 0 ? val / row.totalAmount : 0;
        return money + '　|　' + (row.tradeFeerate * 100) + '%';
      }
      return '-';
    },
  },
  computed: {
    merchant () {
      return this.$store.state.user.merchant;
    },
  },
  watch: {
    'merchant.id' (v) {
      this.gotoSearch();
    },
  },
};
</script>

<style lang="stylus">
cond-bottom-space = 20px
.struct-merchant-trade
  .cond-block
    position relative
    .cond-line
      font-size 14px
      line-height 40px
      &:nth-of-type(2)
        > div:first-child
          > div
            float left
            margin-right 36px
    .comb-select-date
      display inline-block
      .el-select .el-input__inner
        width 120px
        border-right none
        border-top-right-radius 0 
        border-bottom-right-radius 0
      .el-date-editor
        width 330px
        border-top-left-radius 0 
        border-bottom-left-radius 0
    .search-block
      .el-select .el-input
        width 120px
      .el-form-item__content
        line-height 30px
        &> div > input
          min-width 200px
    .oper-block
      position absolute
      right 0px
      bottom cond-bottom-space
      .el-button + .el-button
        margin-left 5px
  .table-row-expand
    color #909399
    .el-row:nth-of-type(1)
      margin-bottom 20px
.struct-merchant-trade.like-card
  padding 20px
  border 1px solid #ebeef5
  background-color #fff
  box-shadow 0 2px 12px 0 rgba(0,0,0,.1)
  color #303133
  border-radius 4px
  overflow hidden
</style>
