import { anticoagulantOptions, bagTypesOptions, unitTypesCreateOptions, unitTypesTransformationOptions } from '@/enums/Units';

const getUnits = async () => {
  return [{ id: 1, type: 'Sangre Total', volume: '450ml', bag: 'Doble', anticoagulant: 'CPDA-1' }];
};

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

export default {
  getUnits,
  getUnitTypesCreate,
  getUnitTypesTransformation,
  getUnitBags,
  getUnitAnticoagunlants
};
