import usersRoutes from './users';

export default [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/views/Dashboard.vue')
  },
  {
    path: '/admin/variables',
    name: 'configuración variables',
    component: () => import('@/views/admin/GlobalVariables.vue')
  },
  {
    path: '/admin/bancos',
    name: 'bancos de sangre',
    component: () => import('@/views/admin/BloodBanks.vue')
  },
  {
    path: '/admin/redes',
    name: 'redes',
    component: () => import('@/views/admin/BloodBankNetworks.vue')
  },
  ...usersRoutes
];
