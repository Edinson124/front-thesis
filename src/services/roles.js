import { get } from '@/api';

const getRoles = async () => {
  try {
    const response = await get(`/roles`);
    return response;
  } catch (error) {
    console.error('Error al obtener roles: ', error);
    return [];
  }
};

export default {
  getRoles
};
