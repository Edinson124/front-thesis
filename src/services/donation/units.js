import { get, post, put } from '@/api';
import { anticoagulantOptions, bagTypesOptions, unitTypesCreateOptions, unitTypesTransformationOptions } from '@/enums/Units';

const getUnitTypesCreate = async () => {
  return unitTypesCreateOptions;
};

const getUnitTypesTransformation = async () => {
  return unitTypesTransformationOptions;
};

const getUnitBags = async () => {
  return bagTypesOptions;
};

const getUnitAnticoagunlants = async () => {
  return anticoagulantOptions;
};

const saveSample = async (donationId, test) => {
  try {
    const response = await post(`/sample/${donationId}`, { test });
    const id = response?.payload?.id ?? null;
    return id;
  } catch (error) {
    console.error('Error al registrar una muestra: ', error);
    return null;
  }
};

const getSamples = async (donationId) => {
  try {
    const response = await get(`/units/get/${donationId}`);
    return response;
  } catch (error) {
    console.error('Error al registrar una muestra: ', error);
    return null;
  }
};

const getUnits = async (donationId) => {
  try {
    const response = await get(`/units/get/${donationId}`);
    return response;
  } catch (error) {
    console.error('Error al registrar una muestra: ', error);
    return null;
  }
};

const saveUnit = async (donationId, unit) => {
  try {
    const response = await post(`/units/save/${donationId}`, unit);
    return response;
  } catch (error) {
    console.error('Error al registrar unidad: ', error);
    return null;
  }
};

const editTableUnit = async (unitId, unit) => {
  try {
    const response = await put(`/units/edit/${unitId}`, unit);
    return response;
  } catch (error) {
    console.error('Error al editar unidad: ', error);
    return null;
  }
};

export default {
  getUnits,
  getUnitTypesCreate,
  getUnitTypesTransformation,
  getUnitBags,
  getUnitAnticoagunlants,
  saveSample,
  getSamples,
  saveUnit,
  editTableUnit
};
