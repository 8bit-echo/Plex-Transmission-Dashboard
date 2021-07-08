import { Mutations } from './constants';
import { store } from './store';

export default class AppError {
  constructor(error: Error | string) {
    console.error(error);
    let msg;
    if (typeof error === 'object' && error.message) {
      msg = error.message;
    } else if (typeof error === 'string') {
      msg = error;
    }

    store.commit(Mutations.displayNotification, {
      display: true,
      level: 'error',
      message: msg,
    });
  }
}
