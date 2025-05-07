import { post } from '@/api';

const createSerologyTest = async (serologyTest) => {
  try {
    const response = await post(`/serology-test`, serologyTest);
    return response;
  } catch (error) {
    console.error('Error al registrar resultados serológicos: ', error);
    return null;
  }
};

export default {
  createSerologyTest
};
