import AppLayout from '@/layout/AppLayout.vue';
import { useAuthStore } from '@/stores/auth';
import { createRouter, createWebHistory } from 'vue-router';

import adminRoutes from './admin';
import authRoutes from './auth';
import donationRoutes from './donations';
import interoperabilityRoutes from './interoperability';
import laboratoryRoutes from './laboratory';
import netwroksRoutes from './networks';
import storageRoutes from './storage';
import templateRoutes from './template';
import transfusionRoutes from './transfusions';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...authRoutes, // rutas públicas como /login

    {
      path: '/',
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'welcome',
          component: () => import('@/views/Welcome.vue')
        },
        {
          path: '/dashboards',
          name: 'dashboards',
          component: () => import('@/views/Dashboard.vue')
        },
        ...adminRoutes,
        ...donationRoutes,
        ...laboratoryRoutes,
        ...storageRoutes,
        ...transfusionRoutes,
        ...netwroksRoutes,
        ...interoperabilityRoutes,
        ...templateRoutes // si aún deseas dejar la ruta /template
      ]
    }
  ]
});

// Middleware de navegación
router.beforeEach((to) => {
  const usersStore = useAuthStore();

  if (to.meta.requiresAuth && !usersStore.isLoggedIn) {
    return { name: 'login' };
  }
});

export default router;
