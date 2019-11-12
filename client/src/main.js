import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './registerServiceWorker';
import store from './store';
import { deviceType, isPWA } from '@/functions';
require('./global.scss');
Vue.config.productionTip = false;


/* Custom Error handler */
Vue.config.errorHandler = error => {
  console.log('caught error through vue');
  console.log(error);
  store.commit('LOADING_INDICATOR', false);
  store.commit('DISPLAY_NOTIFICATION', {
    display: true,
    level: 'error',
    message: error.message
  });
};

/* fallback error handler */
window.onerror = (error) => {
  console.log('window caught an error');
  store.commit('DISPLAY_NOTIFICATION', {
    display: true,
    level: 'error',
    message: error.message
  });
}

/* PWA specific styles for notched iPhones */
// if (isPWA() && deviceType() === 'iPhone X') {
  require('./pwa.scss');
// }


window.app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
