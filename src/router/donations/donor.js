import EditDonor from '@/views/donations/donors/EditDonor.vue';
import SearchDonor from '@/views/donations/donors/SearchDonor.vue';
import ViewDonor from '@/views/donations/donors/ViewDonor.vue';
import Interview from '@/views/donations/Interview.vue';

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
    path: '/donation/donor/:type/:doc',
    name: 'donor-view',
    component: ViewDonor
  },
  {
    path: '/donation/interview',
    name: 'donation-interview',
    component: Interview
  }
];
