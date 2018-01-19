<template>
  <div class="cp-chart">
    <div v-chart:chartref></div>
    <object ref="objectToListenser"
      type="text/html"
      data="about:blank"
      style="display: block; height: 0; width: 100%;"></object>
  </div>
</template>

<script>
let event;
let innerWindow;
export default {
  name: 'cp-chart',
  data () {
    return {};
  },
  mounted () {
    const chartref = this.chartref;
    chartref.setOption(this.options);
    const obj = this.$refs.objectToListenser;
    obj.onload = function (evt) {
      innerWindow = this.contentDocument.defaultView;
      let funcHandler;
      event = function () {
        if (funcHandler) {
          clearTimeout(funcHandler);
          funcHandler = null;
        }
        funcHandler = setTimeout(function () {
          chartref.resize();
        }, 50);
      };
      innerWindow.addEventListener('resize', event, false);
    };
  },
  destroyed () {
    if (innerWindow) {
      innerWindow.removeEventListener('resize', event, false);
    }
  },
  methods: {
    repaint (options) {
      const chartref = this.chartref;
      if (options) {
        chartref.setOption(options);
      } else {
        chartref.setOption(this.options);
      }
    },
  },
  props: {
    options: {
      type: Object,
      default: {},
      required: true,
    },
  },
};
</script>

<style lang="stylus">
.cp-chart
  height 100%
  > div
    height 100%
</style>
