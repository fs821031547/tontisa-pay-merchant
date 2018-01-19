import echart from 'echarts/dist/echarts.common.js';

import Vue from 'vue';

const plugin = {
  install (_Vue, options) {
    _Vue.prototype.$chart = echart;
  },
};

Vue.use(plugin);

export default echart;
