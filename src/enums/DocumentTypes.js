export const DocumentTypes = {
  DNI: 'DNI',
  CE: 'Carnet de extranjería'
};

export const DocumentTypesDonor = {
  DNI: 'DNI',
  CE: 'Carnet de extranjería',
  PASAPORTE: 'Pasaporte'
};
export const DocumentTypesPatient = {
  DNI: 'DNI',
  CE: 'Carnet de extranjería',
  PASAPORTE: 'Pasaporte'
};

export const documentTypesDonorOptions = Object.entries(DocumentTypesDonor).map(([value, label]) => ({
  value,
  label
}));

export const documentTypesPatientOptions = Object.entries(DocumentTypesPatient).map(([value, label]) => ({
  value,
  label
}));
