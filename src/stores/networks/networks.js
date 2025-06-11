import networkCollaborationService from '@/services/networks/networks';
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

export const useNetworCollaborationStore = defineStore('collaboration', () => {
  const networks = reactive([]);
  const totalRecords = ref(0);
  const currentPage = ref(0);

  const units = reactive([]);
  const totalRecordsUnits = ref(0);
  const currentPageUnits = ref(0);

  const bloodBanksOptions = reactive([]);

  const getNetworks = async (filters = {}, page = 0) => {
    try {
      const response = await networkCollaborationService.getNetworks(filters, page);
      networks.splice(0, networks.length, ...response.content);
      totalRecords.value = response.totalElements;
      currentPage.value = page;
      return true;
    } catch (error) {
      console.error('Error al obtener redes bancos de sangre: ', error);
      return false;
    }
  };
  const getUnitsStock = async (filters = {}, page = 0) => {
    try {
      const response = await networkCollaborationService.getUnitsStock(filters, page);
      units.splice(0, units.length, ...response.unitsStock.content);
      totalRecordsUnits.value = response.unitsStock.totalElements;
      currentPageUnits.value = page;
      return true;
    } catch (error) {
      console.error('Error al obtener las unidades: ', error);
      return false;
    }
  };

  const getOptionsBB = async (networkId) => {
    try {
      const response = await networkCollaborationService.getOptionsBB(networkId);
      if (response && response.canViewUser) {
        bloodBanksOptions.splice(0, bloodBanksOptions.length, ...response.bloodBanks);
      }
      return response.canViewUser;
    } catch (error) {
      console.error('Error al obtener red de banco de sangre: ', error);
      return null;
    }
  };

  const getUnitStock = async (unitId, networkId) => {
    try {
      const response = await networkCollaborationService.getUnitStock(unitId, networkId);
      return response;
    } catch (error) {
      console.error('Error al obtener información de unidad: ', error);
      return false;
    }
  };

  const getUnitShipment = async (unitId, shipmentId) => {
    try {
      const response = await networkCollaborationService.getUnitShipment(unitId, shipmentId);
      return response;
    } catch (error) {
      console.error('Error al obtener información de unidad: ', error);
      return false;
    }
  };

  return {
    networks,
    totalRecords,
    currentPage,
    bloodBanksOptions,
    units,
    totalRecordsUnits,
    currentPageUnits,
    getNetworks,
    getUnitsStock,
    getOptionsBB,
    getUnitStock,
    getUnitShipment
  };
});
