import { get, post } from '@/api';

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

const newDonation = async (donation) => {
  try {
    const response = await post(`/donation`, donation);
    const donationId = response?.payload?.id ?? null;
    return donationId;
  } catch (error) {
    console.error('Error al obtener donaciones: ', error);
    return null;
  }
};

const getActualDonation = async (documentNumber, documentType) => {
  try {
    const response = await post(`/donation/actual`, { documentType, documentNumber });
    return response;
  } catch (error) {
    console.error('Error al obtener donación actual del donante: ', error);
    return null;
  }
};
const getLastDateDonation = async (documentNumber, documentType) => {
  try {
    const response = await post(`/donation/last/date`, { documentType, documentNumber });
    return response;
  } catch (error) {
    console.error('Error al obtener donación actual del donante: ', error);
    return null;
  }
};
export default {
  getDonations,
  newDonation,
  getActualDonation,
  getLastDateDonation
};
