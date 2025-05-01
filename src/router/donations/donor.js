import EditDonor from '@/views/donations/donors/EditDonor.vue';
import SearchDonor from '@/views/donations/donors/SearchDonor.vue';
import ViewDonor from '@/views/donations/donors/ViewDonor.vue';

export default [
  {
    path: '/donation/donor/new',
    name: 'donor-new',
    component: EditDonor
  },
  {
    path: '/donation/donor/search',
    name: 'donor-search',
    component: SearchDonor
  },
  {
    path: '/donation/donor/view',
    name: 'donor-view',
    component: ViewDonor
  }
];
