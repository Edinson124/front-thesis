import { get, patch, post } from '@/api';

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

const newUser = async (user) => {
  try {
    const response = await post('/users', { user });
    return response;
  } catch (error) {
    console.error('Error al crear usuario: ', error);
    return null;
  }
};

const editUser = async (user) => {
  try {
    const response = await post(`/users/${user.id}`, { user });
    return response;
  } catch (error) {
    console.error('Error al editar usuario: ', error);
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
  newUser,
  editUser,
  toogleStatusUser
};
