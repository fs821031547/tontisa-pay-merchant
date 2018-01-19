<template>
  <div :style="{ overflow: 'hidden' }" ref="container">
    <div :style="{
        width: (amount*slideWidth) + 'px',
        transition: 'transform 500ms ease 0s',
        transform: 'translate3d(' + position + 'px, 0px, 0px)',
      }">
      <div v-for="i in amount" :key="i"
        :style="{
          width: slideWidth + 'px',
          height: 'auto',
          left: '0px',
          float: 'left',
        }">
        <slot :name="i"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'cp-slide',
  data () {
    return {
      slideWidth: 100,
      position: 0,
      curActive: this.active,
    };
  },
  mounted () {
    const width = this.$refs.container.clientWidth;
    this.slideWidth = width;
  },
  methods: {
    togActive (v) {
      // 滑动slide
      if (v > this.curActive && (v < this.amount)) {
        // 向后滑动
        this.position -= this.slideWidth;
        this.curActive = v;
      } else if (v >= 0 && v < this.curActive) {
        this.position += this.slideWidth;
        this.curActive = v;
      }
    },
  },
  watch: {
    active (v) {
      this.togActive(v);
    },
    '$refs.container.clientWidth' (v) {
      this.slideWidth = v;
    },
  },
  props: {
    amount: {
      type: Number,
      default: 1,
    },
    active: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style lang="stylus">
</style>
