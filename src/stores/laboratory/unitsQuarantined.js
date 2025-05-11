import unitsQuarantinedService from '@/services/laboratory/unitsQuarantined';
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

export const useUnitsQuarantinedStore = defineStore('unitQuarantined', () => {
  const units = reactive([]);
  const totalRecords = ref(0);
  const currentPage = ref(0);

  const getUnits = async (filters = {}, page = 0) => {
    try {
      const response = await unitsQuarantinedService.getUnits(filters, page);
      units.splice(0, units.length, ...response.content);
      totalRecords.value = response.totalElements;
      currentPage.value = page;
      return true;
    } catch (error) {
      console.error('Error al obtener las unidades en cuarentena: ', error);
      return false;
    }
  };

  const unitSuitable = async (unitId) => {
    try {
      const response = await unitsQuarantinedService.unitSuitable(unitId);
      return response?.payload?.id ?? null;
    } catch (error) {
      console.error('Error al editar unidad: ', error);
      return null;
    }
  };

  return {
    getUnits,
    unitSuitable,
    units,
    totalRecords,
    currentPage
  };
});
