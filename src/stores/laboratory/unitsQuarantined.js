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

  const unitSuitable = async (unitId, stamp) => {
    try {
      const response = await unitsQuarantinedService.unitSuitable(unitId, stamp);
      return response?.payload?.id ?? null;
    } catch (error) {
      console.error('Error al editar unidad: ', error);
      return null;
    }
  };

  const discardUnit = async (idUnit, reason) => {
    try {
      const response = await unitsQuarantinedService.discardUnit(idUnit, reason);
      return response?.payload?.id ?? null;
    } catch (error) {
      console.error('Error al descartar unidad: ', error);
      return null;
    }
  };

  const verifyStamp = async (stampNumber) => {
    try {
      const response = await unitsQuarantinedService.verifyStamp(stampNumber);
      return response;
    } catch (error) {
      console.error('Error al descartar unidad: ', error);
      return null;
    }
  };

  return {
    getUnits,
    unitSuitable,
    discardUnit,
    verifyStamp,
    units,
    totalRecords,
    currentPage
  };
});
