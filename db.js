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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
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

// Модель Поставщика
const Supplier = sequelize.define('Supplier', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Модель доставок
const Delivery = sequelize.define('Delivery', {
  position: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  supplierId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
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

// User.hasMany(Order)
// Order.belongsTo(User)
// User.hasMany(Order);
// Order.belongsTo(User);
User.hasMany(Delivery);
Delivery.belongsTo(User);

// Синхронизируем модели с базой данных

sequelize.sync();
// sequelize
//   .sync({ force: true })
//   .then(() => {
//     console.log('Таблицы синхронизированы');
//   })
//   .catch((error) => {
//     console.error('Ошибка при синхронизации таблиц:', error);
//   });

module.exports = { sequelize, User, Order, Delivery, Supplier };
