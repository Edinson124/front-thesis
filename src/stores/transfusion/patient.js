import patientService from '@/services/tranfusion/patient';
import { defineStore } from 'pinia';

export const usePatientStore = defineStore('patient', () => {
  const validatePatient = async (documentNumber, documentType) => {
    try {
      const response = await patientService.validatePatient(documentNumber, documentType);
      return response;
    } catch (error) {
      console.error('Error al verificar paciente: ', error);
      return null;
    }
  };

  return {
    validatePatient
  };
});
