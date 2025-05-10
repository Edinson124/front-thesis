import { get } from '@/api';

const getTransfusionsByDocumentPatient = async (documentNumber, documentType, page = 0) => {
  try {
    const query = new URLSearchParams();

    if (documentNumber) query.append('documentNumber', documentNumber);
    if (documentType) query.append('documentType', documentType);
    query.append('page', page);

    const response = await get(`/transfusion/paginated?${query.toString()}`);
    return response;
  } catch (error) {
    console.error('Error al obtener tranfusiones: ', error);
    return null;
  }
};

const getTransfusions = async (filters = {}, page = 0) => {
  try {
    let queryString = new URLSearchParams();
    queryString.append('page', page);

    for (const key in filters) {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        queryString.append(key, filters[key]);
      }
    }

    const response = await get(`/transfusion/request?${queryString.toString()}`);
    return response;
  } catch (error) {
    console.error('Error al obtener tranfusiones: ', error);
    return [];
  }
};

const verifyTransfusionByCode = async (id) => {
  try {
    const response = await get(`/transfusion/exists/${id}`);
    return response;
  } catch (error) {
    console.error('Error al verificar transfusión por código: ', error);
    return null;
  }
};

const getTranfusionDetail = async (id) => {
  try {
    const response = await get(`/transfusion/detail/${id}`);
    return response;
  } catch (error) {
    console.error('Error al obtener detalle de transfusión : ', error);
    return null;
  }
};
export default {
  getTransfusionsByDocumentPatient,
  getTransfusions,
  verifyTransfusionByCode,
  getTranfusionDetail
};
