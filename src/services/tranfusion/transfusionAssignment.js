import { del, get, post, put } from '@/api';

const getBloodOptions = async (transfusionId) => {
  try {
    const response = await get(`/transfusion-assignment/bloodCompatbile/${transfusionId}`);
    return response;
  } catch (error) {
    console.error('Error al obtener tipos de sangre: ', error);
    return null;
  }
};

const saveTransfusionAssignment = async (transfusionId, idUnit) => {
  try {
    const response = await post(`/transfusion-assignment/${transfusionId}/${idUnit}`);
    return response;
  } catch (error) {
    console.error('Error al guardar la asignacion: ', error);
    return null;
  }
};

const deleteTransfusionAssignment = async (idTransfusionAssignment) => {
  try {
    const response = await del(`/transfusion-assignment/${idTransfusionAssignment}`);
    return response;
  } catch (error) {
    console.error('Error al eliminar la asignacion: ', error);
    return null;
  }
};

const saveValidateResult = async (idTransfusionAssignment, result) => {
  try {
    const response = await put(`/transfusion-assignment/${idTransfusionAssignment}`, result);
    return response;
  } catch (error) {
    console.error('Error al guardar resultado de asignacion: ', error);
    return null;
  }
};

const dispensedUnits = async (idTransfusion, requestDTO) => {
  try {
    const response = await put(`/transfusion-assignment/dispensed/${idTransfusion}`, requestDTO);
    return response;
  } catch (error) {
    console.error('Error al liberar unidades asignadas: ', error);
    return null;
  }
};
export default {
  getBloodOptions,
  saveTransfusionAssignment,
  deleteTransfusionAssignment,
  saveValidateResult,
  dispensedUnits
};
