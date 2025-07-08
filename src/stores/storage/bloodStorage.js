import bloodStorageService from '@/services/storage/bloodStorage';
import { defineStore } from 'pinia';

export const useBloodStorageStore = defineStore('bloodStorage', () => {
  const getBloodStorage = async () => {
    try {
      const response = await bloodStorageService.getBloodStorage();
      return response;
    } catch (error) {
      console.error('Error al obtener blood storage: ', error);
      return false;
    }
  };

  return {
    getBloodStorage
  };
});
