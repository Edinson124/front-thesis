import usersService from '@/services-mock/users'; //TODO: cambiar a '@/services/users'
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

export const useUsersStore = defineStore('users', () => {
    const users = reactive([]);
    const totalRecords = ref(0);
    const currentPage = ref(1);

    const getUsers = async (filters = {}, page = 1) => {
        try {
            const response = await usersService.getUsers(filters, page);
            users.splice(0, users.length, ...response.data);
            totalRecords.value = response.totalRecords;
            currentPage.value = page;
            return true;
        } catch (error) {
            console.error('Error al obtener usuarios: ', error);
            return false;
        }
    };

    const newUser = async (user) => {
        try {
            await usersService.newUser(user);
            return true;
        } catch (error) {
            console.error('Error al crear usuario: ', error);
            return false;
        }
    };

    return { users, totalRecords, currentPage, getUsers, newUser };
});
