import { bloodTypesOptions } from '@/enums/BloodType';
import { unitStatusApto, unitStatusOptions } from '@/enums/Units';
import unitsService from '@/services/storage/units';
import transfusionAssignmentService from '@/services/tranfusion/transfusionAssignment';
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

export const useUnitStore = defineStore('unit', () => {
  const units = reactive([]);
  const totalRecords = ref(0);
  const currentPage = ref(0);

  const idTransfusion = ref(0);
  const bloodTypesSelect = reactive([...bloodTypesOptions]);
  const statusTypesSelect = reactive([...unitStatusOptions]);

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

  const getSelectBloodTypesByTransfusion = async (idTransfusion) => {
    try {
      const response = await transfusionAssignmentService.getBloodOptions(idTransfusion);
      bloodTypesSelect.splice(0, bloodTypesSelect.length, ...response);
      return true;
    } catch (error) {
      console.error('Error al obtener los tipos de sangre: ', error);
      return false;
    }
  };

  const getSelectBloodTypesAll = async () => {
    try {
      bloodTypesSelect.splice(0, bloodTypesSelect.length, ...bloodTypesOptions);
      return true;
    } catch (error) {
      console.error('Error al obtener los tipos de sangre: ', error);
      return false;
    }
  };

  const setStatusAptoUnits = async () => {
    try {
      statusTypesSelect.splice(0, statusTypesSelect.length, ...unitStatusApto);
      return true;
    } catch (error) {
      console.error('Error al obtener losestado de sangre: ', error);
      return false;
    }
  };

  const setStatusUnits = async () => {
    try {
      statusTypesSelect.splice(0, statusTypesSelect.length, ...unitStatusOptions);
      return true;
    } catch (error) {
      console.error('Error al obtener losestado de sangre: ', error);
      return false;
    }
  };

  const setNullIdTransfusion = () => {
    idTransfusion.value = null;
  };

  const discardUnit = async (idUnit, reason) => {
    try {
      const response = await unitsService.discardUnit(idUnit, reason);
      return response?.payload?.id ?? null;
    } catch (error) {
      console.error('Error al descartar unidad: ', error);
      return null;
    }
  };
  const canViewUnit = async (idUnit) => {
    try {
      const response = await unitsService.canViewUnit(idUnit);
      return response?.canView ?? null;
    } catch (error) {
      console.error('Error al verificar unidad: ', error);
      return null;
    }
  };

  return {
    getUnits,
    getUnitById,
    getSelectBloodTypesByTransfusion,
    getSelectBloodTypesAll,
    setStatusUnits,
    setStatusAptoUnits,
    setNullIdTransfusion,
    discardUnit,
    canViewUnit,
    units,
    totalRecords,
    currentPage,
    bloodTypesSelect,
    statusTypesSelect,
    idTransfusion
  };
});
