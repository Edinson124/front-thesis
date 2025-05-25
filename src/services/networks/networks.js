import { get } from '@/api';

const getNetworks = async (filters = {}, page = 0) => {
  try {
    let queryString = new URLSearchParams();
    queryString.append('page', page);

    for (const key in filters) {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        queryString.append(key, filters[key]);
      }
    }

    const response = await get(`/collaboration/networks?${queryString.toString()}`);
    return response;
  } catch (error) {
    console.error('Error al obtener redes de banco de sangre: ', error);
    return [];
  }
};

const getUnitsStock = async (filters = {}, page = 0) => {
  try {
    let queryString = new URLSearchParams();
    queryString.append('page', page);

    for (const key in filters) {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        queryString.append(key, filters[key]);
      }
    }

    const response = await get(`/collaboration/stock?${queryString.toString()}`);
    return response;
  } catch (error) {
    console.error('Error al obtener unitades: ', error);
    return [];
  }
};

const getOptionsBB = async (networkId) => {
  try {
    const response = await get(`/collaboration/network/${networkId}`);
    return response;
  } catch (error) {
    console.error('Error al obtener red de banco de sangre: ', error);
    return null;
  }
};

export default {
  getNetworks,
  getUnitsStock,
  getOptionsBB
};
