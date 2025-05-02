function calculateAge(birthDate) {
  const today = new Date();

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    days += lastDayOfMonth;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}
function stringToDate(fechaString) {
  const partes = fechaString.split('/');
  const dia = parseInt(partes[0], 10);
  const mes = parseInt(partes[1], 10) - 1;
  const anio = parseInt(partes[2], 10);

  return new Date(anio, mes, dia);
}

export const getStringFormatAge = (birthDate) => {
  if (!birthDate) return '';
  const birthDateString = stringToDate(birthDate);
  const age = calculateAge(birthDateString);
  return `${age.years} años ${age.months} meses ${age.days} días`;
};
