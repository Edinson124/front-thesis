import transfusionResultService from '@/services/tranfusion/transfusionResult';
import { defineStore } from 'pinia';

export const useTransfusionResultStore = defineStore('transfusionResult', () => {
  const newTransfusionResult = async (transfusionId, transfusionResult) => {
    try {
      const transfusionDatePeru = new Date(transfusionResult.transfusionDate);
      transfusionDatePeru.setHours(transfusionDatePeru.getHours() - 5); // Restar 5 horas

      // Actualiza la fecha de transfusión
      transfusionResult.transfusionDate = transfusionDatePeru.toISOString();
      const response = await transfusionResultService.newTransfusionResult(transfusionId, transfusionResult);
      return response;
    } catch (error) {
      console.error('Error al crear una donación: ', error);
      return null;
    }
  };

  return {
    newTransfusionResult
  };
});
