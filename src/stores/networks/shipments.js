import shipmentService from '@/services/networks/shipments';
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

export const useShipmentStore = defineStore('shipments', () => {
  const shipments = reactive([]);
  const totalRecords = ref(0);
  const currentPage = ref(0);

  const bloodBanksOptions = reactive([]);
  const networkOptions = reactive([]);

  const getShipments = async (filters = {}, page = 0) => {
    try {
      const response = await shipmentService.getShipments(filters, page);
      shipments.splice(0, shipments.length, ...response.content);
      totalRecords.value = response.totalElements;
      currentPage.value = page;
      return true;
    } catch (error) {
      console.error('Error al obtener solicitudes de transferencia: ', error);
      return false;
    }
  };

  const getMyShipments = async (filters = {}, page = 0) => {
    try {
      const response = await shipmentService.getMyShipments(filters, page);
      shipments.splice(0, shipments.length, ...response.content);
      totalRecords.value = response.totalElements;
      currentPage.value = page;
      return true;
    } catch (error) {
      console.error('Error al obtener mis solicitudes de transferencia: ', error);
      return false;
    }
  };

  const getShipmentsNetwork = async () => {
    try {
      const response = await shipmentService.getShipmentsNetwork();
      networkOptions.splice(0, networkOptions.length, ...response);
      return true;
    } catch (error) {
      console.error('Error al obtener redes bancos de sangre: ', error);
      return false;
    }
  };

  const createShipment = async (shipmentRequest) => {
    try {
      const response = await shipmentService.createShipment(shipmentRequest);
      return response;
    } catch (error) {
      console.error('Error al crear una solicitud de transferencia: ', error);
      return false;
    }
  };

  const editShipment = async (idShipment, shipmentRequest) => {
    try {
      console.log('store', shipmentRequest);
      const response = await shipmentService.editShipment(idShipment, shipmentRequest);
      return response;
    } catch (error) {
      console.error('Error al crear una solicitud de transferencia: ', error);
      return false;
    }
  };

  const getShipment = async (idShipment) => {
    try {
      const response = await shipmentService.getShipmentById(idShipment);
      return response;
    } catch (error) {
      console.error('Error al obtener una solicitud de transferencia: ', error);
      return false;
    }
  };

  const sendShipment = async (idShipment) => {
    try {
      const response = await shipmentService.sendShipment(idShipment);
      return response;
    } catch (error) {
      console.error('Error al solicitar una transferencia: ', error);
      return false;
    }
  };

  const getShipmentWithAssignmentResponse = async (idShipment) => {
    try {
      const response = await shipmentService.getShipmentWithAssignmentResponse(idShipment);
      return response;
    } catch (error) {
      console.error('Error al obtener solicitud de transferencia: ', error);
      return false;
    }
  };

  const getShipmentWithAssignmentView = async (idShipment) => {
    try {
      const response = await shipmentService.getShipmentWithAssignmentView(idShipment);
      return response;
    } catch (error) {
      console.error('Error al obtener solicitud de transferencia: ', error);
      return false;
    }
  };

  const freeUnit = async (idShipment) => {
    try {
      const response = await shipmentService.freeUnit(idShipment);
      return response;
    } catch (error) {
      console.error('Error al liberar unidades de la solicitud de transferencia: ', error);
      return false;
    }
  };

  const confirmReception = async (idShipment) => {
    try {
      const response = await shipmentService.confirmReception(idShipment);
      return response;
    } catch (error) {
      console.error('Error al confirmar recepción de unidades de la solicitud de transferencia: ', error);
      return false;
    }
  };

  return {
    shipments,
    totalRecords,
    currentPage,
    bloodBanksOptions,
    networkOptions,
    getShipments,
    getMyShipments,
    getShipmentsNetwork,
    createShipment,
    editShipment,
    sendShipment,
    getShipment,
    getShipmentWithAssignmentResponse,
    getShipmentWithAssignmentView,
    freeUnit,
    confirmReception
  };
});
