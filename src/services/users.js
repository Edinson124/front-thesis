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

const newUser = async ({ user, roleIds }) => {
  try {
    const response = await post('/users', { user, roleIds });
    return response;
  } catch (error) {
    console.error('Error al crear usuario: ', error);
    return null;
  }
};

const editUser = async ({ user, rolesIds }) => {
  try {
    const response = await put(`/users/${user.id}`, { user, rolesIds });
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
  getUser,
  newUser,
  editUser,
  toogleStatusUser
};
