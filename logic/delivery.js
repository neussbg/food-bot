const { sequelize, User, Order, Delivery } = require('../db');

// async function createPosition(bot, msg) {
//   const chatId = msg.chat.id;
//   const namePosition = msg.text;

//   const { id, first_name } = msg.from;

//   try {
//     const delivery = await Delivery.create({
//       position: msg.text,
//       supplierId: id, // Предполагается, что id — это ID поставщика
//       //   supplierName: first_name, // Поле изменено на supplierName
//     });

//     bot.sendMessage(
//       chatId,
//       `Доставка ${msg.text} была добавлена, ${first_name} теперь является поставщиком`
//     );

//     return delivery;
//   } catch (error) {
//     console.error('Ошибка создания доставки:', error);
//     bot.sendMessage(
//       chatId,
//       'Произошла ошибка при добавлении доставки. Пожалуйста, попробуйте снова.'
//     );
//     return null; // Возвращаем null или другую подходящую ошибку, если создать не удалось
//   }
// }

// async function getPosition() {
//   try {
//     const delivery = await Delivery.findAll();

//     return delivery;
//   } catch {
//     console.error('Ошибка создания доставки');

//     return null;
//   }
// }

// module.exports = { getPosition };
