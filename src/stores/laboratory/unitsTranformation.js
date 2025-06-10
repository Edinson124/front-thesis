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
      const response = await unitsTranformationService.getUnitsFromUnit(idUnit);
      unitsFromUnit.splice(0, unitsFromUnit.length, ...response);
      totalUnitsFromUnit.value = response.length;
      return response;
    } catch (error) {
      console.error('Error al obtener las unidades: ', error);
      return false;
    }
  };

  const saveUnit = async (unitId, unit) => {
    try {
      const response = await unitsTranformationService.saveUnit(unitId, unit);
      return response;
    } catch (error) {
      console.error('Error al guardar unidad: ', error);
      return null;
    }
  };

  const saveStampUnit = async (unitId, stamp) => {
    try {
      const response = await unitsTranformationService.saveStampUnit(unitId, stamp);
      return response;
    } catch (error) {
      console.error('Error al registrar sello a unidad: ', error);
      return null;
    }
  };

  const editTableUnit = async (unitId, unit) => {
    try {
      const response = await unitsTranformationService.editTableUnit(unitId, unit);
      return response;
    } catch (error) {
      console.error('Error al editar unidad: ', error);
      return null;
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
    saveUnit,
    editTableUnit,
    saveStampUnit,
    units,
    totalRecords,
    currentPage,
    unitsFromUnit,
    totalUnitsFromUnit
  };
});
