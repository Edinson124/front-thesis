import { get, post, put } from '@/api';

const getShipments = async (filters = {}, page = 0) => {
  try {
    let queryString = new URLSearchParams();
    queryString.append('page', page);

    for (const key in filters) {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        queryString.append(key, filters[key]);
      }
    }

    const response = await get(`/shipments?${queryString.toString()}`);
    return response;
  } catch (error) {
    console.error('Error al obtener solicitudes de envio: ', error);
    return [];
  }
};

const getMyShipments = async (filters = {}, page = 0) => {
  try {
    let queryString = new URLSearchParams();
    queryString.append('page', page);

    for (const key in filters) {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        queryString.append(key, filters[key]);
      }
    }

    const response = await get(`/shipments/my?${queryString.toString()}`);
    return response;
  } catch (error) {
    console.error('Error al obtener mis solicitudes de envio: ', error);
    return [];
  }
};

const getShipmentsNetwork = async () => {
  try {
    const response = await get(`/shipments/networks`);
    return response;
  } catch (error) {
    console.error('Error al obtener las redes de banco de sangre: ', error);
    return [];
  }
};

const createShipment = async (shipmentRequest) => {
  try {
    const response = await post(`/shipments`, shipmentRequest);
    return response;
  } catch (error) {
    console.error('Error al crear una solicitud de transferencia: ', error);
    return null;
  }
};
const editShipment = async (idShipment, shipmentRequest) => {
  try {
    const response = await put(`/shipments/${idShipment}`, shipmentRequest);
    return response;
  } catch (error) {
    console.error('Error al crear una solicitud de transferencia: ', error);
    return null;
  }
};
const sendShipment = async (idShipment) => {
  try {
    const response = await put(`/shipments/send/${idShipment}`);
    return response;
  } catch (error) {
    console.error('Error al enviar una solicitud de transferencia: ', error);
    return null;
  }
};

const getShipmentById = async (idShipment) => {
  try {
    const response = await get(`/shipments/${idShipment}`);
    return response;
  } catch (error) {
    console.error('Error al obtener solicitud de transferencia: ', error);
    return null;
  }
};

const getShipmentWithAssignmentResponse = async (idShipment) => {
  try {
    const response = await get(`/shipments/response/assignment/${idShipment}`);
    return response;
  } catch (error) {
    console.error('Error al obtener solicitud de transferencia: ', error);
    return null;
  }
};

const getShipmentWithAssignmentView = async (idShipment) => {
  try {
    const response = await get(`/shipments/view/assignment/${idShipment}`);
    return response;
  } catch (error) {
    console.error('Error al obtener solicitud de transferencia: ', error);
    return [];
  }
};

const freeUnit = async (idShipment) => {
  try {
    const response = await post(`/shipments/freeUnit/${idShipment}`);
    return response;
  } catch (error) {
    console.error('Error al liberar unidades de la solicitud de transferencia: ', error);
    return [];
  }
};

const confirmReception = async (idShipment) => {
  try {
    const response = await post(`/shipments/reception/${idShipment}`);
    return response;
  } catch (error) {
    console.error('Error al liberar unidades de la solicitud de transferencia: ', error);
    return [];
  }
};

export default {
  getShipments,
  getMyShipments,
  getShipmentsNetwork,
  createShipment,
  editShipment,
  sendShipment,
  getShipmentById,
  getShipmentWithAssignmentResponse,
  getShipmentWithAssignmentView,
  freeUnit,
  confirmReception
};
