import EditPatient from '@/views/transfusions/patients/EditPatient.vue';
import RequestPatient from '@/views/transfusions/patients/RequestPatient.vue';
import SearchPatient from '@/views/transfusions/patients/SearchPatient.vue';
import ViewPatient from '@/views/transfusions/patients/ViewPatient.vue';

export default [
  {
    path: '/transfusion/patient/search',
    name: 'transfusion-patient-search',
    component: SearchPatient
  },
  {
    path: '/transfusion/patient/new',
    name: 'transfusion-patient-new',
    component: EditPatient
  },
  {
    path: '/transfusion/patient/:type/:doc',
    name: 'patient-view',
    component: ViewPatient
  },
  {
    path: '/transfusion/requests',
    name: 'transfusion-request',
    component: RequestPatient
  },
  {
    path: '/transfusion/requests/new',
    name: 'transfusion-request-new',
    component: RequestPatient
  },
  {
    path: '/transfusion/requests/:id',
    name: 'transfusion-request-edit',
    component: RequestPatient
  }
];
