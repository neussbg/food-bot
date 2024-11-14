const axios = require('axios');

async function getDeliveries() {
  try {
    const response = await axios.get('http://localhost:3000/api/delivery');

    return response.data;
  } catch (error) {
    console.error('Ошибка при получении доставок:', error);

    return null;
  }
}

async function addDelivery(deliveryName, supplierId) {
  const payload = {
    deliveryName,
    supplierId,
  };

  try {
    const response = await axios.post(
      'http://localhost:3000/api/delivery',
      payload
    );

    return response.data;
  } catch (error) {
    console.error('Ошибка при добавлении доставки:', error);

    return null;
  }
}

async function getDeliveryByName(name) {
  try {
    const response = await axios.get(
      'http://localhost:3000/api/delivery/search',
      {
        params: {
          deliveryName: name,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Доставка не найдена');
    } else {
      console.error('Ошибка при запросе к API:', error);
    }

    return null;
  }
}

module.exports = { getDeliveries, addDelivery, getDeliveryByName };
