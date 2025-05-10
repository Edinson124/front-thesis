import { post } from '@/api';

const newTransfusionResult = async (transfusionId, transfusionResult) => {
  try {
    const response = await post(`/transfusion-result/${transfusionId}`, transfusionResult);
    const transfusionResultId = response?.payload?.id ?? null;
    return transfusionResultId;
  } catch (error) {
    console.error('Error al obtener donaciones: ', error);
    return null;
  }
};

export default {
  newTransfusionResult
};
