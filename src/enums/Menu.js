export const MenuRoutes = [
  { id: 'root', label: '' },
  { id: 'admin', label: 'Admin', icon: 'mdi mdi-shield-account', parentId: 'root' },
  { id: 'admin-variables', label: 'Variables globales', to: '/admin/variables', parentId: 'admin' },
  { id: 'admin-users', label: 'Usuarios', to: '/admin/users', parentId: 'admin' },
  { id: 'admin-roles', label: 'Roles', parentId: 'admin' },
  { id: 'admin-bancos', label: 'Bancos de sangre', to: '/admin/bancos', parentId: 'admin' },
  { id: 'admin-redes', label: 'Redes', to: '/admin/redes', parentId: 'admin' },
  { id: 'dashboards', label: 'Dashboards', icon: 'mdi mdi-monitor-dashboard', parentId: 'root' },
  { id: 'donantes', label: 'Donantes', icon: 'mdi mdi-account-multiple-outline', parentId: 'root' },
  { id: 'donantes-registrar', label: 'Registrar Donación', parentId: 'donantes' },
  { id: 'donantes-consultar', label: 'Consultar donantes', parentId: 'donantes' },
  { id: 'laboratory', label: 'Laboratorios', icon: 'mdi mdi-test-tube', parentId: 'root' },
  { id: 'laboratory-results', label: 'Resultados de tamizaje', parentId: 'laboratory' },
  { id: 'laboratory-tests', label: 'Resultados pruebas cruzadas', parentId: 'laboratory' },
  { id: 'inventory', label: 'Inventario', icon: 'mdi mdi-database-outline', parentId: 'root' },
  { id: 'inventory-stock', label: 'Unidades en stock', parentId: 'inventory' },
  { id: 'inventory-maturity', label: 'Unidades por vencer', parentId: 'inventory' },
  { id: 'extern', label: 'Stock externo', icon: 'mdi mdi-lan', parentId: 'root' },
  { id: 'extern-query', label: 'Consultar stock externo', parentId: 'extern' },
  { id: 'extern-support', label: 'Solicitudes de apoyo', parentId: 'extern' },
  { id: 'extern-shipment', label: 'Solicitudes de envio', parentId: 'extern' },
  { id: 'transfusion', label: 'Transfusión', icon: 'mdi mdi-needle', parentId: 'root' },
  { id: 'transfusion-patients', label: 'Pacientes', parentId: 'transfusion' },
  { id: 'transfusion-units', label: 'Solicitud de unidades', parentId: 'transfusion' },
  { id: 'interoperability', label: 'Interoperabilidad', icon: 'mdi mdi-wan', parentId: 'root' },
  { id: 'interoperability-query', label: 'Consulta información externa', parentId: 'interoperability' }
];

export const extraRoutes = [
  { id: 'admin-users-new', label: 'Nuevo Usuario', to: '/admin/users/new', parentId: 'admin-users' },
  { id: 'admin-users-edit', label: 'Editar Usuario', to: '/admin/users/:id', parentId: 'admin-users' }
];

export const breadcrumbs = [...MenuRoutes, ...extraRoutes];

//TODO: Remove template Menu
export const TemplateMenu = [
  {
    label: 'UI Components',
    items: [
      { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/uikit/formlayout' },
      { label: 'Input', icon: 'pi pi-fw pi-check-square', to: '/uikit/input' },
      { label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/uikit/button', class: 'rotated-icon' },
      { label: 'Table', icon: 'pi pi-fw pi-table', to: '/uikit/table' },
      { label: 'List', icon: 'pi pi-fw pi-list', to: '/uikit/list' },
      { label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/uikit/tree' },
      { label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/uikit/panel' },
      { label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/uikit/overlay' },
      { label: 'Media', icon: 'pi pi-fw pi-image', to: '/uikit/media' },
      { label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/uikit/menu' },
      { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/uikit/message' },
      { label: 'File', icon: 'pi pi-fw pi-file', to: '/uikit/file' },
      { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/uikit/charts' },
      { label: 'Timeline', icon: 'pi pi-fw pi-calendar', to: '/uikit/timeline' },
      { label: 'Misc', icon: 'pi pi-fw pi-circle', to: '/uikit/misc' }
    ]
  },
  {
    label: 'Pages',
    icon: 'pi pi-fw pi-briefcase',
    to: '/pages',
    items: [
      {
        label: 'Landing',
        icon: 'pi pi-fw pi-globe',
        to: '/landing'
      },
      {
        label: 'Auth',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'Login',
            icon: 'pi pi-fw pi-sign-in',
            to: '/auth/login'
          },
          {
            label: 'Error',
            icon: 'pi pi-fw pi-times-circle',
            to: '/auth/error'
          },
          {
            label: 'Access Denied',
            icon: 'pi pi-fw pi-lock',
            to: '/auth/access'
          }
        ]
      },
      {
        label: 'Crud',
        icon: 'pi pi-fw pi-pencil',
        to: '/pages/crud'
      },
      {
        label: 'Not Found',
        icon: 'pi pi-fw pi-exclamation-circle',
        to: '/pages/notfound'
      },
      {
        label: 'Empty',
        icon: 'pi pi-fw pi-circle-off',
        to: '/pages/empty'
      }
    ]
  },
  {
    label: 'Hierarchy',
    items: [
      {
        label: 'Submenu 1',
        icon: 'pi pi-fw pi-bookmark',
        items: [
          {
            label: 'Submenu 1.1',
            icon: 'pi pi-fw pi-bookmark',
            items: [
              { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
            ]
          },
          {
            label: 'Submenu 1.2',
            icon: 'pi pi-fw pi-bookmark',
            items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
          }
        ]
      },
      {
        label: 'Submenu 2',
        icon: 'pi pi-fw pi-bookmark',
        items: [
          {
            label: 'Submenu 2.1',
            icon: 'pi pi-fw pi-bookmark',
            items: [
              { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
            ]
          },
          {
            label: 'Submenu 2.2',
            icon: 'pi pi-fw pi-bookmark',
            items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
          }
        ]
      }
    ]
  }
];
