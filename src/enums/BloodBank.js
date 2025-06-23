export const isInternal = {
  Interno: true,
  Externo: false
};

export const isInternalOptions = Object.entries(isInternal).map(([label, value]) => ({ value, label }));
