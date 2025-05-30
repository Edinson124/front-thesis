export const ResultTest = {
  true: 'COMPATIBLE',
  false: 'INCOMPATIBLE'
};

export const resultTestOptions = Object.entries(ResultTest).map(([key, label]) => ({
  value: key === 'true',
  label
}));
