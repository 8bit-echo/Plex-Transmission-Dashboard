import Vue from 'vue';
import App from './App.vue';
import { AppState } from './AppState';

Vue.config.productionTip = false;

window.AppState = AppState;

export const Application = new Vue({
  render: h => h(App)
}).$mount('#app');
