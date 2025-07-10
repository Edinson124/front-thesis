import { get, patch, post, put } from '@/api';

const getUsers = async (filters = {}, page = 0) => {
  try {
    let queryString = new URLSearchParams();
    queryString.append('page', page);

    for (const key in filters) {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        queryString.append(key, filters[key]);
      }
    }

    const response = await get(`/users/paginated?${queryString.toString()}`);
    return response;
  } catch (error) {
    console.error('Error al obtener usuarios: ', error);
    return [];
  }
};

const getUser = async (userId) => {
  try {
    const response = await get(`/users/${userId}`);
    return response;
  } catch (error) {
    console.error('Error al crear usuario: ', error);
    return null;
  }
};

const verifyUser = async (userId, documentNumber) => {
  try {
    const response = await post(`/users/exists`, { userId, documentNumber });
    return response;
  } catch (error) {
    console.error('Error al verificar usuario: ', error);
    return null;
  }
};

const newUser = async (user) => {
  try {
    const response = await post('/users', user);
    return { success: true, data: response };
  } catch (error) {
    const message = error.message || 'Error al guardar el usuario.';
    return { success: false, error: message };
  }
};

const editUser = async (user) => {
  try {
    const response = await put(`/users/${user.id}`, user);
    return response;
  } catch (error) {
    console.error('Error al editar usuario: ', error);
    return null;
  }
};

const getUserMedicByBloodBank = async (bloodBankId) => {
  try {
    const response = await get(`/users/medic/${bloodBankId}`);
    return response;
  } catch (error) {
    console.error('Error al crear usuario medico de banco de sangre: ', error);
    return null;
  }
};

const getUserRequestByBloodBank = async () => {
  try {
    const response = await get(`/users/medicRequest`);
    return response;
  } catch (error) {
    console.error('Error al obtener usuario medico solicitante: ', error);
    return null;
  }
};

const toogleStatusUser = async (userId) => {
  try {
    const response = await patch(`/users/status/${userId}`);
    return response;
  } catch (error) {
    console.error('Error al cambiar de estado al usuario: ', error);
    return null;
  }
};

export default {
  getUsers,
  verifyUser,
  getUser,
  newUser,
  editUser,
  getUserMedicByBloodBank,
  getUserRequestByBloodBank,
  toogleStatusUser
};
