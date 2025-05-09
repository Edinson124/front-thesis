export const Status = {
  ACTIVE: 'Activo',
  INACTIVE: 'Desactivado'
};

export const DonorStatus = {
  Apto: { label: 'Apto', enableToNewDonation: true },
  'Diferido temporalmente': { label: 'Diferido temporalmente', enableToNewDonation: false },
  'Diferido permanentemente': { label: 'Diferido permanentemente', enableToNewDonation: false }
};

export const DonationStatus = {
  'En proceso': { label: 'En proceso', edit: true },
  'Finalizada con diferimiento temporal': { label: 'Finalizada con diferimiento temporal', edit: false },
  'Finalizada con diferimiento permanente': { label: 'Finalizada con diferimiento permanente', edit: false },
  Finalizada: { label: 'Finalizada', edit: false }
};

export const TranfusionStatus = {
  Pendiente: { label: 'Pendiente', edit: true },
  Aceptada: { label: 'Aceptada', edit: false },
  Finalizada: { label: 'Finalizada', edit: false },
  'No atendida': { label: 'No atendida', edit: false }
};

export const ExtractionStatus = {
  Interrumpida: { label: 'Interrumpida' },
  Completada: { label: 'Completada' }
};

export const extractionStatusOptions = Object.entries(ExtractionStatus).map(([value, data]) => ({
  value,
  label: data.label
}));

export const tranfusionStatusOptions = Object.entries(TranfusionStatus).map(([value, data]) => ({
  value,
  label: data.label
}));
