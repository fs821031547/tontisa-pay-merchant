<template>
  <span class="cp-avatar" :class="showClass">
    <i :class="selficon" v-if="show === 0"></i>
    <img :src="selfsrc" v-else-if="show === 1">
    <span v-else>
      <slot></slot>
    </span>
  </span>
</template>

<script>
export default {
  name: 'cp-avatar',
  data () {
    return {
      show: 0,
      showClass: '',
      selfsrc: this.src,
      selficon: this.icon,
      selfsize: this.size,
      selfshape: this.shape,
    };
  },
  mounted () {
    if (this.selficon) {
      this.show = 0;
    } else if (this.selfsrc) {
      this.show = 1;
    } else if (this.$slots.default) {
      this.show = 2;
    } else {
      this.selficon = 'anticon-user';
      this.show = 0;
    }
    if (this.selfsize) {
      this.showClass = this.selfsize;
    }
    if (this.selfshape) {
      if (this.showClass) {
        this.showClass = this.showClass + ' ' + this.selfshape;
      } else {
        this.showClass = this.selfshape;
      }
    }
  },
  watch: {
    src (v) {
      if (v) {
        this.selfsrc = v;
        if (this.show !== 1) {
          this.show = 1;
        }
      }
    },
  },
  props: {
    size: {
      type: String,
      default: '',
      enum: [ 'large', 'small', 'huge', 'giant' ],
    },
    shape: {
      type: String,
      default: '',
      enum: [ 'square' ],
    },
    icon: {
      type: String,
      default: '',
    },
    src: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="stylus">
.cp-avatar
  font-size 18px
  line-height 1.5
  color rgba(0, 0, 0, 0.65)
  box-sizing border-box
  margin 0
  padding 0
  list-style none
  display inline-block
  text-align center
  background #ccc
  color #fff
  white-space nowrap
  position relative
  overflow hidden
  width 32px
  height 32px
  line-height 32px
  border-radius 16px
  > img
    vertical-align middle
    border-style none
    width 100%
    height 100%
    display block
.cp-avatar.giant
  width 80px
  height 80px
  line-height 72px
  border-radius 40px
  font-size 46px
.cp-avatar.huge
  width 64px
  height 64px
  line-height 64px
  border-radius 32px
  font-size: 36px
.cp-avatar.large
  width 40px
  height 40px
  line-height 40px
  border-radius 20px
  font-size: 24px
.cp-avatar.small
  width 24px
  height 24px
  line-height 24px
  border-radius 12px
  font-size 14px
.cp-avatar.square
  border-radius 4px
</style>
