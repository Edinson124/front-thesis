import interoperabilityService from '@/services/admin/interoperability';
import { defineStore } from 'pinia';

export const useInteroperabilityStore = defineStore('interoperability', () => {
  const getAuthExternal = async (id) => {
    try {
      const response = await interoperabilityService.getAuthExternal(id);
      return response;
    } catch (error) {
      console.error('Error al obtener credenciales: ', error);
      return false;
    }
  };

  const saveAuthExternal = async (id, auth) => {
    try {
      const response = await interoperabilityService.saveAuthExternal(id, auth);
      return response;
    } catch (error) {
      console.error('Error al guardar credenciales: ', error);
      return false;
    }
  };

  return {
    saveAuthExternal,
    getAuthExternal
  };
});
