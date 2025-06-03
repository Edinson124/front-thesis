export const AdverseReactionDonation = [
  'Mareos',
  'Náuseas',
  'Vómitos',
  'Sudoración excesiva',
  'Pérdida del conocimiento (síncope)',
  'Hipotensión',
  'Ansiedad',
  'Temblor',
  'Palidez',
  'Dolor en el sitio de punción',
  'Hematoma en el brazo',
  'Hinchazón en el brazo (edema local)',
  'Irritación o picazón en la piel',
  'Espasmos musculares',
  'Calambres',
  'Sensación de frío',
  'Palpitaciones',
  'Convulsiones (muy raro)',
  'Reacción vasovagal',
  'Contusión o lesión en el lugar de la caída (si hay desmayo)'
];

export const adverseReactionDonationOptions = AdverseReactionDonation.slice()
  .sort((a, b) => a.localeCompare(b))
  .map((reason) => ({
    value: reason,
    label: reason
  }));
