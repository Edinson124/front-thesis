import { get, post, put } from '@/api';

const createPhysical = async (physical) => {
  try {
    const response = await post(`/physical`, physical);
    return response;
  } catch (error) {
    console.error('Error al registrar el examen físico: ', error);
    return null;
  }
};

const getPhysicalAssessment = async (donationId) => {
  try {
    // const answer = JSON.stringify(answerObject);
    const response = await get(`/physical/${donationId}`);
    return response;
  } catch (error) {
    console.error('Error al obtener el examen físico: ', error);
    return null;
  }
};

const updatePhysicalAssessment = async (idPhysical, physical) => {
  try {
    // const answer = JSON.stringify(answerObject);
    const response = await put(`/physical/${idPhysical}`, physical);
    return response;
  } catch (error) {
    console.error('Error al obtener el examen físico: ', error);
    return null;
  }
};

export default {
  createPhysical,
  getPhysicalAssessment,
  updatePhysicalAssessment
};
