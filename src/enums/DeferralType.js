export const DeferralType = {
  PERMANENTE: {
    label: 'PERMANENTE',
    requiredDays: false
  },
  TEMPORAL: {
    label: 'TEMPORAL',
    requiredDays: true
  }
};

export const deferralOptions = Object.entries(DeferralType).map(([value, data]) => ({
  value,
  label: data.label
}));

export const DeferralReasonsExamPhysical = [
  // Peso
  'Donante no cumple con el peso mínimo requerido',
  // Presión arterial
  'Presión sistólica elevada',
  'Presión sistólica baja',
  'Presión diastólica elevada',
  'Presión diastólica baja',
  'Hipertensión no controlada',
  'Hipotensión sintomática',
  // Temperatura
  'Temperatura corporal elevada (fiebre)',
  'Temperatura corporal baja (hipotermia)',
  // Frecuencia cardíaca
  'Frecuencia cardíaca elevada (taquicardia)',
  'Frecuencia cardíaca baja (bradicardia)',
  // Hemoglobina (detectable con test rápido)
  'Hemoglobina baja',
  'Hemoglobina por encima del rango permitido',
  // Evaluación física de venas y zona de punción
  'Condiciones desfavorables en las venas para la punción',
  'Lesiones visibles o inflamación en zona de punción',
  // Observaciones generales relacionadas al examen físico simple
  'Donante refiere ayuno prolongado antes del examen',
  'Donante no descansó adecuadamente antes de donar'
];
export const DeferralReasonsInterview = [
  // Pregunta 1: Entendimiento de consejería
  'No entendió la información de la consejería',
  // Pregunta 2: Edad menor a 18
  'Menor de 18 años',
  // Pregunta 3: Peso menor a 50 kg
  'Peso menor a 50 kilos',
  // Pregunta 4: Última donación dentro de 2 meses
  'Donó sangre en los últimos 2 meses',
  // Pregunta 5: Consumo reciente de medicamentos
  'Está tomando o tomó medicamentos recientemente',
  // Pregunta 6: Espera cita médica
  'Está en lista de espera para cita médica',
  // Pregunta 7: Estado general de salud
  'No se encuentra bien de salud',
  // Pregunta 8: Actividades peligrosas próximas
  'Realizará actividades peligrosas en las próximas 24 horas',
  // Pregunta 9: Síntomas recientes
  'Ha tenido fiebre, dolor de cabeza o síntomas de enfermedad en las últimas 2 semanas',
  // Pregunta 10: Vacunación reciente
  'Recibió alguna vacuna en el último mes',
  // Pregunta 11: Contacto con enfermedad contagiosa
  'Tuvo contacto con paciente con enfermedad contagiosa',
  // Pregunta 12: Tatuajes o retoques recientes
  'Se realizó tatuajes o retoques en los últimos 12 meses',
  // Pregunta 13: Cirugías recientes
  'Se sometió a intervenciones quirúrgicas en los últimos 12 meses',
  // Pregunta 14: Enfermedades crónicas
  'Diagnosticado con enfermedad o molestia que requiere control',
  // Pregunta 15: Hepatitis o problemas hepáticos
  'Historial de hepatitis o problemas hepáticos',
  // Pregunta 16: Enfermedades graves diagnosticadas
  'Enfermedad grave diagnosticada (paludismo, tuberculosis, leishmaniasis, etc.)',
  // Pregunta 17: Enfermedades cardíacas o hipertensión
  'Problemas de corazón o hipertensión arterial',
  // Pregunta 18: Epilepsia o convulsiones
  'Diagnosticado con epilepsia, convulsiones o síncopes',
  // Pregunta 19: Diabetes con insulina
  'Diabetes con tratamiento con insulina',
  // Pregunta 20: Cáncer
  'Diagnosticado con algún tipo de cáncer',
  // Pregunta 21: Enfermedad alérgica grave
  'Enfermedad o reacción alérgica grave',
  // Pregunta 22: Enfermedad hematológica
  'Diagnosticado con enfermedad de la sangre',
  // Pregunta 23: Transfusiones o factores
  'Recibió transfusiones o factores de coagulación',
  // Pregunta 24: Trasplantes
  'Recibió trasplante de órganos o tejidos',
  // Pregunta 25: Gestación actual
  'Está gestando actualmente',
  // Pregunta 26: Lactancia actual
  'Está lactando actualmente',
  // Pregunta 27: Conductas de riesgo hepatitis
  'Conductas de riesgo: posible portador de hepatitis B o C',
  // Pregunta 28: Uso drogas ilícitas
  'Uso de drogas ilícitas alguna vez',
  // Pregunta 29: Conducta sexual de riesgo
  'Conducta sexual de riesgo en el último año',
  // Pregunta 30: Cambio frecuente de pareja
  'Frecuente cambio de pareja sexual',
  // Pregunta 31: Sexo a cambio de pago
  'Aceptó dinero, drogas u otro pago por sexo',
  // Pregunta 32: Prostitución o pago por sexo
  'Ejerció prostitución o pagó por sexo',
  // Pregunta 33: VIH positivo
  'Es portador de VIH/SIDA',
  // Pregunta 34: Sospecha de VIH
  'Dudas o sospecha de ser portador de VIH',
  // Pregunta 35: Prueba VIH positiva
  'Resultado positivo en prueba de descarte de VIH',
  // Pregunta 36: Consumo reciente de alcohol o drogas
  'Consumo reciente de alcohol o drogas',
  // Pregunta 37: Viajes a zonas endémicas
  'Historial de viajes recientes a zonas con enfermedades transmisibles',
  // Pregunta 38: Detección de intento de venta de sangre (prohibido en Perú)
  'Intento o sospecha de venta de sangre',
  // Observaciones o casos especiales
  'Otras razones médicas específicas según observaciones'
];
export const DeferralReasonsExtraction = [
  'Donante presentó reacciones adversas durante la extracción',
  'Donante desistió de donar por temor o ansiedad',
  'Dificultad para encontrar vena adecuada',
  'Extracción fallida (punción fallida o mal realizada)',
  'Interrupción por bajo flujo sanguíneo',
  'Obstrucción en el circuito de extracción',
  'Donación incompleta (volumen insuficiente recolectado)',
  'Tiempo de extracción excedido',
  'Coagulación prematura en la bolsa',
  'Problemas con el equipo de extracción (falla técnica)',
  'Reacción vasovagal severa durante la extracción',
  'Movimiento brusco del donante durante la punción',
  'Contaminación del sitio de punción',
  'Error en identificación del donante antes de iniciar extracción',
  'Donante decidió retirarse durante la extracción'
  // 'Otros'
];

