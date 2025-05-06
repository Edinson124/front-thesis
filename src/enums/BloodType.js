export const BloodGroup = {
  O: 'O',
  A: 'A',
  B: 'B',
  AB: 'AB'
};

export const RhFactor = {
  POSITIVE: 'POSITIVO',
  NEGATIVE: 'NEGATIVO'
};

export const rhFactorOptions = Object.entries(RhFactor).map(([value, label]) => ({
  value,
  label
}));

export const bloodGroupOptions = Object.entries(BloodGroup).map(([value, label]) => ({
  value,
  label
}));
