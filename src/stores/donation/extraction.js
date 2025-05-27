import extractionService from '@/services/donation/extraction';
import { defineStore } from 'pinia';

export const useExtractionStore = defineStore('extraction', () => {
  const createExtraction = async (extraction) => {
    try {
      if (extraction.startDate && extraction.startTime) {
        const startDateTime = new Date(extraction.startDate);
        const startTime = new Date(extraction.startTime);
        // Establece las horas y minutos de startDateTime usando startTime
        startDateTime.setHours(startTime.getHours());
        startDateTime.setMinutes(startTime.getMinutes());
        // Suma la duración en minutos
        extraction.startDateTime = startDateTime.toISOString();
        delete extraction.startDate;
        delete extraction.startTime;
      }
      const response = await extractionService.createExtraction(extraction);
      return response;
    } catch (error) {
      console.error('Error al registrar extracción: ', error);
      return null;
    }
  };

  const getExtraction = async (donationId) => {
    try {
      const response = await extractionService.getExtraction(donationId);
      if (response?.startDateTime) {
        const [datePart, timePart] = response.startDateTime.split(' ');
        const [day, month, year] = datePart.split('/');
        const [hours, minutes, seconds] = timePart.split(':');
        const startDate = new Date(year, parseInt(month) - 1, day, 0, 0, 0);
        const startTime = new Date(year, parseInt(month) - 1, day, hours, minutes, seconds);

        response.startDate = startDate;
        response.startTime = startTime;
      }
      return response;
    } catch (error) {
      console.error('Error al obtener el examen físico: ', error);
      return null;
    }
  };

  const updateExtraction = async (idPhysical, extraction) => {
    try {
      if (extraction.startDate && extraction.startTime) {
        const startDateTime = new Date(extraction.startDate);
        const startTime = new Date(extraction.startTime);
        // Establece las horas y minutos de startDateTime usando startTime
        startDateTime.setHours(startTime.getHours());
        startDateTime.setMinutes(startTime.getMinutes());
        // Suma la duración en minutos
        extraction.startDateTime = startDateTime.toISOString();
        delete extraction.startDate;
        delete extraction.startTime;
      }
      const response = await extractionService.updateExtraction(idPhysical, extraction);
      return response;
    } catch (error) {
      console.error('Error al editar el examen físico: ', error);
      return null;
    }
  };

  return {
    createExtraction,
    getExtraction,
    updateExtraction
  };
});
