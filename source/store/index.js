import Vue from 'vue';
import Vuex from 'vuex';

import user from './user';
import nav from './nav';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    user,
    nav,
  },
});

export default store;
