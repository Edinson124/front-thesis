import unitService from '@/services/donation/units';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSampleUnitsStore = defineStore('sample-units', () => {
  const units = ref([]);
  const totalUnits = ref(0);
  const unitTypes = ref([]);
  const unitBags = ref([]);
  const unitAnticoagunlants = ref([]);

  const fetchUnits = async () => {
    units.value = await unitService.getUnits();
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
    removeUnit
  };
});
