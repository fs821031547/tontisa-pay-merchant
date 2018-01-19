<template>
  <div class="struct-index-menu">
    <div class="index-fold">
      <cp-hamburger @active="v => collapse = v"></cp-hamburger>
    </div>
    <el-menu
      class="index-menu"
      :default-active="active"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :default-openeds="menusOpen"
      :collapse="collapse">
      <template v-for="(menu, k) in menus">
        <el-submenu
          v-if="menu.child"
          :index="menu.name"
          :key="k">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>{{menu.label}}</span>
          </template>
          <template v-for="(child, i) in menu.child">
            <component :key="i" :is="child.meta.render" :menu="child" v-if="child.meta && child.meta.render"></component>
            <el-menu-item 
              v-else
              :index="child.name"
              :key="i"
              @click="menuJump(child)">
              <i class="el-icon-setting"></i>
              <span slot="title">{{child.label}}</span>
            </el-menu-item>
          </template>
        </el-submenu>
        <template v-else>
          <component :key="k" :is="menu.meta.render" :menu="menu" v-if="menu.meta && menu.meta.render"></component>
          <el-menu-item
            v-else
            :index="menu.name"
            :key="k"
            @click="menuJump(menu)">
            <i class="el-icon-setting"></i>
            <span slot="title">{{menu.label}}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import menuMerchantSelect from './menu-merchant-select';
export default {
  name: 'struct-index-menu',
  data () {
    return {
      collapse: false,
      active: '',
      menus: this.$store.state.nav.menusPath,
      menusOpen: this.$store.state.nav.menusOpen,
    };
  },
  mounted () {
    this.active = this.$route.name;
  },
  methods: {
    menuJump (menu) {
      this.active = menu.name;
      this.$store.dispatch('menuJump', menu);
    },
  },
  watch: {
    '$route': function (v) {
      this.active = v.name;
    },
  },
  components: {
    [menuMerchantSelect.name]: menuMerchantSelect,
  },
};
</script>

<style lang="stylus">
.struct-index-menu
  height 100%
  position relative
  .index-fold
    position absolute
    right -20px
  .index-menu
    &:not(.el-menu--collapse)
      width 210px
    height 100%
</style>
