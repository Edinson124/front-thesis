import unitService from '@/services/donation/sample-units';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSampleUnitsStore = defineStore('sample-units', () => {
  const units = ref([]);
  const unitTypes = ref([]);
  const unitPackages = ref([]);
  const unitNames = ref([]);

  const fetchUnits = async () => {
    units.value = await unitService.getUnits();
  };

  const fetchUnitTypes = async () => {
    unitTypes.value = await unitService.getUnitTypes();
  };

  const fetchUnitPackages = async () => {
    unitPackages.value = await unitService.getUnitPackages();
  };

  const fetchUnitNames = async () => {
    unitNames.value = await unitService.getUnitNames();
  };

  const findUnitName = (value) => {
    const found = unitNames.value.find((u) => u.value === value);
    return found ? found.label : value;
  };

  const findPackageName = (value) => {
    const found = unitPackages.value.find((p) => p.value === value);
    return found ? found.label : value;
  };

  const findTypeName = (value) => {
    const found = unitTypes.value.find((t) => t.value === value);
    return found ? found.label : value;
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
    unitTypes,
    unitPackages,
    unitNames,
    fetchUnits,
    fetchUnitTypes,
    fetchUnitPackages,
    fetchUnitNames,
    findUnitName,
    findPackageName,
    findTypeName,
    addUnit,
    editUnit,
    removeUnit
  };
});
