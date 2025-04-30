import usersService from '@/services/users';
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

export const useUsersStore = defineStore('users', () => {
  const users = reactive([]);
  const totalRecords = ref(0);
  const currentPage = ref(0);

  const getUsers = async (filters = {}, page = 0) => {
    try {
      const response = await usersService.getUsers(filters, page);
      users.splice(0, users.length, ...response.content);
      totalRecords.value = response.totalElements;
      currentPage.value = page;
      return true;
    } catch (error) {
      console.error('Error al obtener usuarios: ', error);
      return false;
    }
  };

  const verifyUser = async (documentNumber) => {
    try {
      const response = await usersService.verifyUser(documentNumber);
      return response;
    } catch (error) {
      console.error('Error al verificar usuario: ', error);
      return null;
    }
  };

  const getUser = async (userId) => {
    try {
      const response = await usersService.getUser(userId);
      return response;
    } catch (error) {
      console.error('Error al crear usuario: ', error);
      return null;
    }
  };

  const newUser = async ({ user, roleIds }) => {
    try {
      await usersService.newUser({ user, roleIds });
      return true;
    } catch (error) {
      console.error('Error al crear usuario: ', error);
      return false;
    }
  };

  const editUser = async ({ user, rolesIds }) => {
    try {
      await usersService.editUser({ user, rolesIds });
      return true;
    } catch (error) {
      console.error('Error al crear usuario: ', error);
      return false;
    }
  };

  const toogleStatusUser = async (userId) => {
    try {
      const response = await usersService.toogleStatusUser(userId);
      const userIndex = users.findIndex((u) => u.id === userId);
      users[userIndex] = response;
      return true;
    } catch (error) {
      console.error('Error al desactivar usuario: ', error);
      return false;
    }
  };

  return { users, totalRecords, currentPage, getUsers, getUser, verifyUser, newUser, editUser, toogleStatusUser };
});
