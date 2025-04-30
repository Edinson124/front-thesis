import rolesService from '@/services/roles';
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

export const useRolesStore = defineStore('roles', () => {
  const roles = reactive([]);
  const rolesOptions = reactive([]);
  const allPermissions = reactive([]);
  const totalRecords = ref(0);
  const currentPage = ref(0);

  const getRoles = async (filters = {}, page = 0) => {
    try {
      const response = await rolesService.getRoles(filters, page);
      roles.splice(0, roles.length, ...response.content);
      totalRecords.value = response.totalElements;
      currentPage.value = page;
      return true;
    } catch (error) {
      console.error('Error al obtener roles: ', error);
      return false;
    }
  };

  const getRolesOptions = async () => {
    try {
      const response = await rolesService.getRolesOptions();
      rolesOptions.splice(0, rolesOptions.length, ...response);
      return true;
    } catch (error) {
      console.error('Error al obtener bancos de sangre: ', error);
      return false;
    }
  };

  const getAllPermissions = async () => {
    try {
      const response = await rolesService.getAllPermissions();
      allPermissions.splice(0, allPermissions.length, ...response);
      return true;
    } catch (error) {
      console.error('Error al obtener roles: ', error);
      return false;
    }
  };

  const getRole = async (roleId) => {
    try {
      const response = await rolesService.getRole(roleId);
      return response;
    } catch (error) {
      console.error('Error al obtener rol: ', error);
      return null;
    }
  };

  const editRole = async (role) => {
    try {
      await rolesService.editRole(role);
      return true;
    } catch (error) {
      console.error('Error al crear usuario: ', error);
      return false;
    }
  };

  const toogleStatus = async (roleId) => {
    try {
      const response = await rolesService.toogleStatusRole(roleId);
      const index = roles.findIndex((u) => u.id === roleId);
      roles[index] = response;
      return true;
    } catch (error) {
      console.error('Error al cambiar de estado en el rol: ', error);
      return false;
    }
  };

  return { roles, totalRecords, currentPage, rolesOptions, allPermissions, getRolesOptions, getRoles, getAllPermissions, getRole, editRole, toogleStatus };
});
