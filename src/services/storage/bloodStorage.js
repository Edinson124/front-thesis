import { get } from '@/api';

const getBloodStorage = async () => {
  try {
    const response = await get(`/blood-storage`);
    return response;
  } catch (error) {
    console.error('Error al obtener blood storage: ', error);
    return null;
  }
};
export default {
  getBloodStorage
};
