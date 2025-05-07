import { get, post } from '@/api';

const createHematologicalTest = async (hematologicalTest) => {
  try {
    const response = await post(`/hematological-test`, hematologicalTest);
    return response;
  } catch (error) {
    console.error('Error al registrar resultados hematologicos: ', error);
    return null;
  }
};

const getHematologicalTestByDonationId = async (donationId) => {
  try {
    const response = await get(`/hematological-test/${donationId}`);
    return response;
  } catch (error) {
    console.error('Error al obtener resultados hematologicos: ', error);
    return null;
  }
};

export default {
  createHematologicalTest,
  getHematologicalTestByDonationId
};
