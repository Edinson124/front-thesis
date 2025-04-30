import { get, patch, put } from '@/api';
import fakeService from '@/services/fake/roles';

const FAKE_MODE = import.meta.env.VITE_FAKE_API === 'true';

const getRoles = async (filters = {}, page = 0) => {
  try {
    throw new Error('No roles paginated');
    // let queryString = new URLSearchParams();
    // queryString.append('page', page);

    // for (const key in filters) {
    //   if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
    //     queryString.append(key, filters[key]);
    //   }
    // }

    // const response = await get(`/roles?${queryString.toString()}`);
    // return response;
  } catch (error) {
    if (FAKE_MODE) {
      return fakeService.getRoles(filters, page);
    }
    console.error('Error al obtener roles: ', error);
    return [];
  }
};

const getRolesOptions = async () => {
  try {
    const response = await get(`/roles/select`);
    return response;
  } catch (error) {
    if (FAKE_MODE) {
      return fakeService.getAllPermissions();
    }
    console.error('Error al obtener permisos de roles: ', error);
    return null;
  }
};

const getAllPermissions = async () => {
  try {
    const response = await get(`/permissions`);
    return response;
  } catch (error) {
    if (FAKE_MODE) {
      return fakeService.getAllPermissions();
    }
    console.error('Error al obtener permisos de roles: ', error);
    return null;
  }
};

const getRole = async (roleId) => {
  try {
    throw new Error('No get role implemented');
    // const response = await get(`/roles/${roleId}`);
    // return response;
  } catch (error) {
    if (FAKE_MODE) {
      return fakeService.getRole(roleId);
    }
    console.error('Error al crear rol: ', error);
    return null;
  }
};

const editRole = async (role) => {
  try {
    const response = await put(`/roles/${role.id}`, role);
    return response;
  } catch (error) {
    if (FAKE_MODE) {
      return fakeService.editRole(role);
    }
    console.error('Error al editar usuario: ', error);
    return null;
  }
};

const toogleStatusRole = async (roleId) => {
  try {
    const response = await patch(`/roles/status/${roleId}`);
    return response;
  } catch (error) {
    if (FAKE_MODE) {
      return fakeService.toogleStatusRole(roleId);
    }
    console.error('Error al cambiar de estado al rol: ', error);
    return null;
  }
};

export default {
  getRoles,
  getRolesOptions,
  getAllPermissions,
  getRole,
  editRole,
  toogleStatusRole
};
