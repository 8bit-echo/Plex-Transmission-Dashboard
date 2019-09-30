import Vue from 'vue';
import { Application } from './main';

export const AppState = new Vue();

AppState.$on('openModal', payload => {
  Application.$emit('openEmit', payload);
  console.log(payload);
});
