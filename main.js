require('events').EventEmitter.defaultMaxListeners = 15;

const TelegramBot = require('node-telegram-bot-api');
const token = '7620855898:AAERyvHFL1QINPkaWHE3Z_Cw6ZUnKXAyZh0';
const bot = new TelegramBot(token, { polling: true });

const { initStartCommand } = require('./commands/start');

// Инициализируем команды
initStartCommand(bot);
// initMenuCommands(bot);
