import unitsService from '@/services/storage/units';
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

export const useUnitStore = defineStore('unit', () => {
  const units = reactive([]);
  const totalRecords = ref(0);
  const currentPage = ref(0);

  const getUnits = async (filters = {}, page = 0) => {
    try {
      const response = await unitsService.getUnits(filters, page);
      units.splice(0, units.length, ...response.content);
      totalRecords.value = response.totalElements;
      currentPage.value = page;
      return true;
    } catch (error) {
      console.error('Error al obtener las unidades: ', error);
      return false;
    }
  };

  const getUnitById = async (idUnit) => {
    try {
      const response = await unitsService.getUnitById(idUnit);
      return response;
    } catch (error) {
      console.error('Error al obtener las unidades: ', error);
      return false;
    }
  };

  return {
    getUnits,
    getUnitById,
    units,
    totalRecords,
    currentPage
  };
});
