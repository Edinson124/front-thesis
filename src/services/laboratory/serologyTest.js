import { get, post } from '@/api';

const createSerologyTest = async (serologyTest) => {
  try {
    const response = await post(`/serology-test`, serologyTest);
    return response;
  } catch (error) {
    console.error('Error al registrar resultados serológicos: ', error);
    return null;
  }
};

const getSerologyTestByDonationId = async (donationId) => {
  try {
    const response = await get(`/serology-test/${donationId}`);
    return response;
  } catch (error) {
    console.error('Error al obtener resultados serológicos: ', error);
    return null;
  }
};
export default {
  createSerologyTest,
  getSerologyTestByDonationId
};
