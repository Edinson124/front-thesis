import unitService from '@/services/donation/units';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSampleUnitsStore = defineStore('sample-units', () => {
  const units = ref([]);
  const totalUnits = ref(0);
  const unitTypes = ref([]);
  const unitBags = ref([]);
  const unitAnticoagunlants = ref([]);

  const fetchUnits = async (donationId) => {
    units.value = await unitService.getUnits(donationId);
    totalUnits.value = units.value.length;
  };

  const fetchUnitTypesCreate = async () => {
    unitTypes.value = await unitService.getUnitTypesCreate();
  };

  const fetchUnitTypesTransformation = async () => {
    unitTypes.value = await unitService.getUnitTypesTransformation();
  };

  const fetchUnitBags = async () => {
    unitBags.value = await unitService.getUnitBags();
  };

  const fetchUnitAnticoagunlants = async () => {
    unitAnticoagunlants.value = await unitService.getUnitAnticoagunlants();
  };

  const addUnit = (unit) => {
    units.value.push({ id: units.value.length + 1, ...unit });
  };

  const editUnit = (index, updatedUnit) => {
    units.value[index] = { ...units.value[index], ...updatedUnit };
  };

  const removeUnit = (index) => {
    units.value.splice(index, 1);
  };

  const saveSample = async (donationId, test) => {
    try {
      const response = await unitService.saveSample(donationId, test);
      return response;
    } catch (error) {
      console.error('Error al crear una muestra: ', error);
      return null;
    }
  };

  const getSamples = async (donationId) => {
    try {
      const response = await unitService.getSamples(donationId);
      return response;
    } catch (error) {
      console.error('Error al obtener muestras: ', error);
      return null;
    }
  };

  const saveUnits = async (donationId) => {
    try {
      const response = await unitService.saveUnits(donationId, units.value);
      return response;
    } catch (error) {
      console.error('Error al guardar unidades: ', error);
      return null;
    }
  };

  return {
    units,
    totalUnits,
    unitTypes,
    unitBags,
    unitAnticoagunlants,
    fetchUnits,
    fetchUnitTypesCreate,
    fetchUnitTypesTransformation,
    fetchUnitBags,
    fetchUnitAnticoagunlants,
    addUnit,
    editUnit,
    removeUnit,
    saveSample,
    getSamples,
    saveUnits
  };
});
