import AppLayout from '@/layout/AppLayout.vue';
import { useAuthStore } from '@/stores/auth';
import { createRouter, createWebHistory } from 'vue-router';
import adminRoutes from './admin';
import authRoutes from './auth';
import templateRoutes from './template';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: adminRoutes,
      meta: { requiresAuth: true }
    },
    ...authRoutes,
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
