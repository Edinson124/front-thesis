const LOCAL_STORAGE_KEYS = {
  ROLES: 'fake_roles',
  PERMISSIONS: 'fake_permissions'
};

const loadFromStorage = (key, fallback) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : fallback;
};

const saveToStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const defaultPermissions = [
  { id: 1, name: 'Ver Usuarios', description: 'Permite ver usuarios' },
  { id: 2, name: 'Editar Usuarios', description: 'Permite editar usuarios' },
  { id: 3, name: 'Eliminar Usuarios', description: 'Permite eliminar usuarios' },
  { id: 4, name: 'Crear Usuarios', description: 'Permite crear nuevos usuarios' },
  { id: 5, name: 'Ver Roles', description: 'Permite ver la lista de roles' },
  { id: 6, name: 'Editar Roles', description: 'Permite editar roles existentes' },
  { id: 7, name: 'Eliminar Roles', description: 'Permite eliminar roles del sistema' },
  { id: 8, name: 'Crear Roles', description: 'Permite crear nuevos roles' },
  { id: 9, name: 'Ver Permisos', description: 'Permite visualizar todos los permisos' },
  { id: 10, name: 'Asignar Permisos', description: 'Permite asignar permisos a roles' },
  { id: 11, name: 'Ver Proyectos', description: 'Permite ver los proyectos existentes' },
  { id: 12, name: 'Crear Proyectos', description: 'Permite crear nuevos proyectos' },
  { id: 13, name: 'Editar Proyectos', description: 'Permite editar la información de proyectos' },
  { id: 14, name: 'Eliminar Proyectos', description: 'Permite eliminar proyectos del sistema' },
  { id: 15, name: 'Ver Tareas', description: 'Permite ver tareas asociadas a proyectos' },
  { id: 16, name: 'Crear Tareas', description: 'Permite crear nuevas tareas' },
  { id: 17, name: 'Editar Tareas', description: 'Permite editar tareas existentes' },
  { id: 18, name: 'Eliminar Tareas', description: 'Permite eliminar tareas' },
  { id: 19, name: 'Gestionar Equipos', description: 'Permite gestionar los equipos de trabajo' },
  { id: 20, name: 'Acceder Reportes', description: 'Permite acceder a reportes del sistema' }
];

const defaultRoles = [
  { id: 1, name: 'ADMIN', description: 'Es un administrador', status: 'ACTIVE', permissions: [1, 2, 3] },
  {
    id: 2,
    name: 'USER',
    description: 'Es un usuario',
    status: 'ACTIVE',
    permissions: [1, 2]
  },
  { id: 3, name: 'INVITED', description: 'Es un invitado', status: 'ACTIVE', permissions: [] }
];

let fakePermissions = loadFromStorage(LOCAL_STORAGE_KEYS.PERMISSIONS, defaultPermissions);
let fakeRoles = loadFromStorage(LOCAL_STORAGE_KEYS.ROLES, defaultRoles);

const PAGE_SIZE = 10;
const getRoles = async (filters = {}, page = 0) => {
  let filtered = fakeRoles.filter((role) => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null || value === '') return true;
      if (key == 'search') {
        key = 'name';
      }
      const field = String(role[key] || '').toLowerCase();
      return field.includes(String(value).toLowerCase());
    });
  });

  const totalElements = filtered.length;

  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const content = filtered.slice(start, end);

  return {
    content,
    totalElements,
    page
  };
};

const getAllPermissions = async () => {
  return fakePermissions;
};

const getRole = async (roleId) => {
  const role = fakeRoles.find((r) => r.id === parseInt(roleId));
  return role;
};

const editRole = async (role) => {
  const index = fakeRoles.findIndex((r) => r.id === role.id);
  if (index !== -1) {
    fakeRoles[index] = { ...fakeRoles[index], ...role };
    saveToStorage(LOCAL_STORAGE_KEYS.ROLES, fakeRoles);
    return fakeRoles[index];
  }
  return null;
};

const toogleStatusRole = async (roleId) => {
  const role = fakeRoles.find((r) => r.id === roleId);
  if (role) {
    role.status = role.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    saveToStorage(LOCAL_STORAGE_KEYS.ROLES, fakeRoles);
    return role;
  }
  return null;
};

export default {
  getRoles,
  getAllPermissions,
  getRole,
  editRole,
  toogleStatusRole
};
