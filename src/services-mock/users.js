const getUsers = async (filters = {}, page = 1) => {
    console.log('*** Service getUsers');
    const users = [
        { id: 10000, name: 'Juan Perez', email: 'juan.pperez@gmail.com', phone: 999999999, role: 'Admin', status: 'activo' },
        { id: 20000, name: 'Maria López', email: 'maria.lopez@gmail.com', phone: 999111111, role: 'Laboratorista', status: 'activo' },
        { id: 3, name: 'Carlos García', email: 'carlos.garcia@gmail.com', phone: 999222333, role: 'Hematologo', status: 'inactivo' },
        { id: 4, name: 'Ana Torres', email: 'ana.torres@gmail.com', phone: 987987987, role: 'Enfermero', status: 'activo' },
        { id: 5, name: 'Luis Fernández', email: 'luis.fernandez@gmail.com', phone: 987111555, role: 'user', status: 'eliminado' },
        { id: 6, name: 'Elena Ramírez', email: 'elena.ramirez@gmail.com', phone: 987333444, role: 'Patologo', status: 'activo' },
        { id: 7, name: 'Ricardo Mendoza adasd as sdf sd fsd f sd fsd f sd fsd f ds f dasd asdasd asdasd', email: 'ricardo.mendoza@gmail.com', phone: 987333000, role: 'Coordinador', status: 'active' },
        { id: 8, name: 'Gabriela Rojas', email: 'gabriela.rojas@gmail.com', phone: 987333777, role: 'Admin', status: 'inactive' },
        { id: 9, name: 'Javier Castro', email: 'javier.castro@gmail.com', phone: 987000111, role: 'Enfermero', status: 'activo' },
        { id: 10, name: 'Paula Navarro', email: 'paula.navarro@gmail.com', phone: 987323461, role: 'Hematologo', status: 'eliminado' },
        { id: 11, name: 'Paula Navarro', email: 'paula.navarro@gmail.com', phone: 987392817, role: 'Hematologo', status: 'eliminado' },
        { id: 12, name: 'Paula Navarro', email: 'paula.navarro@gmail.com', phone: 987392817, role: 'Hematologo', status: 'eliminado' },
        { id: 13, name: 'Paula Navarro', email: 'paula.navarro@gmail.com', phone: 987392817, role: 'Hematologo', status: 'eliminado' },
        { id: 14, name: 'Paula Navarro', email: 'paula.navarro@gmail.com', phone: 987392817, role: 'Hematologo', status: 'eliminado' }
    ];

    let filtered = users;
    for (const key in filters) {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
            filtered = filtered.filter((u) => u[key].includes(filters[key]));
        }
    }

    const pageSize = 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filtered.slice(startIndex, endIndex);

    return {
        data: paginatedData,
        totalRecords: filtered.length
    };
};

const newUser = async (user) => {
    console.log('*** Service newUser');
    return user;
};

export default {
    getUsers,
    newUser
};