export const deferralOptionsExtraction = DeferralReasonsExtraction.slice()
  .sort((a, b) => a.localeCompare(b))
  .map((reason) => ({
    value: reason,
    label: reason
  }));

export const deferralOptionsExamPhysical = DeferralReasonsExamPhysical.slice()
  .sort((a, b) => a.localeCompare(b))
  .map((reason) => ({
    value: reason,
    label: reason
  }));
export const deferralOptionsInterview = DeferralReasonsInterview.slice()
  .sort((a, b) => a.localeCompare(b))
  .map((reason) => ({
    value: reason,
    label: reason
  }));
const sortByLabel = (a, b) => a.localeCompare(b);

export const deferralOptionsGrouped = [
  {
    label: 'Entrevista',
    options: DeferralReasonsInterview.slice()
      .sort(sortByLabel)
      .map((reason) => ({
        value: reason,
        label: reason
      }))
  },
  {
    label: 'Examen físico',
    options: DeferralReasonsExamPhysical.slice()
      .sort(sortByLabel)
      .map((reason) => ({
        value: reason,
        label: reason
      }))
  },
  {
    label: 'Extracción',
    options: DeferralReasonsExtraction.slice()
      .sort(sortByLabel)
      .map((reason) => ({
        value: reason,
        label: reason
      }))
  }
];
