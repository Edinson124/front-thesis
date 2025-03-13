export const Menu = [
  {
    label: '',
    items: [
      {
        label: 'Admin',
        icon: 'mdi mdi-shield-account',
        items: [
          {
            label: 'Variables globales',
            to: '/admin/variables'
          },
          {
            label: 'Usuarios',
            to: '/admin/users'
          },
          {
            label: 'Roles'
          },
          {
            label: 'Bancos de sangre',
            to: '/admin/bancos'
          },
          {
            label: 'Redes',
            to: '/admin/redes'
          }
        ]
      },
      {
        label: 'Dashboards',
        icon: 'mdi mdi-monitor-dashboard'
      },
      {
        label: 'Donantes',
        icon: 'mdi mdi-account-multiple-outline',
        items: [
          {
            label: 'Registrar Donación'
          },
          {
            label: 'Consultar donantes'
          }
        ]
      },
      {
        label: 'Laboratorios',
        icon: 'mdi mdi-test-tube',
        items: [
          {
            label: 'Resultados de tamizaje'
          },
          {
            label: 'Resultados pruebas cruzadas'
          }
        ]
      },
      {
        label: 'Inventario',
        icon: 'mdi mdi-database-outline',
        items: [
          {
            label: 'Unidades en stock'
          },
          {
            label: 'Unidades por vencer'
          }
        ]
      },
      {
        label: 'Stock externo',
        icon: 'mdi mdi-lan',
        items: [
          {
            label: 'Consultar stock externo'
          },
          {
            label: 'Solicitudes de apoyo'
          },
          {
            label: 'Solicitudes de envio'
          }
        ]
      },
      {
        label: 'Tranfusion',
        icon: 'mdi mdi-needle',
        items: [
          {
            label: 'Pacientes'
          },
          {
            label: 'Solicitud de unidades'
          }
        ]
      },
      {
        label: 'Interoperabilidad',
        icon: 'mdi mdi-wan',
        items: [
          {
            label: 'Comsulta información externa'
          }
        ]
      }
    ]
  },
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
