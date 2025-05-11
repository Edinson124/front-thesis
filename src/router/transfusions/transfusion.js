import PerformedTransfusion from '@/views/transfusions/transfusions/PerformedTransfusion.vue';
import SearchTranfusion from '@/views/transfusions/transfusions/SearchTranfusion.vue';
import Transfusions from '@/views/transfusions/transfusions/Transfusions.vue';
import ViewTransfusion from '@/views/transfusions/transfusions/ViewTransfusion.vue';

export default [
  {
    path: '/transfusion/search',
    name: 'transfusion-search',
    component: Transfusions
  },
  {
    path: '/transfusion/view',
    name: 'transfusion-view',
    component: ViewTransfusion
  },
  {
    path: '/transfusion/search/performed',
    name: 'transfusion-search-performed',
    component: SearchTranfusion
  },
  {
    path: '/transfusion/register/performed',
    name: 'transfusion-register-performed',
    component: PerformedTransfusion
  }
];
