import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './registerServiceWorker';
import store from './store';
import { deviceType, isPWA } from '@/functions';
require('./global.scss');
Vue.config.productionTip = false;

Vue.config.errorHandler = error => {
  console.log('caught error through vue');
  console.log(error.message);
  store.commit('DISPLAY_NOTIFICATION', {
    display: true,
    level: 'error',
    message: error.message
  });
};

window.onerror = (error) => {
  console.log('window caught an error');
  store.commit('DISPLAY_NOTIFICATION', {
    display: true,
    level: 'error',
    message: error.message
  });
}


if (isPWA() && deviceType() === 'iPhone X') {
  require('./pwa.scss');
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
