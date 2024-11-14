// server.js
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware для обработки JSON

// Подключение файлов с маршрутами
const companyRoutes = require('../routes/companies');
const userRoutes = require('../routes/user');
const deliveryRoutes = require('../routes/delivery');

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
