import { get, post, put } from '@/api';

const createExtraction = async (extraction) => {
  try {
    const response = await post(`/blood-extraction`, extraction);
    return response;
  } catch (error) {
    console.error('Error al registrar extracción: ', error);
    return null;
  }
};

const getExtraction = async (donationId) => {
  try {
    // const answer = JSON.stringify(answerObject);
    const response = await get(`/blood-extraction/${donationId}`);
    return response;
  } catch (error) {
    console.error('Error al obtener la extracción: ', error);
    return null;
  }
};

const updateExtraction = async (idExtraction, extraction) => {
  try {
    // const answer = JSON.stringify(answerObject);
    const response = await put(`/blood-extraction/${idExtraction}`, extraction);
    return response;
  } catch (error) {
    console.error('Error al actualizar la extracción: ', error);
    return null;
  }
};

export default {
  createExtraction,
  getExtraction,
  updateExtraction
};
