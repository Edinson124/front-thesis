import bloodBanksService from '@/services/admin/blood-banks';
import networkService from '@/services/admin/network';
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

export const useNetworkStore = defineStore('network', () => {
  const networks = reactive([]);
  const totalRecords = ref(0);
  const currentPage = ref(0);

  const bloodBanksOptions = reactive([]);
  const totalRecordsBloodBanks = ref(0);
  const currentPageBloodBanks = ref(0);

  const getNetworks = async (filters = {}, page = 0) => {
    try {
      const response = await networkService.getNetworks(filters, page);
      networks.splice(0, networks.length, ...response.content);
      totalRecords.value = response.totalElements;
      currentPage.value = page;
      return true;
    } catch (error) {
      console.error('Error al obtener redes bancos de sangre: ', error);
      return false;
    }
  };

  const newNetwork = async (network) => {
    try {
      await networkService.newNetwork(network);
      return true;
    } catch (error) {
      console.error('Error al crear red de banco de sangre: ', error);
      return false;
    }
  };
  const editNetwork = async (network) => {
    try {
      await networkService.editNetwork(network);
      return true;
    } catch (error) {
      console.error('Error al editar red de banco de sangre: ', error);
      return false;
    }
  };

  const getBloodBanksOptionsAddNetwork = async (filters = {}, page = 0) => {
    try {
      const response = await bloodBanksService.getBloodBanksOptionsAddNetwork(filters, page);
      bloodBanksOptions.splice(0, bloodBanksOptions.length, ...response.content);
      totalRecordsBloodBanks.value = response.totalElements;
      currentPageBloodBanks.value = page;
      return true;
    } catch (error) {
      console.error('Error al obtener bancos de sangre: ', error);
      return false;
    }
  };

  const getNetworkById = async (networkId) => {
    try {
      const response = await networkService.getNetworkById(networkId);
      return response;
    } catch (error) {
      console.error('Error al obtener red de banco de sangre: ', error);
      return null;
    }
  };

  return {
    networks,
    totalRecords,
    currentPage,
    bloodBanksOptions,
    totalRecordsBloodBanks,
    currentPageBloodBanks,
    getNetworks,
    newNetwork,
    editNetwork,
    getBloodBanksOptionsAddNetwork,
    getNetworkById
  };
});
