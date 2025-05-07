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

export const unitTypesOptions = Object.entries(UnitTypes).map(([value, label]) => ({
  value,
  label
}));
