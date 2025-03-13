<script setup>
import { MenuRoutes, TemplateMenu } from '@/enums/Menu';
import { reactive } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

function generateMenu(items, parentId = null) {
  return items
    .filter((item) => item.parentId === parentId || (parentId === null && !item.parentId))
    .map((item) => {
      const children = generateMenu(items, item.id);
      if (children.length > 0) {
        return {
          ...item,
          items: children
        };
      } else {
        return item;
      }
    });
}

//TODO: Remove template Menu
const menu = reactive([...generateMenu(MenuRoutes), ...TemplateMenu]);
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
