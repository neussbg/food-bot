// db.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
});

// Модель пользователя
const User = sequelize.define('User', {
  chatId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true, // Указание, что это первичный ключ
    autoIncrement: true, // Автоинкремент для генерации уникальных значений
  },
  role: {
    type: DataTypes.ENUM('customer', 'seller'),
    allowNull: false,
  },
});

// Модель заказа
const Order = sequelize.define('Order', {
  items: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Связь между пользователями и заказами
User.hasMany(Order);
Order.belongsTo(User);

// Синхронизируем модели с базой данных
sequelize.sync();

module.exports = { sequelize, User, Order };
