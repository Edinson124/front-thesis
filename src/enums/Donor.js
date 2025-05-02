export const DonorType = {
  Voluntario: {
    label: 'Voluntario',
    requiredPacient: false,
    sameDonor: false
  },
  'Por reposición': {
    label: 'Por reposición',
    requiredPacient: false,
    sameDonor: false
  },
  Dirigido: {
    label: 'Dirigido',
    requiredPacient: true,
    sameDonor: false
  },
  Autólogo: {
    label: 'Autólogo',
    requiredPacient: true,
    sameDonor: true
  }
};
export const donorTypesOptions = Object.entries(DonorType).map(([value, data]) => ({
  value,
  label: data.label
}));
