import { get } from '@/api';

const getNetworkToInteroperability = async () => {
  try {
    const response = await get(`/interoperability/networks`);
    return response;
  } catch (error) {
    console.error('Error al obtener redes para interoperabilidad: ', error);
    return null;
  }
};

const getStockInteroperability = async (idBloodBank) => {
  try {
    const response = await get(`/interoperability/stock/${idBloodBank}`);
    return response;
  } catch (error) {
    console.error('Error al obtener stock por interoperabilidad: ', error);
    return null;
  }
};

export default {
  getNetworkToInteroperability,
  getStockInteroperability
};
