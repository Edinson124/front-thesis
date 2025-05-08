import GetStockUnits from '@/views/storage/GetStockUnits.vue';
import ViewUnit from '@/views/storage/ViewUnit.vue';
export default [
  {
    path: '/units/stock',
    name: 'inventory-stock',
    component: GetStockUnits
  },
  {
    path: '/unit/view',
    name: 'inventory-unit-view',
    component: ViewUnit
  }
];
