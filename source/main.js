import Vue from 'vue';
import './extends';
import store from './store';
import App from './app.vue';
import router from './router';
import './components';

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});
