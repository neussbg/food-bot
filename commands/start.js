const { showStartMenu } = require('./menu');

// Инициализация команды /start
module.exports.initStartCommand = (bot) => {
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    showStartMenu(bot, chatId);
  });
};
