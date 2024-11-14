const express = require('express');
const { User } = require('../../db');
const router = express.Router();

// Получение всех пользователей
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Ошибка при получении пользователей:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получение пользователя по id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json(user);
  } catch (error) {
    console.error('Ошибка при получении пользователя:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Добавление нового пользователя
router.post('/', async (req, res) => {
  const { name, id, role } = req.body;
  try {
    const newUser = await User.create({ id, name, role });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Удаление пользователя по id
router.delete('/:id', async (req, res) => {
  const { id } = req.params; // Извлекаем id из параметров URL
  try {
    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    await user.destroy(); // Удаляем пользователя из базы данных
    res.status(200).json({ message: 'Пользователь удален' });
  } catch (error) {
    console.error('Ошибка при удалении пользователя:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
