import shipmentAssignmentService from '@/services/networks/shipmentAssignment';
import { defineStore } from 'pinia';

export const useShipmentAssignmentStore = defineStore('shipmentAssignment', () => {
  const saveShipmentAssignment = async (transfusionId, idUnit) => {
    try {
      const response = await shipmentAssignmentService.saveShipmentAssignment(transfusionId, idUnit);
      return response;
    } catch (error) {
      console.error('Error al guardar la asignacion: ', error);
      return null;
    }
  };

  const deleteShipmentAssignment = async (idTransfusionAssignment) => {
    try {
      const response = await shipmentAssignmentService.deleteShipmentAssignment(idTransfusionAssignment);
      return response;
    } catch (error) {
      console.error('Error al eliminar la asignacion: ', error);
      return null;
    }
  };

  return {
    saveShipmentAssignment,
    deleteShipmentAssignment
  };
});
