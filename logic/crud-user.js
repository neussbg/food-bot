const { addUser } = require('../api/user-api');
const { User } = require('../db');

async function createUser(bot, callbackQuery, role) {
  const chatId = callbackQuery.message.chat.id;
  const { id, first_name } = callbackQuery.from;

  try {
    // Создаем нового пользователя в базе данных

    await addUser(chatId, first_name, role);

    // Сообщение о успешной регистрации после создания
    await bot.sendMessage(
      chatId,
      `Регистрация прошла успешно, ${first_name}. Теперь вы являетесь поставщиком`
    );

    return true; // Сообщаем, что пользователь успешно создан
  } catch (error) {
    console.error('Ошибка создания пользователя:', error);

    return false; // Сообщаем об ошибке создания пользователя
  }
}

// async function getUser(chatId, id) {
//   const user = await User.findOne({
//     where: { chatId: chatId.toString(), id: Number(id) },
//   });

//   return user;
// }

async function updateUserRole(bot, callbackQuery, newRole) {
  const chatId = callbackQuery.message.chat.id;
  const { id, first_name } = callbackQuery.from;

  try {
    const user = await User.findOne({
      where: { chatId, id: Number(id) },
    });

    if (user.role === newRole) {
      await bot.sendMessage(chatId, `Новая роль соответствует текущей`);

      return false;
    }

    if (!['customer', 'seller'].includes(newRole)) {
      throw new Error(`Недопустимая роль: ${newRole}`);
    }

    const result = await User.update({ role: newRole }, { where: { chatId } });

    if (result[0] === 0) {
      console.log(`Пользователь с chatId ${chatId} не найден.`);
    } else {
      console.log(
        `Роль пользователя с chatId ${chatId} обновлена на ${newRole}.`
      );
    }

    return true;
  } catch (error) {
    console.error('Ошибка при обновлении роли пользователя:', error);

    return false;
  }
}

module.exports = { createUser, updateUserRole };
