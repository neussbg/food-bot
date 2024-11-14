const express = require('express');
const { Company } = require('../../db'); // Импорт модели Company
const router = express.Router();

// Получение всех компаний
router.get('/', async (req, res) => {
  try {
    const companies = await Company.findAll();
    res.json(companies);
  } catch (error) {
    console.error('Ошибка при получении компаний:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получение компании по id
router.get('/:id', async (req, res) => {
  const { id } = req.params; // Извлекаем id из параметров URL
  try {
    const company = await Company.findOne({ where: { id } });

    if (!company) {
      return res.status(404).json({ error: 'Компания не найдена' });
    }

    res.json(company);
  } catch (error) {
    console.error('Ошибка при получении компании:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Добавление новой компании
router.post('/', async (req, res) => {
  const { name } = req.body;
  try {
    const newCompany = await Company.create({ name });
    res.status(201).json(newCompany);
  } catch (error) {
    console.error('Ошибка при создании компании:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Удаление компании по id
router.delete('/:id', async (req, res) => {
  const { id } = req.params; // Извлекаем id из параметров URL
  try {
    const company = await Company.findOne({ where: { id } });

    if (!company) {
      return res.status(404).json({ error: 'Компания не найдена' });
    }

    await company.destroy(); // Удаляем компанию из базы данных
    res.status(200).json({ message: 'Компания удалена' });
  } catch (error) {
    console.error('Ошибка при удалении компании:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
