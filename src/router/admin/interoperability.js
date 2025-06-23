import BloodBanksExternal from '@/views/admin/interoperability/BloodBanksExternal.vue';
import EditAuthExternalSytem from '@/views/admin/interoperability/EditAuthExternalSytem.vue';

export default [
  {
    path: '/admin/bbexternal',
    name: 'admin-interoperability-auth',
    component: BloodBanksExternal
  },
  {
    path: '/admin/bbexternal/auth/:id',
    name: 'admin-interoperability-credential',
    component: EditAuthExternalSytem
  }
];
