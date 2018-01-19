import Vue from 'vue';
import axios from 'axios';

const plugin = {
  install (_Vue, options) {
    _Vue.prototype.$http = axios;
  },
};

Vue.use(plugin);

export default plugin;
