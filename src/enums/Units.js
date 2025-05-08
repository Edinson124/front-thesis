export const UnitTypes = {
  'Sangre Total': 'Sangre Total',
  'Concentrado de eritrocitos': 'Concentrado de eritrocitos',
  'Plasma Fresco Congelado': 'Plasma Fresco Congelado',
  Crioprecipitados: 'Crioprecipitados',
  Plaquetas: 'Plaquetas',
  'Aféresis de Plaquetas': 'Aféresis de Plaquetas',
  'Aféresis de Glóbulos Rojos': 'Aféresis de Glóbulos Rojos',
  'Aféresis de Plasma': 'Aféresis de Plasma'
};

export const bagTypes = {
  Simple: 'Simple',
  Doble: 'Doble',
  Triple: 'Triple',
  Cuadruple: 'Cuadruple',
  Plaquetas: 'Plaquetas',
  'Kit de aféresis': 'Kit de aféresis',
  'Kit de aféresis doble': 'Kit de aféresis doble'
};

export const anticoagulant = {
  'CPDA-1': 'CPDA-1',
  CPD: 'CPD',
  CP2D: 'CP2D',
  'ACD-A': 'ACD-A',
  'ACD-B': 'ACD-B',
  'SAG-M': 'SAG-M',
  'AS-1': 'AS-1',
  'AS-3': 'AS-3',
  'AS-5': 'AS-5'
};

export const UnitTypesCreate = {
  'Sangre Total': 'Sangre Total',
  'Aféresis de Plaquetas': 'Aféresis de Plaquetas',
  'Aféresis de Glóbulos Rojos': 'Aféresis de Glóbulos Rojos',
  'Aféresis de Plasma': 'Aféresis de Plasma'
};

export const UnitTypesTransformation = {
  'Concentrado de eritrocitos': 'Concentrado de eritrocitos',
  'Plasma Fresco Congelado': 'Plasma Fresco Congelado',
  Crioprecipitados: 'Crioprecipitados',
  Plaquetas: 'Plaquetas'
};

export const unitTypesOptions = Object.entries(UnitTypes).map(([value, label]) => ({
  value,
  label
}));

export const unitTypesCreateOptions = Object.entries(UnitTypesCreate).map(([value, label]) => ({
  value,
  label
}));

export const unitTypesTransformationOptions = Object.entries(UnitTypesTransformation).map(([value, label]) => ({
  value,
  label
}));

export const bagTypesOptions = Object.entries(bagTypes).map(([value, label]) => ({
  value,
  label
}));

export const anticoagulantOptions = Object.entries(anticoagulant).map(([value, label]) => ({
  value,
  label
}));
