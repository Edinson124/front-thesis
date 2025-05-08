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
  const verifyPatient = async (documentNumber, documentType) => {
    try {
      const response = await patientService.verifyPatient(documentNumber, documentType);
      return !response.exists;
    } catch (error) {
      console.error('Error al verificar usuario: ', error);
      return null;
    }
  };

  const getPatient = async (documentNumber, documentType) => {
    try {
      const response = await patientService.getPatient(documentNumber, documentType);
      return response;
    } catch (error) {
      console.error('Error al obtener paciente: ', error);
      return null;
    }
  };

  return {
    validatePatient,
    verifyPatient,
    getPatient
  };
});
