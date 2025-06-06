import { del, post } from '@/api';

const saveShipmentAssignment = async (idShipment, idUnit) => {
  try {
    const response = await post(`/shipment-assignment/${idShipment}/${idUnit}`);
    return response;
  } catch (error) {
    console.error('Error al guardar la asignacion: ', error);
    return null;
  }
};

const deleteShipmentAssignment = async (idShipmentAssignment) => {
  try {
    const response = await del(`/shipment-assignment/${idShipmentAssignment}`);
    return response;
  } catch (error) {
    console.error('Error al eliminar la asignacion: ', error);
    return null;
  }
};

export default {
  saveShipmentAssignment,
  deleteShipmentAssignment
};
