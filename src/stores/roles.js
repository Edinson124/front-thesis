import { Role } from '@/enums/Role';
import rolesService from '@/services/roles';
import { defineStore } from 'pinia';
import { computed, reactive } from 'vue';

export const useRolesStore = defineStore('roles', () => {
  const roles = reactive([]);

  const rolesOptions = computed(() => {
    return roles.map((role) => ({
      id: role.id,
      value: role.name,
      label: Role[role.name]
    }));
  });

  const getRoles = async () => {
    try {
      const response = await rolesService.getRoles();
      roles.splice(0, roles.length, ...response);
      return true;
    } catch (error) {
      console.error('Error al obtener roles: ', error);
      return false;
    }
  };

  return { roles, rolesOptions, getRoles };
});
