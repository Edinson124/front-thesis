import authService from '@/services/auth';
import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(getUserFromLocalStorage());
  const token = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const isLoggedIn = computed(() => {
    return !!user.value;
  });

  const login = async (username, password, checked) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await authService.login(username.value, password.value);
      console.log(response);

      if (response && response.username) {
        user.value = response.username;
        // token.value = response.jwt;

        // localStorage.setItem('token', response.jwt);
        localStorage.setItem('user', response.username);
        loading.value = false;
        return true;
      } else {
        error.value = 'Credenciales inválidas.';
        loading.value = false;
        return false;
      }
    } catch (err) {
      error.value = 'Error al iniciar sesión: ' + err.message;
      loading.value = false;
      return false;
    }
  };

  const register = async (username, password, password_confirmed) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await authService.register(username, password, password_confirmed);

      if (response && response.token && response.user) {
        user.value = response.user;
        token.value = response.token;

        // localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        loading.value = false;
        return true;
      } else {
        error.value = 'Credenciales inválidas.';
        loading.value = false;
        return false;
      }
    } catch (err) {
      error.value = 'Error al iniciar sesión: ' + err.message;
      loading.value = false;
      return false;
    }
  };

  const logout = async () => {
    await authService.logout();
    user.value = null;
    token.value = null;
    // localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  watch(
    user,
    (newUser) => {
      localStorage.setItem('user', JSON.stringify(newUser));
    },
    { deep: true }
  );

  function getUserFromLocalStorage() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  return { user, token, loading, error, isLoggedIn, login, register, logout };
});
