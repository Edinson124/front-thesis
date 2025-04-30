import bloodBanksService from '@/services/blood-banks';
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

export const useBloodBanksStore = defineStore('blood-banks', () => {
  const bloodBanks = reactive([]);
  const bloodBanksOptions = reactive([]);
  const bloodBanksTypes = reactive([]);
  const totalRecords = ref(0);
  const currentPage = ref(0);

  const getBloodBanks = async (filters = {}, page = 0) => {
    try {
      const response = await bloodBanksService.getBloodBanks(filters, page);
      bloodBanks.splice(0, bloodBanks.length, ...response.content);
      totalRecords.value = response.totalElements;
      currentPage.value = page;
      return true;
    } catch (error) {
      console.error('Error al obtener bancos de sangre: ', error);
      return false;
    }
  };

  const getBloodBanksOptions = async () => {
    try {
      const response = await bloodBanksService.getBloodBanksOptions();
      bloodBanksOptions.splice(0, bloodBanksOptions.length, ...response);
      return true;
    } catch (error) {
      console.error('Error al obtener bancos de sangre: ', error);
      return false;
    }
  };

  const getBloodBank = async (bloodBankId) => {
    try {
      const response = await bloodBanksService.getBloodBank(bloodBankId);
      return response;
    } catch (error) {
      console.error('Error al obtener banco de sangre: ', error);
      return null;
    }
  };

  const newBloodBank = async (user) => {
    try {
      await bloodBanksService.newBloodBank(user);
      return true;
    } catch (error) {
      console.error('Error al crear usuario: ', error);
      return false;
    }
  };

  const editBloodBank = async (user) => {
    try {
      await bloodBanksService.editBloodBank(user);
      return true;
    } catch (error) {
      console.error('Error al crear usuario: ', error);
      return false;
    }
  };

  const getBloodBankTypes = async () => {
    try {
      const response = await bloodBanksService.getTypesBloodBank();
      bloodBanksTypes.splice(0, bloodBanksTypes.length, ...response);
      return true;
    } catch (error) {
      console.error('Error al obtener banco de sangre: ', error);
      return null;
    }
  };

  const toogleStatus = async (bloodBankId) => {
    try {
      const response = await bloodBanksService.toogleStatusBloodBank(bloodBankId);
      const index = bloodBanks.findIndex((u) => u.id === bloodBankId);
      bloodBanks[index] = response;
      return true;
    } catch (error) {
      console.error('Error al cambiar de estado en el banco de sangre: ', error);
      return false;
    }
  };

  return { bloodBanks, bloodBanksTypes, totalRecords, currentPage, bloodBanksOptions, getBloodBanks, newBloodBank, editBloodBank, getBloodBanksOptions, getBloodBankTypes, getBloodBank, toogleStatus };
});
