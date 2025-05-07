import Extraction from '@/views/donations/donations/Extraction.vue';
import Interview from '@/views/donations/donations/Interview.vue';
import NewDonation from '@/views/donations/donations/NewDonation.vue';
import PhysicalAssessment from '@/views/donations/donations/PhysicalAssessment.vue';
import Sample from '@/views/donations/donations/Sample.vue';
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
  },
  {
    path: '/donation/interview',
    name: 'donation-interview',
    component: Interview
  },
  {
    path: '/donation/extraction',
    name: 'donation-extraction',
    component: Extraction
  },
  {
    path: '/donation/sample',
    name: 'donation-sample',
    component: Sample
  },
  {
    path: '/donation/physical',
    name: 'donation-physical-exam',
    component: PhysicalAssessment
  }
];
