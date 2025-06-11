import transfusionService from '@/services/tranfusion/transfusions';
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

export const useTransfusionStore = defineStore('tranfusion', () => {
  const tranfusionByPatient = reactive([]);
  const totalRecordsTranfusionByPatient = ref(0);
  const currentPageTranfusionByPatient = ref(0);

  const transfusions = reactive([]);
  const totalRecords = ref(0);
  const currentPage = ref(0);

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

  const getTransfusions = async (filters = {}, page = 0) => {
    try {
      const response = await transfusionService.getTransfusions(filters, page);
      transfusions.splice(0, transfusions.length, ...response.content);
      totalRecords.value = response.totalElements;
      currentPage.value = page;
      return true;
    } catch (error) {
      console.error('Error al obtener las unidades en cuarentena: ', error);
      return false;
    }
  };

  const verifyTransfusionByCode = async (id) => {
    try {
      const response = await transfusionService.verifyTransfusionByCode(id);
      return response;
    } catch (error) {
      console.error('Error al verificar transfusión: ', error);
      return null;
    }
  };

  const getTranfusionDetail = async (id) => {
    try {
      const response = await transfusionService.getTranfusionDetail(id);
      return response;
    } catch (error) {
      console.error('Error al verificar transfusión: ', error);
      return null;
    }
  };

  const getTranfusionAllInfo = async (id) => {
    try {
      const response = await transfusionService.getTranfusionAllInfo(id);
      return response;
    } catch (error) {
      console.error('Error al verificar transfusión: ', error);
      return null;
    }
  };

  const registerTransfusionRequest = async (transfusion) => {
    try {
      const response = await transfusionService.registerTransfusionRequest(transfusion);
      return response;
    } catch (error) {
      console.error('Error al registrar nueva transfusión: ', error);
      return null;
    }
  };

  const editTransfusionRequest = async (transfusion) => {
    try {
      const response = await transfusionService.editTransfusionRequest(transfusion);
      return response;
    } catch (error) {
      console.error('Error al editar nueva transfusión: ', error);
      return null;
    }
  };

  return {
    tranfusionByPatient,
    totalRecordsTranfusionByPatient,
    currentPageTranfusionByPatient,
    transfusions,
    totalRecords,
    currentPage,
    getTransfusionsByDocumentPatient,
    getTransfusions,
    verifyTransfusionByCode,
    getTranfusionDetail,
    getTranfusionAllInfo,
    registerTransfusionRequest,
    editTransfusionRequest
  };
});
