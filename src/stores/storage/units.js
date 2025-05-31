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

  const idTranfusion = ref(0);
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

  const getSelectBloodTypesByTransfusion = async (idTranfusion) => {
    try {
      const response = await transfusionAssignmentService.getBloodOptions(idTranfusion);
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
      bloodTypesSelect.splice(0, bloodTypesSelect.length, ...unitStatusApto);
      return true;
    } catch (error) {
      console.error('Error al obtener losestado de sangre: ', error);
      return false;
    }
  };

  const setStatusUnits = async () => {
    try {
      bloodTypesSelect.splice(0, bloodTypesSelect.length, ...unitStatusOptions);
      return true;
    } catch (error) {
      console.error('Error al obtener losestado de sangre: ', error);
      return false;
    }
  };

  const setNullIdTranfusion = () => {
    idTranfusion.value = null;
  };

  return {
    getUnits,
    getUnitById,
    getSelectBloodTypesByTransfusion,
    getSelectBloodTypesAll,
    setStatusUnits,
    setStatusAptoUnits,
    setNullIdTranfusion,
    units,
    totalRecords,
    currentPage,
    bloodTypesSelect,
    statusTypesSelect,
    idTranfusion
  };
});
