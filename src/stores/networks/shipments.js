import shipmentService from '@/services/networks/shipments';
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

export const useShipmentStore = defineStore('shipments', () => {
  const shipments = reactive([]);
  const totalRecords = ref(0);
  const currentPage = ref(0);

  const bloodBanksOptions = reactive([]);

  const getNetworks = async (filters = {}, page = 0) => {
    try {
      const response = await shipmentService.getNetworks(filters, page);
      shipments.splice(0, shipments.length, ...response.content);
      totalRecords.value = response.totalElements;
      currentPage.value = page;
      return true;
    } catch (error) {
      console.error('Error al obtener redes bancos de sangre: ', error);
      return false;
    }
  };

  return {
    shipments,
    totalRecords,
    currentPage,
    bloodBanksOptions,
    getNetworks
  };
});
