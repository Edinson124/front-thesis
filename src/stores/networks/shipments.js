import shipmentService from '@/services/networks/shipments';
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

export const useShipmentStore = defineStore('shipments', () => {
  const shipments = reactive([]);
  const totalRecords = ref(0);
  const currentPage = ref(0);

  const bloodBanksOptions = reactive([]);
  const networkOptions = reactive([]);

  const getShipments = async (filters = {}, page = 0) => {
    try {
      const response = await shipmentService.getShipments(filters, page);
      shipments.splice(0, shipments.length, ...response.content);
      totalRecords.value = response.totalElements;
      currentPage.value = page;
      return true;
    } catch (error) {
      console.error('Error al obtener solicitudes de transferencia: ', error);
      return false;
    }
  };

  const getShipmentsNetwork = async () => {
    try {
      const response = await shipmentService.getShipmentsNetwork();
      networkOptions.splice(0, networkOptions.length, ...response);
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
    networkOptions,
    getShipments,
    getShipmentsNetwork
  };
});
