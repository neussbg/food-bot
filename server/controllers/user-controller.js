const axios = require('axios');

async function getUsers() {
  try {
    const response = await axios.get('http://localhost:3000/api/users');

    return response.data;
  } catch (error) {
    console.error('Ошибка при получении пользователей:', error);

    return null;
  }
}

async function addUser(id, name, role) {
  const payload = {
    id,
    name,
    role,
  };

  try {
    const response = await axios.post(
      'http://localhost:3000/api/users',
      payload
    );

    return response.data;
  } catch (error) {
    console.error('Ошибка при добавлении пользователя:', error);

    return null;
  }
}

async function getUserById(id) {
  try {
    const response = await axios.get(`http://localhost:3000/api/users/${id}`);

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error('Пользователь не найден');
    } else {
      console.error('Ошибка при запросе к API:', error);
    }

    return null;
  }
}

module.exports = { getUsers, addUser, getUserById };
