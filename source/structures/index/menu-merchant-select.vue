<template>
  <div class="struct-index-menu-merchant-select">
    <el-popover
      ref="popovered"
      placement="right"
      title="选择商户"
      width="200"
      popper-class="struct-index-menu-merchant-select-propper-block"
      trigger="hover"
      :visible-arrow="false">
      <el-menu
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        style="border-right: 0;"
        :default-active="active">
        <el-menu-item
          @click="merchantChoice(merchant)"
          :key="i"
          :index="'merchant-' + merchant.id"
          :title="merchant.licenseName"
          v-for="(merchant,i) in merchants">
          {{merchant.licenseName}}
        </el-menu-item>
      </el-menu>
    </el-popover>
    <el-menu-item-group v-popover:popovered>
      <span slot="title" :title="merchant.licenseName">{{merchant.licenseName}}</span>
    </el-menu-item-group>
  </div>
</template>

<script>
export default {
  name: 'struct-index-menu-merchant-select',
  data () {
    return {
      menusName: this.$store.state.nav.menusName,
      active: '',
    };
  },
  created () {
    const merchantId = this.$route.params.id;
    if (!this.merchant) {
      this.merchantChoice({ id: merchantId });
    } else {
      this.active = 'merchant-' + merchantId;
    }
  },
  mounted () {
  },
  computed: {
    merchant () {
      return this.$store.state.user.merchant;
    },
    merchants () {
      return this.$store.state.user.merchants;
    },
    merchantsMap () {
      return this.$store.state.user.merchantsMap;
    },
  },
  watch: {
    merchant (v) {
      this.$nextTick(() => {
        this.active = 'merchant-' + v.id;
      });
    },
  },
  methods: {
    merchantChoice (merchant, menu) {
      if (!menu) {
        if (this.menu.redirect && this.menusName[this.menu.redirect.name]) {
          menu = this.menusName[this.menu.redirect.name];
        } else {
          menu = this.menu;
        }
      }
      return this.$store.dispatch('merchantChoice', { menu, merchant });
    },
  },
  props: {
    menu: {
      type: Object,
    },
  },
};
</script>

<style lang="stylus">
.struct-index-menu-merchant-select
  .el-menu-item-group
    .el-menu-item-group__title
      white-space nowrap
      text-overflow ellipsis
      overflow hidden
.struct-index-menu-merchant-select-propper-block
  border-radius 0px
  background-color #545c64
  padding 0
  > div
    color #909399
    font-size 14px
    height 16px
    line-height 16px
    padding 8px
    margin-bottom 0
  >li
    list-style none
  .el-menu-item
      white-space nowrap
      text-overflow ellipsis
      overflow hidden
</style>
