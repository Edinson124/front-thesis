import unitService from '@/services/donation/units';
import unitsTranformationService from '@/services/laboratory/unitsTranformation';
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

export const useUnitsTranformationStore = defineStore('unitTransformation', () => {
  const units = reactive([]);
  const totalRecords = ref(0);
  const currentPage = ref(0);
  const unitsFromUnit = reactive([]);
  const totalUnitsFromUnit = ref(0);

  const getUnits = async (filters = {}, page = 0) => {
    try {
      const response = await unitsTranformationService.getUnits(filters, page);
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
      const response = await unitsTranformationService.getUnitById(idUnit);
      return response;
    } catch (error) {
      console.error('Error al obtener las unidades: ', error);
      return false;
    }
  };

  const getUnitsFromUnit = async (idUnit) => {
    try {
      const response = await unitService.getUnits();
      unitsFromUnit.splice(0, unitsFromUnit.length, ...response);
      totalUnitsFromUnit.value = response.length;
      return response;
    } catch (error) {
      console.error('Error al obtener las unidades: ', error);
      return false;
    }
  };

  const addUnitFromUnit = (unit) => {
    unitsFromUnit.push({ id: unitsFromUnit.length + 1, ...unit });
  };

  const editUnitFromUnit = (index, updatedUnit) => {
    unitsFromUnit[index] = { ...unitsFromUnit[index], ...updatedUnit };
  };

  const removeUnitFromUnit = (index) => {
    unitsFromUnit.splice(index, 1);
  };

  return {
    getUnits,
    getUnitById,
    getUnitsFromUnit,
    addUnitFromUnit,
    editUnitFromUnit,
    removeUnitFromUnit,
    units,
    totalRecords,
    currentPage,
    unitsFromUnit,
    totalUnitsFromUnit
  };
});
