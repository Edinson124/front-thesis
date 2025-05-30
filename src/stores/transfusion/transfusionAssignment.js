import transfusionAssignmentService from '@/services/tranfusion/transfusionAssignment';
import { defineStore } from 'pinia';

export const useTransfusionResultStore = defineStore('transfusionAssignment', () => {
  const getBloodOptions = async (transfusionId) => {
    try {
      const response = await transfusionAssignmentService.getBloodOptions(transfusionId);
      return response;
    } catch (error) {
      console.error('Error al obtener tipos de sangre: ', error);
      return null;
    }
  };

  const saveTransfusionAssignment = async (transfusionId, idUnit) => {
    try {
      const response = await transfusionAssignmentService.saveTransfusionAssignment(transfusionId, idUnit);
      return response;
    } catch (error) {
      console.error('Error al guardar la asignacion: ', error);
      return null;
    }
  };

  const deleteTransfusionAssignment = async (idTransfusionAssignment) => {
    try {
      const response = await transfusionAssignmentService.deleteTransfusionAssignment(idTransfusionAssignment);
      return response;
    } catch (error) {
      console.error('Error al eliminar la asignacion: ', error);
      return null;
    }
  };

  const saveValidateResult = async (idTransfusionAssignment, result) => {
    try {
      const response = await transfusionAssignmentService.saveValidateResult(idTransfusionAssignment, result);
      return response;
    } catch (error) {
      console.error('Error al guardar resultado de la asignacion: ', error);
      return null;
    }
  };

  const dispensedUnits = async (idTransfusion, requestDTO) => {
    try {
      const response = await transfusionAssignmentService.dispensedUnits(idTransfusion, requestDTO);
      return response;
    } catch (error) {
      console.error('Error al liberar unidades asignadas: ', error);
      return null;
    }
  };

  return {
    getBloodOptions,
    saveTransfusionAssignment,
    deleteTransfusionAssignment,
    saveValidateResult,
    dispensedUnits
  };
});
