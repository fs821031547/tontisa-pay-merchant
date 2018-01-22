import Vue from 'vue';
import echart from 'echarts/dist/echarts.common.js';

const plugin = {
  install (_Vue, options) {
    _Vue.prototype.$chart = echart;
  },
};

Vue.use(plugin);

export default echart;
