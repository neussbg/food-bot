const { sequelize, User, Order } = require('../db');

async function login(bot, callbackQuery) {
  const chatId = callbackQuery.message.chat.id;
  const { id, first_name } = callbackQuery.from;
  const data = callbackQuery.data;

  const seller = 'send_orders';
  const customer = 'receive_orders';

  try {
    const user = await User.findOne({
      where: { chatId: chatId.toString(), id: Number(id) },
    });

    if (data === seller) {
      if (user && user.role !== 'seller') {
        bot.sendMessage(
          chatId,
          `${first_name} - Похоже вы уже зарегистрировались как получатель заказа`
        );
        return false;
      }

      if (user) {
        return new Promise((resolve) => {
          bot.sendMessage(chatId, `Добро пожаловать ${first_name}!`);
          setTimeout(() => resolve(true), 200);
        });
      } else {
        bot.sendMessage(
          chatId,
          `${first_name}, вы еще не зарегистрированы, сейчас мы это исправим!`
        );

        // Создаем нового пользователя в базе данных
        return await User.create({
          chatId: chatId,
          id: Number(id),
          name: first_name,
          role: 'seller',
        })
          .then(() => {
            return new Promise((resolve) => {
              setTimeout(() => {
                bot.sendMessage(
                  chatId,
                  `Регистрация прошла успешно, ${first_name}. Теперь вы являетесь поставщиком`
                );
                resolve(true);
              }, 2000);
            });
          })
          .catch((error) => {
            console.error('Ошибка создания пользователя:', error);
            return false;
          });
      }
    }

    if (data === customer) {
      if (user && user.role !== 'customer') {
        bot.sendMessage(
          chatId,
          `${first_name} - Похоже вы уже зарегистрировались как отправитель заказа`
        );
        return false;
      }
    }
  } catch (error) {
    console.error('Ошибка при регистрации или авторизации:', error);
    return false;
  } finally {
    // Подтверждаем получение callback, чтобы убрать "часики" на кнопке
    bot.answerCallbackQuery(callbackQuery.id);
  }
}

module.exports = { login };
