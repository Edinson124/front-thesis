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

  return {
    createExtraction
  };
});
