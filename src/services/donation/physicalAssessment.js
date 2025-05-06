import { post } from '@/api';

const createPhysical = async (physical) => {
  try {
    const response = await post(`/physical`, physical);
    return response;
  } catch (error) {
    console.error('Error al registrar el examen físico: ', error);
    return null;
  }
};

export default {
  createPhysical
};
