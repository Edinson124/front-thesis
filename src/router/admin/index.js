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
  {
    path: '/admin/bancos',
    name: 'admin-bancos',
    component: () => import('@/views/admin/BloodBanks.vue')
  },
  {
    path: '/admin/redes',
    name: 'admin-redes',
    component: () => import('@/views/admin/BloodBankNetworks.vue')
  },
  ...usersRoutes
];
