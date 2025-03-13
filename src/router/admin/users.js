import Users from '@/views/admin/users/Users.vue';

export default [
  {
    path: '/admin/users',
    name: 'admin-usuarios',
    component: Users
  },
  {
    path: '/admin/users/new',
    name: 'admin-usuarios-nuevo',
    component: Users
  },
  {
    path: '/admin/users/:id',
    name: 'admin-usuarios-editar',
    component: Users
  }
];
