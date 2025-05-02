export const DonorInterviewQuestions = {
  sections: [
    // {
    //   id: 's000',
    //   name: 'Datos físicos y clínicos',
    //   questions: [
    //     { id: 's000-q001', name: 'Peso', type: 'units', units: 'Kg', hint: 'Debe ser mayor a 50kg', required: true },
    //     { id: 's000-q002', name: 'Presión sitótica', type: 'units', units: 'mmHg', hint: 'Debe ser entre 100-140mmHg', required: true },
    //     { id: 's000-q003', name: 'Presión diastótica', type: 'units', units: 'mmHg', hint: 'Debe ser entre 60-90mmHg', required: true },
    //     { id: 's000-q004', name: 'Temperatura', type: 'units', units: '°C', hint: 'Debe ser menor a 37.5', required: true },
    //     { id: 's000-q005', name: 'Frecuencia cardíaca', type: 'units', units: 'ppm', hint: 'Debe ser entre 50-100 ppm', required: true },
    //     { id: 's000-q006', name: 'Hemoglobina', type: 'units', units: 'g/dL', hint: 'Hombres : >= 13,5 g/dL, Mujeres: >=12,5 g/dL', required: true },
    //     { id: 's000-q007', name: 'Hematocritos', type: 'units', units: '%', hint: 'Hombres : >= 40%, Mujeres: >=38%', required: true },
    //     { id: 's000-q008', name: 'Observaciones', type: 'textarea', required: false }
    //   ]
    // },
    {
      id: 's001',
      name: 'Protocolos de selección',
      questions: [
        { id: 's001-q001', name: '¿Has entendido la información que se le ha explicado en la consejería?', type: 'radio', options: ['Sí', 'No'], required: true },
        { id: 's001-q002', name: '¿Tienes más de 18 años?', type: 'radio', options: ['Sí', 'No'], required: true },
        { id: 's001-q003', name: '¿Pesas más de 50 kilos?', type: 'radio', options: ['Sí', 'No'], required: true },
        { id: 's001-q004', name: '¿Has donado sangre en los últimos 2 meses?', type: 'radio', options: ['Sí', 'No'], required: true },
        { id: 's001-q005', name: '¿Dónde?', type: 'text', required: true, depends: [{ questionId: 's001-q004', value: 'Sí' }] },
        { id: 's001-q006', name: '¿Está tomando o tomó algún medicamento en los últimos días?', type: 'radio', options: ['Sí', 'No'], required: true },
        { id: 's001-q007', name: '¿Cuáles?', type: 'text', required: true, depends: [{ questionId: 's001-q006', value: 'Sí' }] },
        { id: 's001-q008', name: '¿Está actualmente en lista de espera para una cita con el médico?', type: 'radio', options: ['Sí', 'No'], required: true },
        { id: 's001-q009', name: '¿Por qué?', type: 'text', required: true, depends: [{ questionId: 's001-q008', value: 'Sí' }] },
        { id: 's001-q010', name: '¿Se encuentra bien de salud?', type: 'radio', options: ['Sí', 'No'], required: true },

        { id: 's001-st001', name: 'EN LAS PRÓXIMAS 24 HORAS', type: 'subtitle' },
        { id: 's001-q011', name: '¿Va a realizar actividades peligrosas (laboral, deportiva, otras)?', type: 'radio', options: ['Sí', 'No'], required: true },

        { id: 's001-st002', name: 'EN LAS ÚLTIMAS DOS (2) SEMANAS', type: 'subtitle' },
        { id: 's001-q012', name: '¿Ha tenido fiebre o dolor de cabeza o evidencia de enfermedad?', type: 'radio', options: ['Sí', 'No'], required: true },

        { id: 's001-st003', name: 'EN EL ÚLTIMO MES', type: 'subtitle' },
        { id: 's001-q013', name: '¿Recibió alguna vacuna?', type: 'radio', options: ['Sí', 'No'], required: true },
        { id: 's001-q014', name: '¿Cuál?', type: 'text', required: true, depends: [{ questionId: 's001-q013', value: 'Sí' }] },
        { id: 's001-q015', name: '¿Tuvo contacto con algún paciente portador de alguna enfermedad contagiosa?', type: 'radio', options: ['Sí', 'No'], required: true },

        { id: 's001-st004', name: 'EN LOS ÚLTIMOS DOCE (12) MESES', type: 'subtitle' },
        { id: 's001-q016', name: '¿Le realizaron tatuajes o retoque de tatuaje?', type: 'radio', options: ['Sí', 'No'], required: true },
        { id: 's001-q017', name: '¿Se ha sometido a intervenciones quirúrgicas?', type: 'radio', options: ['Sí', 'No'], required: true },

        { id: 's001-st005', name: 'EN ALGUNA OCASIÓN DURANTE SU VIDA', type: 'subtitle' },
        { id: 's001-q018', name: '¿Ha sido diagnosticado de alguna enfermedad o molestia que requiere control?', type: 'radio', options: ['Sí', 'No'], required: true },
        { id: 's001-q019', name: '¿Cuál?', type: 'text', required: true, depends: [{ questionId: 's001-q018', value: 'Sí' }] },
        { id: 's001-q020', name: '¿Ha tenido hepatitis o problemas con el hígado?', type: 'radio', options: ['Sí', 'No'], required: true },
        {
          id: 's001-q021',
          name: '¿Ha sido diagnosticado de enfermedad grave como Paludismo, Chapas, Leishmaniasis Tuberculosis, enfermedades pulmonares, de cerebro, riñones o aparato digestivo?',
          type: 'radio',
          options: ['Sí', 'No'],
          required: true
        },
        { id: 's001-q022', name: '¿Ha tenido problemas de corazón o hipertensión arterial?', type: 'radio', options: ['Sí', 'No'], required: true },
        { id: 's001-q023', name: '¿Fue diagnosticado de epilepsia, convulsiones o síncopes?', type: 'radio', options: ['Sí', 'No'], required: true },
        { id: 's001-q024', name: '¿Ha sido diagnosticado de diabetes y requirió tratamiento con insulina?', type: 'radio', options: ['Sí', 'No'], required: true },
        { id: 's001-q025', name: '¿Ha sido diagnosticado de algún tipo de cáncer?', type: 'radio', options: ['Sí', 'No'], required: true },
        { id: 's001-q026', name: '¿Presentó alguna vez enfermedad o reacción alérgica grave?', type: 'radio', options: ['Sí', 'No'], required: true },
        { id: 's001-q027', name: '¿Ha sido diagnosticado de enfermedad de la sangre?', type: 'radio', options: ['Sí', 'No'], required: true },
        { id: 's001-q028', name: '¿Ha recibido transfusiones o requerido factores de coagulación?', type: 'radio', options: ['Sí', 'No'], required: true },
        { id: 's001-q029', name: '¿Ha recibido trasplante de órganos o tejidos?', type: 'radio', options: ['Sí', 'No'], required: true },

        { id: 's001-st006', name: 'SI UD. ES MUJER', type: 'subtitle' },
        { id: 's001-q030', name: 'Fecha última regla', type: 'datepicker', required: false },
        { id: 's001-q031', name: '¿Está gestando actualmente?', type: 'radio', options: ['Sí', 'No'], required: false },
        { id: 's001-q032', name: '¿Está Ud. actualmente dando de lactar?', type: 'radio', options: ['Sí', 'No'], required: false },
        { id: 's001-q033', name: 'Su volumen menstrual en promedio es:', type: 'select', options: ['Abundante', 'Moderado', 'Escaso'], required: false },
        { id: 's001-q034', name: '¿Cuántos días dura su menstruación?', type: 'text', required: false },
        { id: 's001-q035', name: '¿Ha dado a luz en los últimos 6 meses?', type: 'radio', options: ['Sí', 'No'], required: false },
        { id: 's001-q036', name: 'Observaciones', type: 'textarea', required: false }
      ]
    },
    {
      id: 's002',
      name: 'Conductas de riesgo',
      questions: [
        { id: 's002-q001', name: '¿Cree que podría ser o tiene dudas respecto a que podría ser portador de virus de hepatitis B o C?', type: 'radio', options: ['Sí', 'No'], required: true },
        { id: 's002-q002', name: '¿Alguna vez usó drogas ilícitas?', type: 'radio', options: ['Sí', 'No'], required: true },
        { id: 's002-q003', name: '¿Tiene o ha tenido conducta sexual de riesgo en el último año?', type: 'radio', options: [' Sí', 'No'], required: true },
        { id: 's002-q004', name: '¿Cuántas parejas sexuales ha tenido en el último año?', type: 'text', required: true },
        { id: 's002-q005', name: '¿Es una persona que cambia frecuentemente de pareja?', type: 'radio', options: ['Sí', 'No'], required: true },
        { id: 's002-q006', name: '¿Cuánto tiempo tiene con su última pareja sexual?', type: 'text', required: true },
        { id: 's002-q007', name: '¿Ha aceptado alguna vez dinero, drogas u otro tipo de pago a cambio de mantener relaciones sexuales?', type: 'radio', options: ['Sí', 'No'], required: true },
        { id: 's002-q008', name: '¿Ejerció prostitución o pagó a cambio de sexo?', type: 'radio', options: ['Sí', 'No'], required: true },
        { id: 's002-q009', name: '¿Se ha hecho alguna prueba de descarte de VIH?', type: 'radio', options: ['Sí', 'No'], required: true },
        { id: 's002-q010', name: '¿Es portador(a) de virus del SIDA (VIH)?', type: 'radio', options: ['Sí', 'No'], required: true },
        { id: 's002-q011', name: '¿Cree que podría ser portador de VIH o tiene dudas respecto a que podría serlo?', type: 'radio', options: ['Sí', 'No'], required: true },
        { id: 's002-q012', name: '¿Ha convivido o mantenido relaciones íntimas con personas diagnosticadas de hepatitis?', type: 'radio', options: ['Sí', 'No'], required: true },
        { id: 's002-st001', name: 'Ha padecido alguna enfermedad de transmisión sexual', type: 'subtitle' },
        { id: 's002-q013', name: 'Sífilis', type: 'radio', options: ['Sí', 'No'], required: true },
        { id: 's002-q014', name: 'Gonorrea', type: 'radio', options: ['Sí', 'No'], required: true },
        { id: 's002-q015', name: 'Chancro', type: 'radio', options: ['Sí', 'No'], required: true },
        { id: 's002-q016', name: 'Otras', type: 'radio', options: ['Sí', 'No'], required: true },
        { id: 's002-st002', name: '', type: 'subtitle' },
        { id: 's002-q017', name: '¿Alguna vez en su vida usó esteroides para aumentar la musculatura?', type: 'radio', options: ['Sí', 'No'], required: true },
        { id: 's002-q018', name: '¿Persona que pudo haber usado drogas endovenosas?', type: 'radio', options: ['Sí', 'No'], required: true },
        { id: 's002-q019', name: 'Persona originaria o procedente de áreas conocidas como endémicas de enfermedad transmisible por sangre', type: 'radio', options: ['Sí', 'No'], required: true },
        { id: 's002-q020', name: '¿Ha realizado algún viaje y tenido contacto íntimo con desconocidos?', type: 'radio', options: ['Sí', 'No'], required: true },
        { id: 's002-q021', name: 'Observaciones', type: 'textarea', required: false }
      ]
    }
  ]
};
