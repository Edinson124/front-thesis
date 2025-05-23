import bloodBanksRoutes from './blood-banks';
import networkRoutes from './network';
import rolesRoutes from './roles';
import usersRoutes from './users';

export default [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/views/Dashboard.vue')
  },
  {
    path: '/admin/variables',
    name: 'admin-variables',
    component: () => import('@/views/admin/GlobalVariables.vue')
  },
  ...usersRoutes,
  ...rolesRoutes,
  ...bloodBanksRoutes,
  ...networkRoutes
];
