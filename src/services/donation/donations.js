import { get, post } from '@/api';

const getDonationsByDocumentDonor = async (documentNumber, documentType, page = 0) => {
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
    console.error('Error al obtener última donación del donante: ', error);
    return null;
  }
};
const verifyDonationByCode = async (id) => {
  try {
    const response = await get(`/donation/exists/${id}`);
    return response;
  } catch (error) {
    console.error('Error al verificar donación por código: ', error);
    return null;
  }
};
const verifyDonationByDonor = async (documentNumber, documentType) => {
  try {
    const response = await post(`/donation/exists`, { documentType, documentNumber });
    return response;
  } catch (error) {
    console.error('Error al verificar donación por donante: ', error);
    return null;
  }
};
const getDonation = async (id) => {
  try {
    const response = await get(`/donation/${id}`);
    return response;
  } catch (error) {
    console.error('Error al obtener donación: ', error);
    return null;
  }
};
export default {
  getDonation,
  getDonationsByDocumentDonor,
  newDonation,
  getActualDonation,
  getLastDateDonation,
  verifyDonationByCode,
  verifyDonationByDonor
};
