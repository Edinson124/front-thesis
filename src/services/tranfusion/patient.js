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

export default {
  validatePatient
};
