import { createApp } from 'vue';
import { store, key } from './store';
import { router } from './router';
import App from './App.vue';
import './global.scss';
import AppError from './AppError';

declare global {
  interface Window {
    app: any;
    onlineCheck: any;
    vpnTimer: any;
    torrentTimer: any;
    sessionTimer: any;
  }
}

/* fallback error handler */
window.onerror = (error) => {
  console.log('window caught an error');
  new AppError(error.toString());
};

let app = createApp(App);
app.config.errorHandler = (error) => {
  console.log('caught error through vue');
  console.log(error);
  store.commit('LOADING_INDICATOR', false);
  new AppError((error as Error).toString());
};

app.use(store, key).use(router).mount('#app');
