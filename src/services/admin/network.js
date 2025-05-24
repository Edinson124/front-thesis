import { get, post, put } from '@/api';

const getNetworks = async (filters = {}, page = 0) => {
  try {
    let queryString = new URLSearchParams();
    queryString.append('page', page);

    for (const key in filters) {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        queryString.append(key, filters[key]);
      }
    }

    const response = await get(`/bb-network?${queryString.toString()}`);
    return response;
  } catch (error) {
    console.error('Error al obtener redes de banco de sangre: ', error);
    return [];
  }
};

const newNetwork = async (network) => {
  try {
    const response = await post('/bb-network', network);
    return response;
  } catch (error) {
    console.error('Error al crear red de banco de sangre: ', error);
    return null;
  }
};

const editNetwork = async (network) => {
  try {
    const response = await put(`/bb-network/${network.id}`, network);
    return response;
  } catch (error) {
    console.error('Error al editar red de banco de sangre: ', error);
    return null;
  }
};

const getNetworkById = async (networkId) => {
  try {
    const response = await get(`/bb-network/${networkId}`);
    return response;
  } catch (error) {
    console.error('Error al obtener red de banco de sangre: ', error);
    return null;
  }
};

export default {
  getNetworks,
  newNetwork,
  editNetwork,
  getNetworkById
};
