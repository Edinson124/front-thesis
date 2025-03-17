import { get } from '@/api';

const getDepartments = async () => {
  try {
    const response = await get('/ubication');
    return response;
  } catch (error) {
    console.error('Error al obtener departamentos: ', error);
    return [];
  }
};

const getProvinces = async (department) => {
  try {
    const response = await get(`/ubication/${department}`);
    return response;
  } catch (error) {
    console.error('Error al obtener provincias: ', error);
    return [];
  }
};

const getDistritos = async (department, provincie) => {
  try {
    const response = await get(`/ubication/${department}/${provincie}`);
    return response;
  } catch (error) {
    console.error('Error al obtener distritos: ', error);
    return [];
  }
};

export default {
  getDepartments,
  getProvinces,
  getDistritos
};
