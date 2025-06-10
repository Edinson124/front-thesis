export const UnitTypes = {
  'Sangre total': 'Sangre total',
  'Concentrado de eritrocitos': 'Concentrado de eritrocitos',
  'Plasma fresco congelado': 'Plasma fresco congelado',
  Crioprecipitados: 'Crioprecipitados',
  Plaquetas: 'Plaquetas',
  'Aféresis de plaquetas': 'Aféresis de plaquetas',
  'Aféresis de glóbulos rojos': 'Aféresis de glóbulos rojos',
  'Aféresis de plasma': 'Aféresis de plasma'
};

export const UnitStatus = {
  Apto: 'Apto',
  Reservado: 'Reservado'
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
  'Sangre total': 'Sangre Total',
  'Aféresis de plaquetas': 'Aféresis de Plaquetas',
  'Aféresis de glóbulos rojos': 'Aféresis de Glóbulos Rojos',
  'Aféresis de plasma': 'Aféresis de Plasma'
};

export const UnitTypesTransformation = {
  'Concentrado de eritrocitos': 'Concentrado de eritrocitos',
  'Plasma fresco congelado': 'Plasma Fresco Congelado',
  Plaquetas: 'Plaquetas'
};

export const UnitTypesTransformationPFC = {
  Crioprecipitados: 'Crioprecipitados'
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

export const unitTypesTransformationOptionsPFC = Object.entries(UnitTypesTransformationPFC).map(([value, label]) => ({
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

export const unitStatusOptions = Object.entries(UnitStatus).map(([value, label]) => ({
  value,
  label
}));

export const unitStatusApto = Object.entries(UnitStatus.Apto).map(([value, label]) => ({
  value,
  label
}));

export const UnitTypesTransformationSearch = {
  'Sangre total': 'Sangre total',
  'Plasma fresco congelado': 'Plasma fresco congelado'
};

export const unitTypesTransformationSearchOptions = Object.entries(UnitTypesTransformationSearch).map(([value, label]) => ({
  value,
  label
}));

export const discardReasons = [
  'Coagulación de la unidad',
  'Contaminación visible',
  'Rotura de la bolsa',
  'Pérdida de integridad del sello',
  'Mal almacenamiento (temperatura fuera de rango)',
  'Vencimiento de la unidad',
  'Fuga o goteo de la bolsa',
  'Etiqueta ilegible o desprendida',
  'Error en la identificación',
  'Color anormal de la sangre o componente',
  'Unidad devuelta fuera del tiempo permitido',
  'Presencia de espuma o hemólisis',
  'Exposición accidental a la luz (si aplica)',
  'Manipulación no autorizada o indebida'
];
export const discardQuarantineReasons = ['Unidad Reactiva'];

export const discardReasonOptions = discardReasons
  .slice()
  .sort((a, b) => a.localeCompare(b))
  .map((reason) => ({
    value: reason,
    label: reason
  }));

export const discardReasonQuarantinedOptions = [
  // Primero las específicas de cuarentena (sin ordenar)
  ...discardQuarantineReasons.map((reason) => ({ value: reason, label: reason })),
  // Luego las otras razones, ordenadas alfabéticamente
  ...discardReasons
    .slice()
    .sort((a, b) => a.localeCompare(b))
    .map((reason) => ({ value: reason, label: reason }))
];
