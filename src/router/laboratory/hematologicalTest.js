import HematologicalTest from '@/views/laboratory/HematologicalTest.vue';
import SearchHematolicTest from '@/views/laboratory/SearchHematolicalTest.vue';
export default [
  {
    path: '/laboratory/hematological/search',
    name: 'laboratory-hematological-search',
    component: SearchHematolicTest
  },
  {
    path: '/laboratory/hematological',
    name: 'laboratory-hematological',
    component: HematologicalTest
  }
];
