import store from './store';

export default class AppError {
  constructor(error) {
    console.error(error);
    let msg;
    if (typeof error === 'object' && error.message) {
      msg = error.message;
    } else if (typeof error === 'string') {
      msg = error;
    }

    store.commit('DISPLAY_NOTIFICATION', { display: true, level: 'error', message: msg });
  }
}
