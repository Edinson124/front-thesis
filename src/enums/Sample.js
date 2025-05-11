export const testBloodBank = {
  'Prueba serológica': 'Prueba serológica',
  'Prueba hematológica': 'Prueba hematológica'
};

export const testOptions = Object.entries(testBloodBank).map(([value, data]) => ({
  value,
  label: data
}));
