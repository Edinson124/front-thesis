import { get, patch, post, put } from '@/api';
import fakeService from '@/services/fake/blood-banks';

const FAKE_MODE = import.meta.env.VITE_FAKE_API === 'true';

const getBloodBanks = async (filters = {}, page = 0) => {
  try {
    let queryString = new URLSearchParams();
    queryString.append('page', page);

    for (const key in filters) {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        queryString.append(key, filters[key]);
      }
    }

    const response = await get(`/blood-bank/paginated?${queryString.toString()}`);
    return response;
  } catch (error) {
    console.error('Error al obtener bancos de sangre: ', error);
    return [];
  }
};

const getBloodBanksExternal = async (filters = {}, page = 0) => {
  try {
    let queryString = new URLSearchParams();
    queryString.append('page', page);

    for (const key in filters) {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        queryString.append(key, filters[key]);
      }
    }

    const response = await get(`/blood-bank/paginated/external?${queryString.toString()}`);
    return response;
  } catch (error) {
    console.error('Error al obtener bancos de sangre: ', error);
    return [];
  }
};

const getBloodBanksOptions = async () => {
  try {
    const response = await get(`/blood-bank/select`);
    return response;
  } catch (error) {
    console.error('Error al obtener opciones de banco de sangre: ', error);
    return null;
  }
};

const getBloodBank = async (bloodBankId) => {
  try {
    const response = await get(`/blood-bank/${bloodBankId}`);
    return response;
  } catch (error) {
    if (FAKE_MODE) {
      return fakeService.getBloodBank(bloodBankId);
    }
    console.error('Error al crear banco de sangre: ', error);
    return null;
  }
};

const newBloodBank = async (bloodBank) => {
  try {
    const response = await post('/blood-bank', bloodBank);
    return response;
  } catch (error) {
    console.error('Error al crear usuario: ', error);
    return null;
  }
};

const editBloodBank = async (bloodBank) => {
  try {
    const response = await put(`/blood-bank/${bloodBank.id}`, bloodBank);
    return response;
  } catch (error) {
    console.error('Error al editar banco de sangre: ', error);
    return null;
  }
};

const getTypesBloodBank = async () => {
  try {
    const response = await get(`/blood-bank-type`);
    return response;
  } catch (error) {
    console.error('Error al crear banco de sangre: ', error);
    return null;
  }
};

const toogleStatusBloodBank = async (bloodBankId) => {
  try {
    const response = await patch(`/blood-bank/status/${bloodBankId}`);
    return response;
  } catch (error) {
    if (FAKE_MODE) {
      return fakeService.toogleStatusBloodBank(bloodBankId);
    }
    console.error('Error al cambiar de estado al banco de sangre: ', error);
    return null;
  }
};

const getBloodBanksOptionsAddNetwork = async (filters = {}, page = 0) => {
  try {
    let queryString = new URLSearchParams();
    queryString.append('page', page);

    for (const key in filters) {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        queryString.append(key, filters[key]);
      }
    }

    const response = await get(`/blood-bank/optionsNetwork?${queryString.toString()}`);
    return response;
  } catch (error) {
    console.error('Error al obtener bancos de sangre: ', error);
    return [];
  }
};

export default {
  getBloodBanks,
  getBloodBanksExternal,
  getBloodBanksOptions,
  getBloodBank,
  newBloodBank,
  editBloodBank,
  getTypesBloodBank,
  toogleStatusBloodBank,
  getBloodBanksOptionsAddNetwork
};
