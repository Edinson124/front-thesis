const getUnits = async () => {
  // Aquí simularías un fetch, por ahora devolvemos datos fijos
  return [{ id: 1, unit: 'blood', volume: '450ml', package: 'doble' }];
};

const getUnitTypes = async () => {
  return [
    { label: 'ex1', value: 'ex1' },
    { label: 'ex2', value: 'ex2' },
    { label: 'ex3', value: 'ex3' },
    { label: 'ex4', value: 'ex4' }
  ];
};

const getUnitPackages = async () => {
  return [
    { label: 'Simple', value: 'simple' },
    { label: 'Doble', value: 'doble' }
  ];
};

const getUnitNames = async () => {
  return [
    { label: 'Sangre completa', value: 'blood' },
    { label: 'Plaquetas', value: 'platelets' },
    { label: 'Otros', value: 'others' }
  ];
};

export default {
  getUnits,
  getUnitTypes,
  getUnitPackages,
  getUnitNames
};
