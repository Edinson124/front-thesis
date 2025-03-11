export default [
  {
    path: '/uikit/formlayout',
    name: 'formlayout',
    component: () => import('@/views/template/uikit/FormLayout.vue')
  },
  {
    path: '/uikit/input',
    name: 'input',
    component: () => import('@/views/template/uikit/InputDoc.vue')
  },
  {
    path: '/uikit/button',
    name: 'button',
    component: () => import('@/views/template/uikit/ButtonDoc.vue')
  },
  {
    path: '/uikit/table',
    name: 'table',
    component: () => import('@/views/template/uikit/TableDoc.vue')
  },
  {
    path: '/uikit/list',
    name: 'list',
    component: () => import('@/views/template/uikit/ListDoc.vue')
  },
  {
    path: '/uikit/tree',
    name: 'tree',
    component: () => import('@/views/template/uikit/TreeDoc.vue')
  },
  {
    path: '/uikit/panel',
    name: 'panel',
    component: () => import('@/views/template/uikit/PanelsDoc.vue')
  },

  {
    path: '/uikit/overlay',
    name: 'overlay',
    component: () => import('@/views/template/uikit/OverlayDoc.vue')
  },
  {
    path: '/uikit/media',
    name: 'media',
    component: () => import('@/views/template/uikit/MediaDoc.vue')
  },
  {
    path: '/uikit/message',
    name: 'message',
    component: () => import('@/views/template/uikit/MessagesDoc.vue')
  },
  {
    path: '/uikit/file',
    name: 'file',
    component: () => import('@/views/template/uikit/FileDoc.vue')
  },
  {
    path: '/uikit/menu',
    name: 'menu',
    component: () => import('@/views/template/uikit/MenuDoc.vue')
  },
  {
    path: '/uikit/charts',
    name: 'charts',
    component: () => import('@/views/template/uikit/ChartDoc.vue')
  },
  {
    path: '/uikit/misc',
    name: 'misc',
    component: () => import('@/views/template/uikit/MiscDoc.vue')
  },
  {
    path: '/uikit/timeline',
    name: 'timeline',
    component: () => import('@/views/template/uikit/TimelineDoc.vue')
  },
  {
    path: '/pages/empty',
    name: 'empty',
    component: () => import('@/views/template/pages/Empty.vue')
  },
  {
    path: '/pages/crud',
    name: 'crud',
    component: () => import('@/views/template/pages/Crud.vue')
  },
  {
    path: '/landing',
    name: 'landing',
    component: () => import('@/views/template/pages/Landing.vue')
  },
  {
    path: '/pages/notfound',
    name: 'notfound',
    component: () => import('@/views/template/pages/NotFound.vue')
  },
  {
    path: '/auth/login',
    name: 'login',
    component: () => import('@/views/template/pages/auth/Login.vue')
  },
  {
    path: '/auth/access',
    name: 'accessDenied',
    component: () => import('@/views/template/pages/auth/Access.vue')
  },
  {
    path: '/auth/error',
    name: 'error',
    component: () => import('@/views/template/pages/auth/Error.vue')
  }
];
