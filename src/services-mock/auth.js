const login = async (username, password) => {
  console.log('*** Service login');
  if (username === '' || password === '') {
    return null;
  }
  return {
    token: 'token',
    user: 'user'
  };
};

const register = async (username, password, password_confirmed) => {
  console.log('*** Service register');
  if (username === '' || password === '' || password_confirmed === '') {
    return null;
  }
  return {
    token: 'token',
    user: 'user'
  };
};

const logout = async () => {
  console.log('*** Service logout');
};

export default {
  login,
  register,
  logout
};
