<template>
  <div class="cp-plain-block" :style="{
    borderStyle: borderStyle,
    borderTopWidth: selfaspect.top,
    borderBottomWidth: selfaspect.bottom,
    borderLeftWidth: selfaspect.left,
    borderRightWidth: selfaspect.right,
    borderRadius: borderRadius,
    height: selffolded.height,
  }">
    <div class="header-block" v-if="$slots.header">
      <slot name="header" ></slot>
    </div>
    <template v-if="selffolded.available">
      <slot></slot>
      <span @click="foldedTog" class="fold-switch">
        {{selffolded.texts[selffolded.state]}}
        <i :class="selffolded.classs[selffolded.state]"></i>
      </span>
    </template>
    <template v-else>
      <slot></slot>
    </template>
  </div>
</template>

<script>
export default {
  name: 'cp-plain-block',
  data () {
    return {
      selffolded: {
        height: '100%',
        available: this.folded,
        state: 0,
        texts: [ '展开', '收起' ],
        classs: [ 'el-icon-arrow-down', 'el-icon-arrow-up' ],
      },
      selfaspect: {
        bottom: this.aspectDecide('bottom'),
        left: this.aspectDecide('left'),
        right: this.aspectDecide('right'),
        top: this.aspectDecide('top'),
        all: this.aspectDecide('all'),
      },
    };
  },
  mounted () {
    if (!this.folded) {
      this.selffolded.state = 1;
    } else if (this.folded && this.foldedOpen) {
      this.selffolded.state = 1;
    }
    this.foldedHeightTog();
  },
  methods: {
    foldedTog () {
      this.selffolded.state = [ 1, 0 ][this.selffolded.state];
      // 改变高度
      this.foldedHeightTog();
    },
    foldedHeightTog () {
      if (this.foldedHeight !== -1) {
        if (this.selffolded.state === 0) {
          // 收起
          this.selffolded.height = this.foldedHeight + 'px';
        } else {
          // 展开
          this.selffolded.height = '100%';
        }
      }
    },
    borderRadius () {
      const aspect = this.aspect;
      const radius = [];
      if (aspect.indexOf('all') >= 0) {
        return '4px';
      }
      if (aspect.indexOf('top') >= 0 && aspect.indexOf('left') >= 0) {
        radius[0] = '4px';
      } else {
        radius[0] = '0px';
      }
      if (aspect.indexOf('top') >= 0 && aspect.indexOf('right') >= 0) {
        radius[1] = '4px';
      } else {
        radius[1] = '0px';
      }
      if (aspect.indexOf('bottom') >= 0 && aspect.indexOf('right') >= 0) {
        radius[2] = '4px';
      } else {
        radius[2] = '0px';
      }
      if (aspect.indexOf('bottom') >= 0 && aspect.indexOf('left') >= 0) {
        radius[3] = '4px';
      } else {
        radius[3] = '0px';
      }
      return radius.join(' ');
    },
    aspectDecide (str) {
      if (this.aspect.indexOf(str) >= 0 ||
        this.aspect.indexOf('all') >= 0) {
        return '1px';
      } else {
        return '0px';
      }
    },
  },
  props: {
    folded: {
      type: Boolean,
      default: false,
    },
    foldedHeight: {
      type: Number,
      default: -1,
    },
    foldedOpen: {
      type: Boolean,
      default: false,
    },
    borderStyle: {
      type: String,
      default: 'dashed',
      enum: [ 'dashed', 'none', 'solid' ],
    },
    aspect: {
      type: String,
      default: 'bottom',
      enum: [ 'top', 'right', 'bottom', 'left' ],
    },
  },
};
</script>

<style lang="stylus">
.cp-plain-block
  border-width 1px
  border-color #e8e8e8
  position relative
  overflow hidden
  .header-block
    display block
    font-size 16px
    margin-bottom 10px
  .fold-switch
    display inline-block
    position absolute
    right 0
    bottom 0
</style>
