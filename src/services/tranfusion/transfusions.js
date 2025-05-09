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
    console.error('Error al obtener donaciones: ', error);
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
    console.error('Error al obtener unitades en cuarentena: ', error);
    return [];
  }
};
export default {
  getTransfusionsByDocumentPatient,
  getTransfusions
};
