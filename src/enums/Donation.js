export const ComponentDonation = {
  'Sangre total': {
    label: 'Sangre total'
  },
  'Aféresis de Plaquetas': {
    label: 'Aféresis de Plaquetas'
  },
  'Aféresis de Glóbulos rojos': {
    label: 'Aféresis de Glóbulos rojos'
  },
  'Aféresis de Plasma': {
    label: 'Aféresis de Plasma'
  }
};
export const componentDonationOptions = Object.entries(ComponentDonation).map(([value, data]) => ({
  value,
  label: data.label
}));
