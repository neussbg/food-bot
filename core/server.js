// server.js
const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json()); // Middleware для обработки JSON

// Подключение файлов с маршрутами
const companyRoutes = require('../server/routes/companies-route');
const userRoutes = require('../server/routes/user-route');
const deliveryRoutes = require('../server/routes/delivery-route');

// Главная страница
app.get('/', (req, res) => {
  res.send('API и Telegram-бот работают');
});

// Использование маршрутов
app.use('/api/companies', companyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/delivery', deliveryRoutes);

// Функция запуска сервера
function startServer() {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = startServer;
