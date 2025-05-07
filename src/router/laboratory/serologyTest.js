import SearchSerologyTest from '@/views/laboratory/SearchSerologyTest.vue';
import SerologyTest from '@/views/laboratory/SerologyTest.vue';
export default [
  {
    path: '/laboratory/serology/search',
    name: 'laboratory-serology-search',
    component: SearchSerologyTest
  },
  {
    path: '/laboratory/serology',
    name: 'laboratory-serology',
    component: SerologyTest
  }
];
