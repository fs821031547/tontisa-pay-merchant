<template>
  <el-container class="page-index">
    <el-aside class="menu-block">
      <struct-index-menu></struct-index-menu>
    </el-aside>
    <el-container>
      <el-header class="head-block">
        <struct-index-head></struct-index-head>
      </el-header>
      <struct-index-tab></struct-index-tab>
      <el-main style="padding: 0;">
        <struct-index-main></struct-index-main>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import menu from '../structures/index/menu.vue';
import head from '../structures/index/head.vue';
import main from '../structures/index/main.vue';
import tab from '../structures/index/tab.vue';

export default {
  name: 'page-index',
  data () {
    return {
    };
  },
  components: {
    [menu.name]: menu,
    [head.name]: head,
    [main.name]: main,
    [tab.name]: tab,
  },
};
</script>

<style lang="stylus">
lefted = 30px
heighted = 60px
.page-index
  height 100%
  .menu-block
    height 100%
    width auto !important
    overflow visible
    .index-fold
      height heighted
      line-height heighted
      right -(lefted)
  .head-block
    line-height heighted
    height heighted
    padding-left lefted
    box-shadow 0 1px 3px 0 rgba(0,0,0,.12),0 0 3px 0 rgba(0,0,0,.04)
</style>
