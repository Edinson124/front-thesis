export const Status = {
  ACTIVE: 'Activo',
  INACTIVE: 'Desactivado'
};

export const DonorStatus = {
  Apto: { label: 'Apto', enableToNewDonation: true },
  'Diferido temporalmente': { label: 'Diferido temporalmente', enableToNewDonation: false },
  'Diferido permanentemente': { label: 'Diferido permanentemente', enableToNewDonation: false }
};
