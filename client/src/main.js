import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './registerServiceWorker';
import store from './store'
require('./global.scss');
Vue.config.productionTip = false;

import {deviceType, isPWA } from '@/functions';

if (isPWA() && deviceType() === 'iPhone X') {
  require('./pwa.scss');
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
