<script setup>
import { MenuRoutes } from '@/enums/Menu';
import { useLayout } from '@/layout/composables/layout';
import Breadcrumb from 'primevue/breadcrumb';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import AppFooter from './AppFooter.vue';
import AppSidebar from './AppSidebar.vue';
import AppTopbar from './AppTopbar.vue';

const { layoutConfig, layoutState, isSidebarActive } = useLayout();

const home = ref({ icon: 'pi pi-home', to: '/' });

function generateBreadcrumb(items, itemId) {
  const breadcrumb = [];
  let currentItem = items.find((item) => item.id === itemId);

  while (currentItem) {
    breadcrumb.unshift(currentItem);
    currentItem = items.find((item) => item.id === currentItem.parentId);
  }

  return breadcrumb;
}

const route = useRoute();
const pathItems = computed(() => {
  const currentItem = MenuRoutes.find((item) => item.to === route.path);
  const breadcrumb = currentItem ? generateBreadcrumb(MenuRoutes, currentItem.id) : [];
  breadcrumb.shift(); // remove root item
  return breadcrumb.map((item) => ({ label: item.label }));
});

const outsideClickListener = ref(null);

watch(isSidebarActive, (newVal) => {
  if (newVal) {
    bindOutsideClickListener();
  } else {
    unbindOutsideClickListener();
  }
});

const containerClass = computed(() => {
  return {
    'layout-overlay': layoutConfig.menuMode === 'overlay',
    'layout-static': layoutConfig.menuMode === 'static',
    'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
    'layout-overlay-active': layoutState.overlayMenuActive,
    'layout-mobile-active': layoutState.staticMenuMobileActive
  };
});

function bindOutsideClickListener() {
  if (!outsideClickListener.value) {
    outsideClickListener.value = (event) => {
      if (isOutsideClicked(event)) {
        layoutState.overlayMenuActive = false;
        layoutState.staticMenuMobileActive = false;
        layoutState.menuHoverActive = false;
      }
    };
    document.addEventListener('click', outsideClickListener.value);
  }
}

function unbindOutsideClickListener() {
  if (outsideClickListener.value) {
    document.removeEventListener('click', outsideClickListener);
    outsideClickListener.value = null;
  }
}

function isOutsideClicked(event) {
  const sidebarEl = document.querySelector('.layout-sidebar');
  const topbarEl = document.querySelector('.layout-menu-button');

  return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
}
</script>

<template>
  <div class="layout-wrapper" :class="containerClass">
    <app-topbar></app-topbar>
    <app-sidebar></app-sidebar>
    <div class="layout-main-container">
      <div class="layout-main">
        <Breadcrumb :home="home" :model="pathItems"></Breadcrumb>
        <router-view></router-view>
      </div>
      <app-footer></app-footer>
    </div>
    <div class="layout-mask animate-fadein"></div>
  </div>
  <Toast />
</template>
