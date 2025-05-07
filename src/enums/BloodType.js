export const BloodGroup = {
  O: 'O',
  A: 'A',
  B: 'B',
  AB: 'AB'
};

export const BloodTypes = {
  'O+': 'O+',
  'O-': 'O-',
  'A+': 'A+',
  'A-': 'A-',
  'B+': 'B+',
  'B-': 'B-',
  'AB+': 'AB+',
  'AB-': 'AB-'
};
export const RhFactor = {
  POSITIVO: {
    label: 'POSITIVO',
    symbol: '+'
  },
  NEGATIVO: {
    label: 'NEGATIVO',
    symbol: '-'
  }
};

export const rhFactorOptions = Object.entries(RhFactor).map(([value, label]) => ({
  value,
  label
}));

export const bloodGroupOptions = Object.entries(BloodGroup).map(([value, label]) => ({
  value,
  label
}));

export const bloodTypesOptions = Object.entries(BloodTypes).map(([value, label]) => ({
  value,
  label
}));
