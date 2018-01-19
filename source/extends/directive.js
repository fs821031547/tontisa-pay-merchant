import Vue from 'vue';

const plugin = {
  install (_Vue) {
    _Vue.directive('chart', {
      inserted: function (el, bind, vnode) {
        const name = bind.arg;
        const chart = vnode.context.$chart.init(el);
        vnode.context[name] = chart;
      },
    });
  },
};

Vue.use(plugin);

export default plugin;
