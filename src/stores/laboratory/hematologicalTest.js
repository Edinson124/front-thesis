import hematologicalTestService from '@/services/laboratory/hematologicalTest';
import { defineStore } from 'pinia';

export const useHematologicalTestStore = defineStore('hematologic', () => {
  const createhematologicalTest = async (hematologicalTest) => {
    try {
      const response = await hematologicalTestService.createHematologicalTest(hematologicalTest);
      return response;
    } catch (error) {
      console.error('Error al registrar resultados hematológicas: ', error);
      return null;
    }
  };
  const getHematologicalTestByDonationId = async (donationId) => {
    try {
      const response = await hematologicalTestService.getHematologicalTestByDonationId(donationId);
      return response;
    } catch (error) {
      console.error('Error al obtener resultados hematológicas: ', error);
      return null;
    }
  };

  return {
    createhematologicalTest,
    getHematologicalTestByDonationId
  };
});
