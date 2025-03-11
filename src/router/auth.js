import Login from '@/views/auth/Login.vue';
import Register from '@/views/auth/Register.vue';

export default [
  {
    path: '/login',
    name: 'usuarios',
    component: Login
  },
  {
    path: '/register',
    name: 'usuarios',
    component: Register
  }
];
