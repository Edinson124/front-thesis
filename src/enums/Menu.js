export const MenuRoutes = [
  { id: 'root', label: '' },
  { id: 'admin', label: 'Admin', icon: 'mdi mdi-shield-account', parentId: 'root' },
  { id: 'admin-variables', label: 'Variables globales', to: '/admin/variables', parentId: 'admin' },
  { id: 'admin-users', label: 'Usuarios', to: '/admin/users', parentId: 'admin' },
  { id: 'admin-roles', label: 'Roles', to: '/admin/roles', parentId: 'admin' },
  { id: 'admin-blood-banks', label: 'Bancos de sangre', to: '/admin/blood-banks', parentId: 'admin' },
  { id: 'admin-redes', label: 'Redes', to: '/admin/redes', parentId: 'admin' },
  { id: 'dashboards', label: 'Estadísticas', icon: 'mdi mdi-monitor-dashboard', parentId: 'root' },
  { id: 'donation', label: 'Donaciones', icon: 'mdi mdi-account-multiple-outline', parentId: 'root' },
  { id: 'donor-new', label: 'Registrar donante', to: '/donation/donor/new', parentId: 'donation' },
  { id: 'donor-search', label: 'Consultar donante', to: '/donation/donor/search', parentId: 'donation' },
  { id: 'donation-search-donor', label: 'Registrar donación', to: '/donation/search/donor', parentId: 'donation' },
  { id: 'donation-search', label: 'Consultar donación', to: '/donation/search', parentId: 'donation' },
  { id: 'donation-interview', label: 'Entrevista', to: '/donation/interview', parentId: 'donation' },
  { id: 'donation-extraction', label: 'Extracción', to: '/donation/extraction', parentId: 'donation' },
  { id: 'donation-sample', label: 'Muestras', to: '/donation/sample', parentId: 'donation' },
  { id: 'donation-physical-exam', label: 'Exámen Físico', to: '/donation/physical', parentId: 'donation' },
  { id: 'laboratory', label: 'Laboratorio', icon: 'mdi mdi-test-tube', parentId: 'root' },
  { id: 'laboratory-hematological-search', label: 'Registrar resultado hematológico', to: '/laboratory/hematological/search', parentId: 'laboratory' },
  { id: 'laboratory-serology-search', label: 'Registrar resultado serológico', to: '/laboratory/serology/search', parentId: 'laboratory' },
  { id: 'laboratory-units-quarantined', label: 'Unidades en cuarentena', to: '/laboratory/units/quarantined', parentId: 'laboratory' },
  { id: 'laboratory-units-transformation', label: 'Unidades para fraccionar', to: '/laboratory/units/transformation', parentId: 'laboratory' },
  { id: 'inventory', label: 'Unidades', icon: 'mdi mdi-database-outline', parentId: 'root' },
  { id: 'inventory-stock', label: 'Unidades en stock', parentId: 'inventory' },
  { id: 'inventory-maturity', label: 'Unidades por vencer', parentId: 'inventory' },
  { id: 'transfusion', label: 'Transfusión', icon: 'mdi mdi-blood-bag', parentId: 'root' },
  { id: 'transfusion-patients', label: 'Pacientes', parentId: 'transfusion' },
  { id: 'transfusion-units', label: 'Solicitud de unidades', parentId: 'transfusion' },
  { id: 'extern', label: 'Redes', icon: 'mdi mdi-lan', parentId: 'root' },
  { id: 'extern-query', label: 'Consultar stock externo', parentId: 'extern' },
  { id: 'extern-support', label: 'Solicitudes de apoyo', parentId: 'extern' },
  { id: 'extern-shipment', label: 'Solicitudes de envio', parentId: 'extern' },
  { id: 'interoperability', label: 'Interoperabilidad', icon: 'mdi mdi-wan', parentId: 'root' },
  { id: 'interoperability-query', label: 'Consulta información externa', parentId: 'interoperability' }
];

export const extraRoutes = [
  { id: 'admin-users-new', label: 'Nuevo Usuario', to: '/admin/users/new', parentId: 'admin-users' },
  { id: 'admin-users-edit', label: 'Editar Usuario', to: '/admin/users/:id', parentId: 'admin-users' },
  { id: 'admin-roles-edit', label: 'Editar Rol', to: '/admin/roles/:id', parentId: 'admin-roles' },
  { id: 'admin-blood-banks-new', label: 'Nuevo Banco de Sangre', to: '/admin/blood-banks/new', parentId: 'admin-blood-banks' },
  { id: 'admin-blood-banks-edit', label: 'Editar Banco de Sangre', to: '/admin/blood-banks/:id', parentId: 'admin-blood-banks' },
  { id: 'donor-view', label: 'Visualizar donante', to: '/donation/donor/:type/:doc', parentId: 'donor-search' },
  { id: 'donation-new', label: 'Registrar donación', to: '/donation/new/:type/:doc', parentId: 'donation-search-donor' },
  { id: 'donation-view', label: 'Visualizar donación', to: '/donation/view', parentId: 'donation-search' },
  { id: 'laboratory-serology', label: 'Resultado serológico', to: '/laboratory/serology', parentId: 'laboratory-serology-search' },
  { id: 'laboratory-hematological', label: 'Resultado hematológico', to: '/laboratory/hematological', parentId: 'laboratory-hematological-search' },
  { id: 'laboratory-view-unit-quarantined', label: 'Visualizar unidad en cuarentena', to: '/laboratory/view/unit/quarantined', parentId: 'laboratory-units-quarantined' },
  { id: 'laboratory-unit-transformation', label: 'Fraccionar unidad', to: '/laboratory/unit/transformation', parentId: 'laboratory-units-transformation' }
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
