const { showStartMenu } = require('./menu');
const {
  addUser,
  getUserById,
  getUsers,
} = require('../../server/controllers/user-controller');

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
