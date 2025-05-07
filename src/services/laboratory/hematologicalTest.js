import { post } from '@/api';

const createHematologicalTest = async (hematologicalTest) => {
  try {
    const response = await post(`/hematological-test`, hematologicalTest);
    return response;
  } catch (error) {
    console.error('Error al registrar resultados hematologicos: ', error);
    return null;
  }
};

export default {
  createHematologicalTest
};
