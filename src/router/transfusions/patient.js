import SearchPatient from '@/views/transfusions/patients/SearchPatient.vue';
import ViewPatient from '@/views/transfusions/patients/ViewPatient.vue';

export default [
  {
    path: '/transfusion/patient/search',
    name: 'transfusion-patient-search',
    component: SearchPatient
  },
  {
    path: '/transfusion/patient/:type/:doc',
    name: 'patient-view',
    component: ViewPatient
  }
];
