import serologyTestService from '@/services/laboratory/serologyTest';
import { defineStore } from 'pinia';

export const useSerologyTestStore = defineStore('serology', () => {
  const createSerologyTest = async (serologyTest) => {
    try {
      const response = await serologyTestService.createSerologyTest(serologyTest);
      return response;
    } catch (error) {
      console.error('Error al registrar resultados serológicos: ', error);
      return null;
    }
  };

  return {
    createSerologyTest
  };
});
