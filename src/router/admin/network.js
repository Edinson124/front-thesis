import Networks from '@/views/admin/network/BloodBankNetworks.vue';
import EditNetwork from '@/views/admin/network/EditNetworkBB.vue';

export default [
  {
    path: '/admin/network',
    name: 'admin-network',
    component: Networks
  },
  {
    path: '/admin/network/new',
    name: 'admin-network-new',
    component: EditNetwork
  },
  {
    path: '/admin/network/:id',
    name: 'admin-network-edit',
    component: EditNetwork
  }
];
