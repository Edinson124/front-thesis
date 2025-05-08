import donorService from '@/services/donation/donor';
import { defineStore } from 'pinia';

export const useDonorStore = defineStore('donor', () => {
  const verifyDonor = async (donorId, documentNumber, documentType) => {
    try {
      const response = await donorService.verifyDonor(donorId, documentNumber, documentType);
      return !response.exists;
    } catch (error) {
      console.error('Error al verificar donante: ', error);
      return null;
    }
  };
  const getDonor = async (documentNumber, documentType) => {
    try {
      const response = await donorService.getDonor(documentNumber, documentType);
      return response;
    } catch (error) {
      console.error('Error al obtener donante: ', error);
      return null;
    }
  };

  const newDonor = async (donor) => {
    try {
      await donorService.newDonor(donor);
      return true;
    } catch (error) {
      console.error('Error al crear donante: ', error);
      return false;
    }
  };

  const editDonor = async (donor) => {
    try {
      await donorService.editDonor(donor);
      return true;
    } catch (error) {
      console.error('Error al editar donante: ', error);
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
