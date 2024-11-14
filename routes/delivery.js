const express = require('express');
const { Delivery, Op } = require('../db');
const router = express.Router();

// Получение всех доставок
router.get('/', async (req, res) => {
  try {
    const users = await Delivery.findAll();
    res.json(users);
  } catch (error) {
    console.error('Ошибка при получении доставок:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Добавление новой доставки
router.post('/', async (req, res) => {
  const { deliveryName, supplierId } = req.body;
  try {
    const newUser = await Delivery.create({ deliveryName, supplierId });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Ошибка при создании доставки:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Удаление доставки по id
router.delete('/:id', async (req, res) => {
  const { deliveryName } = req.params; // Извлекаем id из параметров URL
  try {
    const user = await Delivery.findOne({ where: { deliveryName } });

    if (!user) {
      return res.status(404).json({ error: 'Доставка не найдена' });
    }

    await user.destroy(); // Удаляем пользователя из базы данных
    res.status(200).json({ message: 'Доставка удалена' });
  } catch (error) {
    console.error('Ошибка при удалении доставки:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Поиск доставки по наименованию
router.get('/search', async (req, res) => {
  const { deliveryName } = req.query; // Получаем параметр deliveryName из query строки

  try {
    if (!deliveryName) {
      return res
        .status(400)
        .json({ error: 'Параметр deliveryName обязателен' });
    }

    const delivery = await Delivery.findOne({
      where: {
        deliveryName: {
          [Op.like]: `%${deliveryName}%`, // Используем LIKE для поиска по частичному совпадению
        },
      },
    });

    if (delivery.length === 0) {
      return res.status(404).json({ error: 'Доставка не найдена' });
    }

    res.json(delivery); // Возвращаем найденную доставку
  } catch (error) {
    console.error('Ошибка при поиске доставки:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
