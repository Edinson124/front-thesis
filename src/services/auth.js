import { post } from '@/api';

const login = async (username, password) => {
  try {
    const response = await post('/auth/login', { username, password });
    return response;
  } catch (error) {
    console.error('Error en login: ', error);
    return null;
  }
};

const register = async (username, password, password_confirmed) => {
  try {
    const response = await post('/auth/sing-up', { username, password, password_confirmed });
    return response.data;
  } catch (error) {
    console.error('Error en login: ', error);
    return null;
  }
};

const logout = async () => {
  await post('/auth/logout');
};

export default {
  login,
  register,
  logout
};
