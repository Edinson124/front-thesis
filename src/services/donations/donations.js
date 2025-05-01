import { get } from '@/api';

const getDonations = async (documentNumber, documentType, page = 0) => {
  try {
    const query = new URLSearchParams();

    if (documentNumber) query.append('documentNumber', documentNumber);
    if (documentType) query.append('documentType', documentType);
    query.append('page', page);

    const response = await get(`/donation/paginated?${query.toString()}`);
    return response;
  } catch (error) {
    console.error('Error al obtener donaciones: ', error);
    return null;
  }
};
export default {
  getDonations
};
