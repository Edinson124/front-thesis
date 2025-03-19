import { get } from '@/api';

const getGroupedGlobalVariables = async () => {
  try {
    const response = await get(`/variables/grouped`);
    return response;
  } catch (error) {
    console.error('Error al obtener roles: ', error);
    return [];
  }
};

export default {
  getGroupedGlobalVariables
};
