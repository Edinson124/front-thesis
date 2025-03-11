import Login from '@/views/auth/Login.vue';
import Register from '@/views/auth/Register.vue';

export default [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  }
];
