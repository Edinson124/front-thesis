import { get, post, put } from '@/api';

const getDonor = async (donorId) => {
  try {
    const response = await get(`/donors/${donorId}`);
    return response;
  } catch (error) {
    console.error('Error al crear banco de sangre: ', error);
    return null;
  }
};

const newDonor = async (donor) => {
  try {
    const response = await post('/donors', donor);
    return response;
  } catch (error) {
    console.error('Error al crear usuario: ', error);
    return null;
  }
};

const editDonor = async (donor) => {
  try {
    const response = await put(`/donors/${donor.id}`, donor);
    return response;
  } catch (error) {
    console.error('Error al editar usuario: ', error);
    return null;
  }
};
const verifyDonor = async (donorId, documentNumber, documentType) => {
  try {
    const response = await post(`/donors/exists`, { donorId, documentNumber, documentType });
    return response;
  } catch (error) {
    console.error('Error al verificar usuario: ', error);
    return null;
  }
};

export default {
  getDonor,
  newDonor,
  editDonor,
  verifyDonor
};
