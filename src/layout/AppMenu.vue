<script setup>
import { MenuRoutes, TemplateMenu } from '@/enums/Menu';
import { onMounted, reactive } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

function generateMenu(items, parentId = null) {
  const role = localStorage.getItem('role');
  const bloodBankType = localStorage.getItem('bloodBankType');

  return items
    .filter((item) => {
      if (role === 'ADMIN') {
        const isRelatedToAdmin = ['admin', 'root'].includes(item.id) || item.parentId === 'admin';
        return isRelatedToAdmin && (item.parentId === parentId || (parentId === null && !item.parentId));
      }

      // Ocultar si es un módulo restringido por el tipo de banco de sangre
      const restrictedModules = ['donation', 'laboratory'];
      const isRestrictedModule = restrictedModules.includes(item.id) || restrictedModules.includes(item.parentId);

      if (isRestrictedModule && bloodBankType !== 'II' && bloodBankType !== 'III') {
        return false;
      }

      // Ocultar ítems exclusivos de admin
      if (item.isAdmin) {
        return false;
      }

      return item.parentId === parentId || (parentId === null && !item.parentId);
    })
    .map((item) => {
      const children = generateMenu(items, item.id);
      return children.length > 0 ? { ...item, items: children } : item;
    });
}

const menu = reactive([...generateMenu(MenuRoutes)]);

onMounted(() => {
  if (import.meta.env.VITE_SHOW_UI_COMPONENTS === 'true') {
    menu.push(...TemplateMenu);
  }
});
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in menu" :key="item">
      <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>
