// db.js
const { Sequelize, DataTypes, Op } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database', 'database.sqlite'),
});

const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, // Автоинкремент для автоматической генерации ID
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

// Модель пользователя
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('customer', 'seller'),
    allowNull: false,
  },
});

// Модель доставок
const Delivery = sequelize.define('Delivery', {
  deliveryName: {
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

// Связь между пользователями и заказами

// User.belongsTo(Company, { foreignKey: 'companyId' }); // Связываем пользователя с компанией
// Company.hasMany(User, { foreignKey: 'companyId' }); // Компания может иметь множество пользователей
User.hasMany(Delivery);
Delivery.belongsTo(User);

// Синхронизируем модели с базой данных

sequelize.sync();

module.exports = { sequelize, Op, User, Delivery, Company };
