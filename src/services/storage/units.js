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

    const response = await get(`/units/stock?${queryString.toString()}`);
    return response;
  } catch (error) {
    console.error('Error al obtener unitades: ', error);
    return [];
  }
};

const getUnitById = async (idUnit) => {
  try {
    const response = await get(`/units/${idUnit}`);
    return response;
  } catch (error) {
    console.error('Error al obtener unidad: ', error);
    return [];
  }
};

const discardUnit = async (idUnit, reason) => {
  try {
    const response = await put(`/units/discard/${idUnit}`, { reason });
    return response;
  } catch (error) {
    console.error('Error al descartar unidad: ', error);
    return [];
  }
};

const canViewUnit = async (idUnit) => {
  try {
    const response = await get(`/units/view/${idUnit}`);
    return response;
  } catch (error) {
    console.error('Error al verificar unidad: ', error);
    return [];
  }
};

export default {
  getUnits,
  getUnitById,
  discardUnit,
  canViewUnit
};
