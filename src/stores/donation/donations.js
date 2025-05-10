import donationService from '@/services/donation/donations';
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

export const useDonationStore = defineStore('donation', () => {
  const donationsByDonor = reactive([]);
  const totalRecordsDonationsByDonor = ref(0);
  const currentPageDonationsByDonor = ref(0);
  const getDonationsByDocumentDonor = async (documentNumber, documentType, page = 0) => {
    try {
      const response = await donationService.getDonationsByDocumentDonor(documentNumber, documentType, page);
      donationsByDonor.splice(0, donationsByDonor.length, ...response.content);
      totalRecordsDonationsByDonor.value = response.totalElements;
      currentPageDonationsByDonor.value = page;
      return true;
    } catch (error) {
      console.error('Error al obtener donaciones: ', error);
      return null;
    }
  };

  const newDonation = async (donation) => {
    try {
      const response = await donationService.newDonation(donation);
      return response;
    } catch (error) {
      console.error('Error al crear una donación: ', error);
      return null;
    }
  };

  const getActualDonation = async (documentNumber, documentType) => {
    try {
      const response = await donationService.getActualDonation(documentNumber, documentType);
      return response;
    } catch (error) {
      console.error('Error al obtener donación actual del donante: ', error);
      return null;
    }
  };

  const getLastDateDonation = async (documentNumber, documentType) => {
    try {
      const response = await donationService.getLastDateDonation(documentNumber, documentType);
      return response;
    } catch (error) {
      console.error('Error al obtener donación actual del donante: ', error);
      return null;
    }
  };
  const verifyDonationByCode = async (id) => {
    try {
      const response = await donationService.verifyDonationByCode(id);
      return response;
    } catch (error) {
      console.error('Error al verificar donación: ', error);
      return null;
    }
  };

  const verifyDonationByDonor = async (documentNumber, documentType) => {
    try {
      const response = await donationService.verifyDonationByDonor(documentNumber, documentType);
      return response;
    } catch (error) {
      console.error('Error al verificar donación: ', error);
      return null;
    }
  };
  const getDonation = async (donation) => {
    try {
      const response = await donationService.getDonation(donation);
      return response;
    } catch (error) {
      console.error('Error al obtener una donación: ', error);
      return null;
    }
  };

  return {
    donationsByDonor,
    totalRecordsDonationsByDonor,
    currentPageDonationsByDonor,
    getDonationsByDocumentDonor,
    newDonation,
    getActualDonation,
    getLastDateDonation,
    verifyDonationByCode,
    verifyDonationByDonor,
    getDonation
  };
});
