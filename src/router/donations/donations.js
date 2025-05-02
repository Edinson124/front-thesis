import NewDonation from '@/views/donations/donations/NewDonation.vue';
import SearchDonorDonation from '@/views/donations/donations/SearchDonorDonation.vue';

export default [
  {
    path: '/donation/search/donor',
    name: 'donation-search-donor',
    component: SearchDonorDonation
  },
  {
    path: '/donation/new/:type/:doc',
    name: 'donation-new',
    component: NewDonation
  }
];
