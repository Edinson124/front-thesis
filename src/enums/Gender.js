export const Gender = {
  Femenino: {
    label: 'Femenino',
    minMonthsBetweenDonations: 4
  },
  Masculino: {
    label: 'Masculino',
    minMonthsBetweenDonations: 3
  }
};

export const genderOptions = Object.entries(Gender).map(([value, data]) => ({
  value,
  label: data.label
}));
