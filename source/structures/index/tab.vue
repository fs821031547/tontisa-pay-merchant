<template>
  <el-tabs
    type="card"
    v-model="active"
    @tab-remove="tabClose"
    @tab-click="tabActive"
    class="struct-index-tab">
    <el-tab-pane
      v-for="(v,i) in tabs"
      :key="v"
      :name="v"
      :closable="i === 0 ? false : true"
      :label="menusMap[v].label">
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  name: 'struct-index-tab',
  data () {
    return {
      active: '',
    };
  },
  mounted () {
    this.active = this.menusName[this.$route.name].path;
    this.$store.dispatch('tabAdd', this.active);
  },
  computed: {
    tabs () {
      return this.$store.state.nav.tabs;
    },
    menusMap () {
      return this.$store.state.nav.menusMap;
    },
    menusName () {
      return this.$store.state.nav.menusName;
    },
  },
  methods: {
    tabClose (path) {
      this.$store.dispatch('tabClose', { path, cur: this.active });
    },
    tabActive (comp) {
      const path = comp.name;
      this.$store.dispatch('tabJump', path);
    },
  },
  watch: {
    '$route': function (v) {
      this.active = this.menusName[v.name].path;
    },
  },
};
</script>

<style lang="stylus">
.struct-index-tab
  .el-tabs__header
    margin 0
</style>
