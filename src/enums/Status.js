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
