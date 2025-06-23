import stockInteroperabilityService from '@/services/interoperability/stockInteroperability';
import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useStockInteroperabilityStore = defineStore('interoperability-stock', () => {
  const networkOptions = reactive([]);

  const getNetworkToInteroperability = async () => {
    try {
      const response = await stockInteroperabilityService.getNetworkToInteroperability();
      networkOptions.splice(0, networkOptions.length, ...response);
      return true;
    } catch (error) {
      console.error('Error al obtener redes para interoperabilidad: ', error);
      return null;
    }
  };

  const getStockInteroperability = async (idBloodBank) => {
    try {
      const response = await stockInteroperabilityService.getStockInteroperability(idBloodBank);
      return response;
    } catch (error) {
      console.error('Error al obtener redes para interoperabilidad: ', error);
      return null;
    }
  };

  return {
    networkOptions,
    getNetworkToInteroperability,
    getStockInteroperability
  };
});
