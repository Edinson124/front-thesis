import { post } from '@/api';

const validatePatient = async (documentNumber, documentType) => {
  try {
    const response = await post(`/patient/validate`, { documentNumber, documentType });
    return response.name;
  } catch (error) {
    console.error('Error al obtener nombre del paciente: ', error);
    return null;
  }
};

const verifyPatient = async (documentNumber, documentType) => {
  try {
    const response = await post(`/patient/exists`, { documentNumber, documentType });
    return response;
  } catch (error) {
    console.error('Error al verificar paciente: ', error);
    return null;
  }
};

const getPatient = async (documentNumber, documentType) => {
  try {
    const response = await post(`/patient/search`, { documentNumber, documentType });
    return response;
  } catch (error) {
    console.error('Error al obtener paciente: ', error);
    return null;
  }
};

export default {
  validatePatient,
  verifyPatient,
  getPatient
};
