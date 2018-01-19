import Vue from 'vue';

const obj = {};

import(/* webpackChunkName: "echarts.common" */ 'echarts/dist/echarts.common.js').then(echart => {
  obj.echart = echart;
  const plugin = {
    install (_Vue, options) {
      _Vue.prototype.$chart = echart;
    },
  };

  Vue.use(plugin);
});

export default obj;
