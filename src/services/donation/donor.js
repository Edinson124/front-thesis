import { post, put } from '@/api';

const getDonor = async (documentNumber, documentType) => {
  try {
    const response = await post(`/donors/search`, { documentNumber, documentType });
    return response;
  } catch (error) {
    console.error('Error al obtener donante: ', error);
    return null;
  }
};

const newDonor = async (donor) => {
  try {
    const response = await post('/donors', donor);
    return response;
  } catch (error) {
    console.error('Error al crear donante: ', error);
    return null;
  }
};

const editDonor = async (donor) => {
  try {
    const response = await put(`/donors/${donor.id}`, donor);
    return response;
  } catch (error) {
    console.error('Error al editar donante: ', error);
    return null;
  }
};
const verifyDonor = async (donorId, documentNumber, documentType) => {
  try {
    const response = await post(`/donors/exists`, { donorId, documentNumber, documentType });
    return response;
  } catch (error) {
    console.error('Error al verificar doante: ', error);
    return null;
  }
};

export default {
  getDonor,
  newDonor,
  editDonor,
  verifyDonor
};
