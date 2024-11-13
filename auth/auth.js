const { User, Order } = require('../db'); // Подключаем модель пользователя

async function login(bot, msg) {
  const chatId = msg.chat.id;
  const { id, first_name } = msg.from;

  const seller = 'Хочу отправлять заказы';
  const customer = 'Хочу получать заказы';

  // Функция всегда должна возвращать Promise<boolean>
  try {
    const user = await User.findOne({
      where: { chatId: chatId.toString(), id: Number(id) },
    });

    if (msg.text === seller) {
      // Ищем пользователя в базе данных по chatId и id

      if (user && user.role !== 'seller') {
        bot.sendMessage(
          chatId,
          `${first_name} - Похоже вы уже зарегестрировались раньше, как получатель заказа`
        );

        return false;
      }

      if (user) {
        bot.sendMessage(chatId, `Добро пожаловать ${first_name}!`);

        return true;
      } else {
        bot.sendMessage(
          chatId,
          `${first_name}, вы еще не зарегистрированы в системе, сейчас мы это исправим!`
        );

        // Создаем нового пользователя в базе данных
        await User.create({
          chatId: chatId,
          id: Number(id),
          role: 'seller',
        });

        // Отправляем успешное сообщение после регистрации
        setTimeout(() => {
          bot.sendMessage(
            chatId,
            `Регистрация прошла успешно ${first_name}, теперь вы являетесь поставщиком`
          );
        }, 2000);

        // Возвращаем успешный результат
        return true;
      }
    }

    if (msg.text === customer) {
      if (user && user.role !== 'customer') {
        bot.sendMessage(
          chatId,
          `${first_name} - Похоже вы уже зарегестрировались раньше, как отправитель заказа`
        );

        return false;
      }
    }
  } catch (error) {
    console.error('Ошибка при регистрации или авторизации:', error);

    // Возвращаем false в случае ошибки
    return false;
  }
}

module.exports = { login };
