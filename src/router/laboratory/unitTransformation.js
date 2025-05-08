import UnitsTransformation from '@/views/laboratory/UnitsTransformation.vue';
import ViewUnitTransformation from '@/views/laboratory/ViewUnitTransformation.vue';
export default [
  {
    path: '/laboratory/units/transformation',
    name: 'laboratory-units-transformation',
    component: UnitsTransformation
  },
  {
    path: '/laboratory/unit/transformation',
    name: 'laboratory-unit-transformation',
    component: ViewUnitTransformation
  }
];
