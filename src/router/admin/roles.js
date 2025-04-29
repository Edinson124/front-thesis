import EditRole from '@/views/admin/roles/EditRole.vue';
import Roles from '@/views/admin/roles/Roles.vue';

export default [
  {
    path: '/admin/roles',
    name: 'admin-roles',
    component: Roles
  },
  {
    path: '/admin/roles/:id',
    name: 'admin-roles-edit',
    component: EditRole
  }
];
