const { getUserById } = require('../../server/controllers/user-controller');
const { createUser } = require('../logic/user-logic');

async function login(bot, callbackQuery) {
  const { data } = callbackQuery;

  const seller = 'send_orders';
  const customer = 'receive_orders';

  try {
    const { id } = callbackQuery.from;

    const user = await getUserById(id);

    if (data === seller) {
      return await sellerUser(bot, user, callbackQuery);
    }

    if (data === customer) {
      return await customerUser(bot, user, callbackQuery);
    }
  } catch (error) {
    console.error('Ошибка при регистрации или авторизации:', error);

    return false;
  } finally {
    bot.answerCallbackQuery(callbackQuery.id);
  }
}

async function sellerUser(bot, user, callbackQuery) {
  const chatId = callbackQuery.message.chat.id;
  const { first_name } = callbackQuery.from;

  try {
    if (user && user.role === 'seller') {
      await bot.sendMessage(chatId, `Добро пожаловать ${first_name}!`);

      return true;
    } else if (user) {
      await bot.sendMessage(
        chatId,
        `${first_name} - Похоже вы уже зарегистрировались как получатель заказа`
      );

      return false;
    } else {
      await bot.sendMessage(
        chatId,
        `${first_name}, вы еще не зарегистрированы, сейчас мы это исправим!`
      );

      // Создаем нового пользователя в базе данных
      return await createUser(bot, callbackQuery, 'seller');
    }
  } catch (error) {
    console.error('Ошибка идентификации пользователя', error);

    return false;
  }
}

async function customerUser(bot, user, callbackQuery) {
  const chatId = callbackQuery.message.chat.id;
  const { first_name } = callbackQuery.from;

  try {
    if (user && user.role !== 'customer') {
      await bot.sendMessage(
        chatId,
        `${first_name} - Похоже вы уже зарегистрировались как отправитель заказа`
      );
      return false;
    }
  } catch (error) {
    console.error('Ошибка идентификации пользователя', error);

    return false;
  }
}

module.exports = { login };
