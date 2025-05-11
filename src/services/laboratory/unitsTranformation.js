import { get, post, put } from '@/api';

const getUnits = async (filters = {}, page = 0) => {
  try {
    let queryString = new URLSearchParams();
    queryString.append('page', page);

    for (const key in filters) {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        queryString.append(key, filters[key]);
      }
    }

    const response = await get(`/units/transformation?${queryString.toString()}`);
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

const getUnitsFromUnit = async (idUnit) => {
  try {
    const response = await get(`/units/transformation/get/${idUnit}`);
    return response;
  } catch (error) {
    console.error('Error al obtener unidades: ', error);
    return null;
  }
};

const saveUnit = async (unitId, unit) => {
  try {
    const response = await post(`/units/transformation/save/${unitId}`, unit);
    return response;
  } catch (error) {
    console.error('Error al registrar unidad: ', error);
    return null;
  }
};

const editTableUnit = async (unitId, unit) => {
  try {
    const response = await put(`/units/edit/${unitId}`, unit);
    return response;
  } catch (error) {
    console.error('Error al editar unidad: ', error);
    return null;
  }
};

export default {
  getUnits,
  getUnitById,
  getUnitsFromUnit,
  saveUnit,
  editTableUnit
};
