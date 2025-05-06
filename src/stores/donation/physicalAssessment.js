import physicalService from '@/services/donation/physicalAssessment';
import { defineStore } from 'pinia';

export const usePhysicalStore = defineStore('physical', () => {
  const createPhysical = async (physical) => {
    try {
      const response = await physicalService.createPhysical(physical);
      return response;
    } catch (error) {
      console.error('Error al registrar el examen físico: ', error);
      return null;
    }
  };

  return {
    createPhysical
  };
});
