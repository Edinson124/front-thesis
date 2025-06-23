import { get, post } from '@/api';

const getAuthExternal = async (id) => {
  try {
    const response = await get(`/auth-external/${id}`);
    return response;
  } catch (error) {
    console.error('Error al obtener credenciales: ', error);
    return null;
  }
};

const saveAuthExternal = async (id, auth) => {
  try {
    const response = await post(`/auth-external/${id}`, auth);
    return response;
  } catch (error) {
    console.error('Error al guardar credenciales: ', error);
    return null;
  }
};

export default {
  getAuthExternal,
  saveAuthExternal
};
