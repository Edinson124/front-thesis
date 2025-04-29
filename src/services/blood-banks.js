import { get, patch } from '@/api';
import fakeService from '@/services/fake/blood-banks';

const FAKE_MODE = import.meta.env.VITE_FAKE_API === 'true';

const getBloodBanks = async (filters = {}, page = 0) => {
  try {
    throw new Error('No roles paginated');
    // let queryString = new URLSearchParams();
    // queryString.append('page', page);

    // for (const key in filters) {
    //   if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
    //     queryString.append(key, filters[key]);
    //   }
    // }

    // const response = await get(`/blood-banks?${queryString.toString()}`);
    // return response;
  } catch (error) {
    if (FAKE_MODE) {
      return fakeService.getBloodBanks(filters, page);
    }
    console.error('Error al obtener bancos de sangre: ', error);
    return [];
  }
};

const getBloodBank = async (bloodBankId) => {
  try {
    const response = await get(`/blood-banks/${bloodBankId}`);
    return response;
  } catch (error) {
    if (FAKE_MODE) {
      return fakeService.getBloodBank(bloodBankId);
    }
    console.error('Error al crear banco de sangre: ', error);
    return null;
  }
};

const toogleStatusBloodBank = async (bloodBankId) => {
  try {
    const response = await patch(`/blood-banks/status/${bloodBankId}`);
    return response;
  } catch (error) {
    if (FAKE_MODE) {
      return fakeService.toogleStatusBloodBank(bloodBankId);
    }
    console.error('Error al cambiar de estado al banco de sangre: ', error);
    return null;
  }
};

export default {
  getBloodBanks,
  getBloodBank,
  toogleStatusBloodBank
};
