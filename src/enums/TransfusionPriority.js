export const TransfusionPriority = {
  'Muy urgente': 'Muy urgente',
  Urgente: 'Urgente',
  Hospitalizada: 'Hospitalizada',
  Programada: 'Programada'
};

export const transfusionPriorityOptions = Object.entries(TransfusionPriority).map(([value, label]) => ({
  value,
  label
}));
