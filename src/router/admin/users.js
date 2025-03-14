import EditUser from '@/views/admin/users/EditUser.vue';
import Users from '@/views/admin/users/Users.vue';

export default [
  {
    path: '/admin/users',
    name: 'admin-users',
    component: Users
  },
  {
    path: '/admin/users/new',
    name: 'admin-users-new',
    component: EditUser
  },
  {
    path: '/admin/users/:id',
    name: 'admin-users-edit',
    component: EditUser
  }
];
