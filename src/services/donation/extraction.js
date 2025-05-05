import { post } from '@/api';

const createExtraction = async (extraction) => {
  try {
    const response = await post(`/blood-extraction`, extraction);
    return response;
  } catch (error) {
    console.error('Error al registrar extracción: ', error);
    return null;
  }
};

export default {
  createExtraction
};
