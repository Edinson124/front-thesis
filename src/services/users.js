import { get, post } from '@/api';

const getUsers = async (filters = {}, page = 1) => {
  try {
    let queryString = new URLSearchParams();
    queryString.append('page', page);

    for (const key in filters) {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        queryString.append(key, filters[key]);
      }
    }

    const response = await get(`/users/filter?${queryString.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener usuarios: ', error);
    return [];
  }
};

const newUser = async (user) => {
  try {
    const response = await post('/users', { user });
    return response.data;
  } catch (error) {
    console.error('Error al crear usuario: ', error);
    return null;
  }
};

export default {
  getUsers,
  newUser
};
