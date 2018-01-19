<template>
  <div class="struct-index-head">
    <div class="nav-block" v-bind="marchant">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          :to="navGoto(n)"
          :key="i"
          v-for="(n, i) in navs">
          {{navLabel(n)}}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="user-block">
      <el-dropdown @command="dropdownSelect">
        <div class="avatar-block">
          <div>
            <cp-avatar
              :src="user.headImg"
              size="large">
            </cp-avatar>
          </div>
          <div>
            {{user.nickname}}<i class="el-icon-arrow-down el-icon--right"></i>
          </div>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="user">
            <i class="anticon-user"></i>
            用户中心
          </el-dropdown-item>
          <el-dropdown-item command="logout">
            <i class="anticon-logout"></i>
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: 'struct-index-head',
  data () {
    return {
      merchantMark: null,
      menusName: this.$store.state.nav.menusName,
    };
  },
  mounted () {
    this.$store.dispatch('navShow', { path: this.$route.path, name: this.$route.name });
  },
  watch: {
    '$route': function (v) {
      this.$store.dispatch('navShow', { path: v.path, name: v.name });
    },
  },
  methods: {
    navGoto (menu) {
      return { name: menu.name, params: this.$route.params };
    },
    navLabel (menu) {
      if (menu.name === 'merchant_select') {
        this.merchantMark = menu;
      }
      return menu.label;
    },
    dropdownSelect (item) {
      switch (item) {
        case 'user':
          this.$store.dispatch('menuJump', this.menusName[item]);
          break;
        case 'logout':
          this.$store.dispatch('userSignout');
          break;
        default:
          break;
      }
    },
  },
  computed: {
    user () {
      return this.$store.state.user.user || {};
    },
    navs () {
      return this.$store.state.nav.navs;
    },
    marchant () {
      if (this.merchantMark) {
        this.$store.dispatch('merchantName', this.$route.params.id).then((name) => {
          if (name) this.merchantMark.label = name;
        });
      }
      return this.$store.state.user.merchant;
    },
  },
};
</script>

<style lang="stylus">
.struct-index-head
  height 100%
  .nav-block
    float left
    margin 24px 0 0 20px
  .user-block
    height 100%
    float right
  .avatar-block
    > div
      float left 
    > div:first-child
      height 40px 
      margin 10px 10px 0 0
</style>
