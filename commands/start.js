const { showStartMenu } = require('./menu');

// Инициализация команды /start
module.exports.initStartCommand = (bot) => {
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;

    await showStartMenu(bot, chatId);
  });
};
