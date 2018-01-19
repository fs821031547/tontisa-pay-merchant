<template>
  <transition name="dialog-fade">
    <div class="cp-plain-modal" :style="{ zIndex: zIndex }" v-show="visible" @click.self="(e) => $emit('click', e)">
      <div :style="{ width: contentWidth }">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
import PopupManager from 'element-ui/lib/utils/popup/popup-manager';
export default {
  name: 'cp-plain-modal',
  data () {
    return {
      zIndex: 0,
    };
  },
  mounted () {
    this.zIndex = PopupManager.nextZIndex();
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    contentWidth: {
      type: String,
      default: '50%',
    },
  },
};
</script>

<style lang="stylus">
.cp-plain-modal
  position fixed
  top 0
  right 0
  bottom 0
  left 0
  overflow auto
  margin 0
  > div
    position relative
    margin 20vh auto
</style>
