import donorService from '@/services/donations/donor';
import { defineStore } from 'pinia';

export const useDonorStore = defineStore('donor', () => {
  const verifyDonor = async (donorId, documentNumber, documentType) => {
    try {
      const response = await donorService.verifyDonor(donorId, documentNumber, documentType);
      return !response.exists;
    } catch (error) {
      console.error('Error al verificar usuario: ', error);
      return null;
    }
  };
  const getDonor = async (donorId) => {
    try {
      const response = await donorService.getDonor(donorId);
      return response;
    } catch (error) {
      console.error('Error al obtener banco de sangre: ', error);
      return null;
    }
  };

  const newDonor = async (donor) => {
    try {
      await donorService.newDonor(donor);
      return true;
    } catch (error) {
      console.error('Error al crear usuario: ', error);
      return false;
    }
  };

  const editDonor = async (donor) => {
    try {
      await donorService.editDonor(donor);
      return true;
    } catch (error) {
      console.error('Error al crear usuario: ', error);
      return false;
    }
  };

  return {
    getDonor,
    newDonor,
    editDonor,
    verifyDonor
  };
});
