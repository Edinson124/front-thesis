import { get, patch } from '@/api';

const getGroupedGlobalVariables = async () => {
  try {
    const response = await get(`/variables/grouped`);
    return response;
  } catch (error) {
    console.error('Error al obtener roles: ', error);
    return [];
  }
};

const updateVariable = async (id, value) => {
  try {
    return await patch(`/variables/${id}`, { value });
  } catch (error) {
    console.error('Error al actualizar variable: ', error);
    throw error;
  }
};

export default {
  updateVariable,
  getGroupedGlobalVariables
};
