import { createRouter, createWebHistory } from 'vue-router';
import Search from '../views/Search.vue';
import Dashboard from '../views/Dashboard.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/index.html',
      component: Search,
    },
    {
      path: '/',
      component: Search,
    },
    {
      path: '/dashboard',
      component: Dashboard,
    },
  ],
});

export { router };
