const { showStartMenu } = require('./menu');
const { addUser, getUserById, getUsers } = require('../api/user-api');

// Инициализация команды /start
module.exports.initStartCommand = (bot) => {
  bot.onText(/\/start/, async (msg) => {
    const userId = msg.chat.id;

    if (msg.from.is_bot) {
      await bot.sendMessage(userId, `К сожалению ботов не обслуживаем (`);

      return;
    }

    // const user = await getUser(chatId, msg.from.id);

    await showStartMenu(bot, userId);
  });
};
