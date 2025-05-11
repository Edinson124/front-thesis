import { get, put } from '@/api';

const getUnits = async (filters = {}, page = 0) => {
  try {
    let queryString = new URLSearchParams();
    queryString.append('page', page);

    for (const key in filters) {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        queryString.append(key, filters[key]);
      }
    }

    const response = await get(`/units/quarantined?${queryString.toString()}`);
    return response;
  } catch (error) {
    console.error('Error al obtener unitades en cuarentena: ', error);
    return [];
  }
};

const unitSuitable = async (unitId) => {
  try {
    const response = await put(`/units/quarantined/unitSuitable/${unitId}`);
    return response;
  } catch (error) {
    console.error('Error al cambiar de estado a la unidad: ', error);
    return null;
  }
};

export default {
  getUnits,
  unitSuitable
};
