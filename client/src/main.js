import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './registerServiceWorker';
import store from './store';
import AppError from '@/AppError';
require('./global.scss');
Vue.config.productionTip = false;


/* Custom Error handler */
Vue.config.errorHandler = error => {
  console.log('caught error through vue');
  console.log(error);
  store.commit('LOADING_INDICATOR', false);
  new AppError(error);
};

/* fallback error handler */
window.onerror = (error) => {
  console.log('window caught an error');
  new AppError(error);
}

window.app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
