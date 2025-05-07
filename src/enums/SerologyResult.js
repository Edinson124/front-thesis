export const resultSerology = {
  TRUE: 'REACTIVO',
  FALSE: 'NO REACTIVO'
};

export const resultSerologyOptions = Object.entries(resultSerology).map(([key, label]) => ({
  value: key === 'TRUE', // true para REACTIVO, false para NO REACTIVO
  label
}));
