import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
import adminRoutes from './admin';
import authRoutes from './auth';
import templateRoutes from './template';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...authRoutes,
    {
      path: '/',
      component: AppLayout,
      children: adminRoutes
    },
    /**
     * TODO: Borrar rutas de la plantilla
     */
    {
      path: '/template',
      component: AppLayout,
      children: templateRoutes
    }
  ]
});

export default router;
