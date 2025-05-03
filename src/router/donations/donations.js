import NewDonation from '@/views/donations/donations/NewDonation.vue';
import SearchDonation from '@/views/donations/donations/SearchDonation.vue';
import SearchDonorDonation from '@/views/donations/donations/SearchDonorNewDonation.vue';
import ViewDonation from '@/views/donations/donations/ViewDonation.vue';

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
  },
  {
    path: '/donation/search',
    name: 'donation-search',
    component: SearchDonation
  },
  {
    path: '/donation/view',
    name: 'donation-view',
    component: ViewDonation
  }
];
