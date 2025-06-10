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

const unitSuitable = async (unitId, stamp) => {
  try {
    const response = await put(`/units/quarantined/unitSuitable/${unitId}/${stamp}`);
    return response;
  } catch (error) {
    console.error('Error al cambiar de estado a la unidad: ', error);
    return null;
  }
};

const discardUnit = async (unitId, reason) => {
  try {
    const response = await put(`/units/quarantined/discard/${unitId}`, { reason });
    return response;
  } catch (error) {
    console.error('Error al descartar la unidad: ', error);
    return null;
  }
};

const verifyStamp = async (stampNumber) => {
  try {
    const response = await get(`/units/verify/stamp//${stampNumber}`);
    return response;
  } catch (error) {
    console.error('Error al descartar la unidad: ', error);
    return null;
  }
};

export default {
  getUnits,
  unitSuitable,
  discardUnit,
  verifyStamp
};
