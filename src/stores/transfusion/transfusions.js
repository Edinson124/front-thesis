import transfusionService from '@/services/tranfusion/transfusions';
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

export const useTransfusionStore = defineStore('tranfusion', () => {
  const tranfusionByPatient = reactive([]);
  const totalRecordsTranfusionByPatient = ref(0);
  const currentPageTranfusionByPatient = ref(0);

  const getTransfusionsByDocumentPatient = async (documentNumber, documentType, page = 0) => {
    try {
      const response = await transfusionService.getTransfusionsByDocumentPatient(documentNumber, documentType, page);
      tranfusionByPatient.splice(0, tranfusionByPatient.length, ...response.content);
      totalRecordsTranfusionByPatient.value = response.totalElements;
      currentPageTranfusionByPatient.value = page;
      return true;
    } catch (error) {
      console.error('Error al obtener transfusiones: ', error);
      return null;
    }
  };

  return {
    tranfusionByPatient,
    totalRecordsTranfusionByPatient,
    currentPageTranfusionByPatient,
    getTransfusionsByDocumentPatient
  };
});
