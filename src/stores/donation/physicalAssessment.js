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

  const getPhysicalAssessment = async (donationId) => {
    try {
      const response = await physicalService.getPhysicalAssessment(donationId);
      return response;
    } catch (error) {
      console.error('Error al obtener el examen físico: ', error);
      return null;
    }
  };

  const updatePhysicalAssessment = async (idPhysical, physical) => {
    try {
      const response = await physicalService.updatePhysicalAssessment(idPhysical, physical);
      return response;
    } catch (error) {
      console.error('Error al obtener editar el examen físico: ', error);
      return null;
    }
  };

  return {
    createPhysical,
    getPhysicalAssessment,
    updatePhysicalAssessment
  };
});
