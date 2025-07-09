import authService from '@/services/auth';
import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(getUserFromLocalStorage());
  const permissions = ref(getPermissionsFromLocalStorage());
  const bloodBankType = ref(getBloodBankTypeFromLocalStorage());
  const loading = ref(false);
  const error = ref(null);

  const isLoggedIn = computed(() => {
    const sessionTime = localStorage.getItem('session_time');
    const isSessionExpired = Date.now() >= parseInt(sessionTime, 10);
    if (isSessionExpired) {
      logout();
    }
    return !!user.value;
  });

  const login = async (username, password) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await authService.login(username, password);

      if (response && response.username) {
        user.value = response.fullName;

        localStorage.setItem('user', response.username);
        localStorage.setItem('fullName', response.fullName);
        localStorage.setItem('role', response.role);
        localStorage.setItem('session_time', response.session_time?.toString());
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
    permissions.value = [];
    bloodBankType.value = null;
    localStorage.removeItem('user');
    localStorage.removeItem('session_time');
    localStorage.removeItem('fullName');
    localStorage.removeItem('permissions');
    localStorage.removeItem('role');
    localStorage.removeItem('bloodBankName');
    localStorage.removeItem('bloodBankType');
  };

  const mePermission = async () => {
    loading.value = true;
    const response = await authService.me();
    permissions.value = response.permissions;
    if (response && response.permissions) {
      localStorage.setItem('permissions', JSON.stringify(response.permissions));
    }
    if (response && response.bloodBankName) {
      localStorage.setItem('bloodBankName', response.bloodBankName);
    }
    if (response && response.bloodBankType) {
      localStorage.setItem('bloodBankType', response.bloodBankType);
    }
    console.log(response);
    loading.value = false;
    return response;
  };

  watch(
    user,
    (newUser) => {
      if (newUser) {
        localStorage.setItem('fullName', newUser);
      }
    },
    { deep: true }
  );

  function getUserFromLocalStorage() {
    return localStorage.getItem('fullName');
  }
  function getPermissionsFromLocalStorage() {
    const stored = localStorage.getItem('permissions');
    return stored ? JSON.parse(stored) : [];
  }
  function getBloodBankTypeFromLocalStorage() {
    return localStorage.getItem('bloodBankType') || null;
  }
  const hasPermission = (permission) => {
    const perms = permissions.value || [];
    console.log(perms);
    console.log(permission);
    return perms.includes(permission);
  };

  return { user, loading, error, isLoggedIn, permissions, bloodBankType, login, register, logout, mePermission, hasPermission };
});
