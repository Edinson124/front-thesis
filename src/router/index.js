import AppLayout from '@/layout/AppLayout.vue';
import { useAuthStore } from '@/stores/auth';
import { createRouter, createWebHistory } from 'vue-router';
import adminRoutes from './admin';
import authRoutes from './auth';
import donationRoutes from './donations';
import templateRoutes from './template';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...authRoutes,
    {
      path: '/',
      component: AppLayout,
      children: adminRoutes,
      meta: { requiresAuth: true }
    },
    {
      path: '/',
      component: AppLayout,
      children: donationRoutes,
      meta: { requiresAuth: true }
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

// eslint-disable-next-line no-unused-vars
router.beforeEach((to, from) => {
  const usersStore = useAuthStore();

  if (to.meta.requiresAuth && !usersStore.isLoggedIn) {
    return { name: 'login' };
  }
});

export default router;
