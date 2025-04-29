import BloodBanks from '@/views/admin/blood-banks/BloodBanks.vue';
import EditBloodBank from '@/views/admin/blood-banks/EditBloodBank.vue';

export default [
  {
    path: '/admin/blood-banks',
    name: 'admin-blood-banks',
    component: BloodBanks
  },
  {
    path: '/admin/blood-banks/:id',
    name: 'admin-blood-banks-edit',
    component: EditBloodBank
  }
];
