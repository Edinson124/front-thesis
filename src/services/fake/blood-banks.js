const LOCAL_STORAGE_KEYS = {
  BLOOD_BANKS: 'fake_blood_banks'
};

const loadFromStorage = (key, fallback) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : fallback;
};

const saveToStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const defaultBloodBanks = [
  {
    id: '104490',
    name: 'BANCO DE SANGRE DE TRUJILLO',
    address: 'Av. Los Conquistadores del Ejército de Chavín 133',
    location: 'LA LIBERTAD / TRUJILLO / TRUJILLO',
    coordinator: 'Juan Medrano Suarez',
    type: 'IA',
    status: 'ACTIVE'
  },
  {
    id: '204591',
    name: 'BANCO DE SANGRE DE LIMA',
    address: 'Av. Ejemplo 123',
    location: 'LIMA / LIMA / MIRAFLORES',
    coordinator: 'Ana López',
    type: 'IB',
    status: 'ACTIVE'
  },
  {
    id: '304592',
    name: 'BANCO DE SANGRE REGIONAL AREQUIPA',
    address: 'Calle Bolívar 456',
    location: 'AREQUIPA / AREQUIPA / CERCADO',
    coordinator: 'Luis Ramos Paredes',
    type: 'IA',
    status: 'INACTIVE'
  },
  {
    id: '404593',
    name: 'BANCO DE SANGRE DE PIURA',
    address: 'Av. Grau 789',
    location: 'PIURA / PIURA / CASTILLA',
    coordinator: 'María Fernanda Salas',
    type: 'IB',
    status: 'ACTIVE'
  },
  {
    id: '504594',
    name: 'BANCO DE SANGRE DE CHICLAYO',
    address: 'Jr. Bolognesi 120',
    location: 'LAMBAYEQUE / CHICLAYO / CHICLAYO',
    coordinator: 'Jorge Mendoza',
    type: 'IA',
    status: 'ACTIVE'
  },
  {
    id: '604595',
    name: 'BANCO DE SANGRE DE CUSCO',
    address: 'Av. El Sol 334',
    location: 'CUSCO / CUSCO / CUSCO',
    coordinator: 'Carla Huamán',
    type: 'IB',
    status: 'INACTIVE'
  },
  {
    id: '704596',
    name: 'BANCO DE SANGRE DE TACNA',
    address: 'Calle Industrial 56',
    location: 'TACNA / TACNA / TACNA',
    coordinator: 'José Vilca',
    type: 'IA',
    status: 'ACTIVE'
  },
  {
    id: '804597',
    name: 'BANCO DE SANGRE DE HUANCAYO',
    address: 'Jr. Ancash 202',
    location: 'JUNÍN / HUANCAYO / HUANCAYO',
    coordinator: 'Patricia Poma',
    type: 'IB',
    status: 'INACTIVE'
  },
  {
    id: '904598',
    name: 'BANCO DE SANGRE DE PUCALLPA',
    address: 'Av. Amazonas 87',
    location: 'UCAYALI / CORONEL PORTILLO / PUCALLPA',
    coordinator: 'Edgar Yupanqui',
    type: 'IA',
    status: 'ACTIVE'
  },
  {
    id: '1004599',
    name: 'BANCO DE SANGRE DE IQUITOS',
    address: 'Malecón Tarapacá 150',
    location: 'LORETO / MAYNAS / IQUITOS',
    coordinator: 'Daniela Ríos',
    type: 'IB',
    status: 'INACTIVE'
  },
  {
    id: '1104600',
    name: 'BANCO DE SANGRE DE AYACUCHO',
    address: 'Av. Independencia 71',
    location: 'AYACUCHO / HUAMANGA / AYACUCHO',
    coordinator: 'Victor Quispe',
    type: 'IA',
    status: 'ACTIVE'
  }
];

let fakeBloodBanks = loadFromStorage(LOCAL_STORAGE_KEYS.BLOOD_BANKS, defaultBloodBanks);

const PAGE_SIZE = 6;
const getBloodBanks = async (filters = {}, page = 0) => {
  let filtered = fakeBloodBanks.filter((bloodBank) => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null || value === '') return true;
      if (key == 'search') {
        key = 'name';
      }
      const field = String(bloodBank[key] || '').toLowerCase();
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

const getBloodBank = async (bloodBankId) => {
  const role = fakeBloodBanks.find((r) => r.id === bloodBankId);
  return role;
};

const toogleStatusBloodBank = async (bloodBankId) => {
  const bloodBank = fakeBloodBanks.find((r) => r.id === bloodBankId);
  if (bloodBank) {
    bloodBank.status = bloodBank.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    saveToStorage(LOCAL_STORAGE_KEYS.BLOOD_BANKS, fakeBloodBanks);
    return bloodBank;
  }
  return null;
};

export default {
  getBloodBanks,
  getBloodBank,
  toogleStatusBloodBank
};
